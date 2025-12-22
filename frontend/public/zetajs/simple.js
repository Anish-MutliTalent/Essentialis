'use strict';

Module.zetajs.then(async (z) => {
  const context = await z.getUnoComponentContext();
  const smgr = context.getServiceManager();
  const desktop = await smgr.createInstanceWithContext('com.sun.star.frame.Desktop', context);
  const sfa = await smgr.createInstanceWithContext('com.sun.star.ucb.SimpleFileAccess', context);

  let currentDoc = null;
  let lastReportedSlide = 0;
  const channel = new BroadcastChannel('zeta_channel');

  // Helper to get current slide info
  const getSlideCounts = async () => {
    try {
      if (!currentDoc) return { current: 0, total: 0 };
      
      const controller = await currentDoc.getCurrentController();
      const drawPages = await currentDoc.getDrawPages();
      const total = await drawPages.getCount();
      
      let current = 1;
      try {
        const currentPageObj = await controller.getCurrentPage();
        
        // Try to get a unique identifier for the current page
        let currentPageName = '';
        try {
          currentPageName = await currentPageObj.getName();
        } catch (e) {
          // getName might not work
        }
        
        console.log(`Current page name: "${currentPageName}"`);
        
        // Manually iterate to find current page by comparing names
        for (let i = 0; i < total; i++) {
          const page = await drawPages.getByIndex(i);
          try {
            const pageName = await page.getName();
            console.log(`  Slide ${i + 1} name: "${pageName}"`);
            if (pageName === currentPageName && currentPageName !== '') {
              current = i + 1;
              console.log(`  -> Found match at index ${i}`);
              break;
            }
          } catch (e) {
            // Skip if getName fails
          }
        }
      } catch (e) {
        console.log('Could not determine current slide:', e);
        current = 1;
      }
      
      console.log(`getSlideCounts returning: current=${current}, total=${total}`);
      return { current: Math.max(1, Math.min(current, total)), total };
    } catch (e) {
      console.error('Error getting slide counts:', e);
      return { current: 0, total: 0 };
    }
  };

  // Helper to report slide update to React
  const reportSlideUpdate = async () => {
    const counts = await getSlideCounts();
    channel.postMessage({ 
      type: 'SLIDE_UPDATE', 
      current: counts.current, 
      total: counts.total 
    });
  };

  channel.onmessage = async (event) => {
    const msg = event.data;

    // --- HANDLE RESIZE COMMAND ---
    if (msg.type === 'SET_VIEWER_SIZE') {
      try {
        const frame = await desktop.getCurrentFrame();
        if (frame) {
          const window = await frame.getContainerWindow();
          console.log(`Worker: Resizing viewer to ${msg.width}x${msg.height}`);
          await window.setPosSize(0, 0, Math.floor(msg.width*msg.dpr-5), Math.floor(msg.height*msg.dpr), 15);
          const dispatcher = await smgr.createInstanceWithContext('com.sun.star.frame.DispatchHelper', context);
          const provider = await frame.queryInterface('com.sun.star.frame.XDispatchProvider');
        }
      } catch (e) {
        console.log('Frame not ready yet');
      }
      return;
    }

    if (msg.type === 'LOAD_PPT') {
      try {
        channel.postMessage({ type: 'REQUEST_CURRENT_SIZE' });
        
        const int8View = new Int8Array(msg.data);
        const url = 'file:///tmp/presentation.pptx';
        if (!await sfa.exists('file:///tmp')) await sfa.createFolder('file:///tmp');
        
        const pipe = await smgr.createInstanceWithContext('com.sun.star.io.Pipe', context);
        const chunkSize = 65536; 
        for (let i = 0; i < int8View.length; i += chunkSize) {
          const chunk = Array.from(int8View.subarray(i, Math.min(i + chunkSize, int8View.length)));
          await pipe.writeBytes(chunk);
        }
        await pipe.closeOutput();
        
        if (await sfa.exists(url)) await sfa.kill(url);
        await sfa.writeFile(url, pipe);
        
        const loadProps = [
          { Name: 'ReadOnly', Handle: -1, Value: true, State: 0 },
          { Name: 'OpenReadOnly', Handle: -1, Value: true, State: 0 }
        ];
        
        currentDoc = await desktop.loadComponentFromURL(url, '_default', 0, loadProps);
        const controller = await currentDoc.getCurrentController();
        const frame = await controller.getFrame();

        // Hide UI
        const lm = await frame.getPropertyValue('LayoutManager');
        if (lm) {
          await lm.setVisible(false);
          await lm.lock();
        }


        // Hide Sidebar/Menus via Dispatcher
        const dispatcher = await smgr.createInstanceWithContext('com.sun.star.frame.DispatchHelper', context);
        const provider = await frame.queryInterface('com.sun.star.frame.XDispatchProvider');
        await dispatcher.executeDispatch(provider, '.uno:MenuBarVisible', '', 0, [{ Name: 'MenuBarVisible', Value: false }]);
        await dispatcher.executeDispatch(provider, '.uno:Sidebar', '', 0, [{ Name: 'Sidebar', Value: false }]);

        console.log('Worker: Sizing and UI layout finalized');
        
        // Report initial slide count
        setTimeout(() => reportSlideUpdate(), 100);
        
      } catch (err) {
        console.error('Worker Error:', err);
      }
      return;
    }

    if (msg.type === 'NAV_SLIDE') {
      try {
        console.log(`\n=== NAV_SLIDE: ${msg.direction} ===`);
        const controller = await currentDoc.getCurrentController();
        const drawPages = await currentDoc.getDrawPages();
        const total = await drawPages.getCount();
        
        // Get current index by comparing page names
        let idx = 0;
        try {
          const currentPageObj = await controller.getCurrentPage();
          let currentPageName = '';
          try {
            currentPageName = await currentPageObj.getName();
          } catch (e) {}
          
          console.log(`Before nav - Current page name: "${currentPageName}"`);
          
          for (let i = 0; i < total; i++) {
            const page = await drawPages.getByIndex(i);
            try {
              const pageName = await page.getName();
              if (pageName === currentPageName && currentPageName !== '') {
                idx = i;
                console.log(`Found at index ${i}, page name: "${pageName}"`);
                break;
              }
            } catch (e) {}
          }
        } catch (e) {
          console.log('Could not determine current page for navigation:', e);
          idx = 0;
        }

        console.log(`Current idx: ${idx}, total: ${total}`);
        
        // Navigate
        if (msg.direction === 'NEXT' && idx < total - 1) {
          console.log(`Navigating NEXT: slide ${idx + 1} -> ${idx + 2}`);
          const nextPage = await drawPages.getByIndex(idx + 1);
          await controller.setCurrentPage(nextPage);
          console.log(`Navigation command sent`);
        } else if (msg.direction === 'PREV' && idx > 0) {
          console.log(`Navigating PREV: slide ${idx + 1} -> ${idx}`);
          const prevPage = await drawPages.getByIndex(idx - 1);
          await controller.setCurrentPage(prevPage);
          console.log(`Navigation command sent`);
        } else {
          console.log(`Navigation BLOCKED: direction=${msg.direction}, idx=${idx}, total=${total}`);
        }
        
        // Report updated slide info
        setTimeout(() => reportSlideUpdate(), 100);
        
      } catch (e) { 
        console.error("Navigation error", e); 
      }
      return;
    }
  };

  channel.postMessage({ type: 'ZETA_READY' });
});