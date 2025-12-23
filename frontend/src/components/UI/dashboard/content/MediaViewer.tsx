// MediaViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import * as monaco from 'monaco-editor';
import { renderAsync } from 'docx-preview';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaExpand, 
  FaCompress,
  FaPlus,
  FaMinus,
  FaUndo,
  FaFileArchive,
  FaFolder,
  FaFile,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { LoadingSpinner } from '../../index';

import 'luckysheet/dist/plugins/css/pluginsCss.css';
import 'luckysheet/dist/plugins/plugins.css';
import 'luckysheet/dist/css/luckysheet.css';
import 'luckysheet/dist/assets/iconfont/iconfont.css';
import 'luckysheet/dist/plugins/js/plugin';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  '/pdf.worker.min.js',
  import.meta.url
).toString();

interface MediaViewerProps {
  fileUrl: string;
  fileType: string;
  containerClassName?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ 
  fileUrl, 
  fileType,
  containerClassName = 'w-full h-96 border border-gray-700 rounded bg-black/5'
}) => {
  const type = fileType.toLowerCase().trim();

  // Images
  if (type.startsWith('image/')) {
    return <ImageViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Videos
  if (type.startsWith('video/')) {
    return <VideoViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Audio
  if (type.startsWith('audio/')) {
    return <AudioViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // PDF
  if (type === 'application/pdf') {
    return <PDFViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Word Documents
  if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.oasis.opendocument.text'
  ) {
    return <DocxViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Spreadsheets
  if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.oasis.opendocument.spreadsheet' ||
    type === 'text/csv' ||
    type === 'application/csv'
  ) {
    return <SpreadsheetViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Presentations
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    type === 'application/vnd.oasis.opendocument.presentation'
  ) {
    return <PptViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Archives
  if (
    type === 'application/zip' ||
    type === 'application/x-zip-compressed' ||
    type === 'application/x-rar-compressed' ||
    type === 'application/x-7z-compressed' ||
    type === 'application/x-tar' ||
    type === 'application/gzip' ||
    type === 'application/x-gzip' ||
    type === 'application/x-bzip2'
  ) {
    return <ZipViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // Code/Text files (viewable)
  if (
    type.startsWith('text/') ||
    type === 'application/javascript' ||
    type === 'application/typescript' ||
    type === 'application/json' ||
    type === 'application/xml' ||
    type === 'application/x-yaml' ||
    type === 'application/sql'
  ) {
    return <CodeViewer fileUrl={fileUrl} containerClassName={containerClassName} />;
  }

  // E-books (unsupported for now)
  if (
    type === 'application/epub+zip' ||
    type === 'application/x-mobipocket-ebook' ||
    type === 'application/vnd.amazon.ebook'
  ) {
    return <UnsupportedViewer fileUrl={fileUrl} fileType={type} containerClassName={containerClassName} />;
  }

  // Fonts (unsupported)
  if (
    type.startsWith('font/') ||
    type === 'application/font-woff' ||
    type === 'application/x-font-ttf' ||
    type === 'application/x-font-otf'
  ) {
    return <UnsupportedViewer fileUrl={fileUrl} fileType={type} containerClassName={containerClassName} />;
  }

  // Default fallback
  return <UnsupportedViewer fileUrl={fileUrl} fileType={type} containerClassName={containerClassName} />;
};

// Unsupported File Viewer
const UnsupportedViewer: React.FC<{ 
  fileUrl: string; 
  fileType: string; 
  containerClassName: string 
}> = ({ fileUrl, fileType, containerClassName }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [forceTextView, setForceTextView] = useState(false);

  if (forceTextView) {
    return (
      <CodeViewer
        fileUrl={fileUrl}
        containerClassName={containerClassName}
      />
    );
  }

  const getFileTypeName = (type: string) => {
    if (type.includes('msdownload') || type.includes('msdos')) return 'Executable';
    if (type.includes('android')) return 'Android App';
    if (type.includes('apple-diskimage')) return 'Mac Disk Image';
    if (type.includes('debian')) return 'Debian Package';
    if (type.includes('epub')) return 'EPUB Book';
    if (type.includes('mobipocket') || type.includes('amazon.ebook')) return 'E-book';
    if (type.includes('pgp')) return 'Encrypted File';
    if (type.includes('photoshop')) return 'Photoshop File';
    if (type.includes('illustrator') || type.includes('postscript')) return 'Illustrator File';
    if (type.startsWith('font/')) return 'Font File';
    if (type.includes('octet-stream')) return 'Binary File';
    return 'File';
  };

  return (
    <div className={containerClassName}>
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gray-900 text-white p-8">

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FaFile className="w-20 h-20 text-gray-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-300">
              We still don't support previewing this file type.
            </h3>
            <p className="text-sm text-gray-400">
              {getFileTypeName(fileType)} cannot be previewed in the browser
            </p>
            <p className="text-xs text-gray-600 font-mono">
              {fileType}
            </p>
          </div>
        </div>

        {/* Primary action */}
        <a
          href={fileUrl}
          download
          className="flex items-center gap-3 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-colors font-medium shadow-lg"
        >
          <FaDownload className="w-5 h-5" />
          <span>Download File</span>
        </a>

        {/* Advanced options */}
        <div className="w-full max-w-sm">
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <FaChevronRight
                className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
              />
              Advanced options
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
              <button
                onClick={() => setForceTextView(true)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors"
              >
                Open as text (may be garbled)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// PDF Viewer Component
const PDFViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  return (
    <div className={containerClassName}>
      <div className="w-full h-full relative">
        <div className="absolute top-2 right-2 z-10">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        <iframe
          src={fileUrl}
          className="w-full h-full border-none"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

// Image Viewer Component
const ImageViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const updateTransform = (newScale: number, newPos: { x: number; y: number }) => {
    if (!wrapperRef.current || !imgRef.current) return;

    const wr = wrapperRef.current.getBoundingClientRect();
    const imgW = imgRef.current.naturalWidth * newScale;
    const imgH = imgRef.current.naturalHeight * newScale;

    const maxX = Math.max((imgW - wr.width) / 2, 0);
    const maxY = Math.max((imgH - wr.height) / 2, 0);

    const cx = clamp(newPos.x, -maxX, maxX);
    const cy = clamp(newPos.y, -maxY, maxY);

    setPosition({ x: cx, y: cy });
    setScale(newScale);
  };

  const fitImage = () => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wr = wrapperRef.current.getBoundingClientRect();
    if (!imgRef.current.naturalWidth || !imgRef.current.naturalHeight || !wr.width || !wr.height) return;

    let newMinScale: number;
    if (imgRef.current.naturalHeight > imgRef.current.naturalWidth) {
      newMinScale = wr.height / imgRef.current.naturalHeight;
    } else {
      newMinScale = wr.width / imgRef.current.naturalWidth;
    }
    setMinScale(newMinScale);
    setScale(newMinScale);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleResize = () => fitImage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => {
    const newScale = clamp(scale * 1.25, minScale, 6);
    updateTransform(newScale, position);
  };

  const handleZoomOut = () => {
    const newScale = clamp(scale / 1.25, minScale, 6);
    const newPos = newScale <= minScale ? { x: 0, y: 0 } : position;
    updateTransform(newScale, newPos);
  };

  const handleReset = () => {
    updateTransform(minScale, { x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      handleReset();
      setLastTap(0);
      return;
    }
    setLastTap(now);

    if (scale <= minScale) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newPos = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    updateTransform(scale, newPos);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const prev = scale;
    const newScale = clamp(prev * (e.deltaY < 0 ? 1.12 : 0.88), minScale, 6);
    
    const newPos = {
      x: position.x - offsetX * (newScale / prev - 1),
      y: position.y - offsetY * (newScale / prev - 1)
    };
    
    updateTransform(newScale, newPos);
  };

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className="w-full h-full relative">
        <div className="absolute top-2 right-2 z-30">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        
        {/* Controls */}
        <div className="relative flex justify-center gap-2 p-2 z-20">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white"
          >
            <FaMinus />
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white"
          >
            <FaUndo />
          </button>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white"
          >
            <FaPlus />
          </button>
        </div>

        {/* Image Wrapper */}
        <div
          ref={wrapperRef}
          className="w-full overflow-hidden relative bg-black"
          style={{ 
            height: 'calc(100% - 48px)',
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        >
          <img
            ref={imgRef}
            src={fileUrl}
            alt="Document"
            draggable={false}
            onLoad={fitImage}
            className="absolute top-1/2 left-1/2 select-none"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
              transformOrigin: 'center center',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface AudioViewerProps {
  fileUrl: string;
  containerClassName?: string;
}

const AudioViewer: React.FC<AudioViewerProps> = ({
  fileUrl,
  containerClassName = "",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${containerClassName}`}
    >
      <div className="w-full max-w-sm bg-gray-900 rounded-xl shadow-xl p-5">
        {/* Artwork */}
        <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg mb-5 flex items-center justify-center">
          <span className="text-gray-400 text-sm tracking-wide">
            AUDIO TRACK
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center">
          <button
            onClick={togglePlayback}
            className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow hover:scale-105 transition"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          {/* Progress */}
          <div className="w-full mt-4 select-none">
  <input
    type="range"
    min={0}
    max={duration || 0}
    value={currentTime}
    onChange={(e) => {
      const time = Number(e.target.value);
      if (audioRef.current) audioRef.current.currentTime = time;
      setCurrentTime(time);
    }}
    className="
      w-full
      h-1.5
      rounded-full
      appearance-none
      cursor-pointer
      bg-gradient-to-r
      from-white
      to-white/30
      accent-white
      focus:outline-none
      transition-all
      hover:h-2
      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:h-4
      [&::-webkit-slider-thumb]:w-4
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:bg-white
      [&::-webkit-slider-thumb]:shadow-md
      [&::-webkit-slider-thumb]:transition
      [&::-webkit-slider-thumb]:hover:scale-110
      [&::-moz-range-thumb]:h-4
      [&::-moz-range-thumb]:w-4
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:bg-white
      [&::-moz-range-thumb]:border-0
    "
    style={{
      backgroundSize: `${(currentTime / (duration || 1)) * 100}% 100%`,
    }}
  />

  <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-mono">
    <span>{formatTime(currentTime)}</span>
    <span>{formatTime(duration)}</span>
  </div>
</div>

          {/* Actions */}
          <a
            href={fileUrl}
            download
            className="mt-4 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <FaDownload />
            Download
          </a>
        </div>

        <audio ref={audioRef} src={fileUrl} />
      </div>
    </div>
  );
};


// Video Viewer Component
const VideoViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!video || !canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!video.paused && !video.ended) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const videoAspect = video.videoWidth / video.videoHeight;
        const containerAspect = containerWidth / containerHeight;

        let drawWidth, drawHeight;
        if (videoAspect > containerAspect) {
          drawWidth = containerWidth;
          drawHeight = containerWidth / videoAspect;
        } else {
          drawHeight = containerHeight;
          drawWidth = containerHeight * videoAspect;
        }

        const offsetX = (containerWidth - drawWidth) / 2;
        const offsetY = (containerHeight - drawHeight) / 2;

        canvas.width = containerWidth;
        canvas.height = containerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        requestAnimationFrame(draw);
      }
    };

    video.onplay = draw;
    video.onloadedmetadata = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      setDuration(video.duration);
    };
    video.ontimeupdate = () => setCurrentTime(video.currentTime);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.volume = percent;
    setVolume(percent);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className="w-full h-full relative bg-black">
        <div className="absolute top-2 right-2 z-10">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        
        <canvas ref={canvasRef} className="w-full h-full" />
        <video ref={videoRef} src={fileUrl} className="hidden" />

        {/* Controls */}
        <div className="absolute bottom-0 left-0 w-full bg-gray-900/80 flex items-center gap-3 px-3 py-2">
          <button
            onClick={togglePlay}
            className="text-xl text-yellow-400 bg-transparent border-none cursor-pointer hover:text-yellow-300"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <span className="text-white text-xs whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div
            onClick={handleSeek}
            className="flex-1 h-1.5 bg-white/30 rounded cursor-pointer"
          >
            <div
              className="h-full bg-yellow-400 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400">
              {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </span>
            <div
              onClick={handleVolumeChange}
              className="w-20 h-1.5 bg-white/30 rounded cursor-pointer"
            >
              <div
                className="h-full bg-yellow-400 rounded"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-lg text-yellow-400 bg-transparent border-none cursor-pointer hover:text-yellow-300"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Docx Viewer Component
const DocxViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('DocxViewer fileUrl:', fileUrl);
  useEffect(() => {
  if (!containerRef.current) return;

  (async () => {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    const container = containerRef.current;
    if (!container) return;

    await renderAsync(arrayBuffer, container, undefined, {
      inWrapper: false,
      ignoreWidth: false,
      ignoreHeight: false,
    });
  })();
}, [fileUrl]);

  return (
    <div className={containerClassName}>
      <div className="w-full h-full relative">
        <div className="absolute top-2 right-2 z-10">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-auto overflow-x-auto bg-gray-200"
        />
      </div>
    </div>
  );
};

// Spreadsheet Viewer Component
const SpreadsheetViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetIdRef = useRef(`luckysheet_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!containerRef.current) return;

    fetch(fileUrl)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf, { type: 'array', cellStyles: true });

        const sheets = wb.SheetNames.map((name, index) => {
          const ws = wb.Sheets[name];
          const celldata: any[] = [];

          Object.keys(ws).forEach(addr => {
            if (addr.startsWith('!')) return;

            const cell = ws[addr];
            const { r, c } = XLSX.utils.decode_cell(addr);

            const v: any = {};

            if (cell.f) v.f = cell.f;
            if (cell.v !== undefined) v.v = cell.v;

            const s = cell.s;
            if (s) {
              if (s.font) {
                v.bl = s.font.bold ? 1 : 0;
                v.it = s.font.italic ? 1 : 0;
                v.fs = s.font.sz;
                v.ff = s.font.name;
                v.cl = s.font.underline ? 1 : 0;
                v.st = s.font.strike ? 1 : 0;

                if (s.font.color?.rgb) {
                  v.fc = '#' + s.font.color.rgb.slice(2);
                }
              }

              if (s.fill?.fgColor?.rgb) {
                v.bg = '#' + s.fill.fgColor.rgb.slice(2);
              }

              if (s.alignment) {
                const h = s.alignment.horizontal;
                const vAlign = s.alignment.vertical;

                v.ht = h === 'center' ? 1 : h === 'right' ? 2 : 0;
                v.vt = vAlign === 'middle' ? 1 : vAlign === 'bottom' ? 2 : 0;

                v.tb = s.alignment.wrapText ? 2 : 0;
                v.tr = s.alignment.textRotation || 0;
              }

              if (s.border) {
                v.bd = {};
                Object.entries(s.border).forEach(([side, def]: any) => {
                  if (!def) return;
                  v.bd[side] = {
                    style: 1,
                    color: def.color?.rgb
                      ? '#' + def.color.rgb.slice(2)
                      : '#000'
                  };
                });
              }

              if (s.numFmt) {
                v.ct = { fa: s.numFmt, t: 'n' };
              }
            }

            celldata.push({ r, c, v });
          });

          const merges = (ws['!merges'] || []).map((m: any) => ({
            r: m.s.r,
            c: m.s.c,
            rs: m.e.r - m.s.r + 1,
            cs: m.e.c - m.s.c + 1
          }));

          const columnlen = ws['!cols']?.map((c: any, i: number) => ({
            index: i,
            width: Math.round(c.wpx || 120)
          }));

          const rowlen = ws['!rows']?.map((r: any, i: number) => ({
            index: i,
            height: Math.round(r.hpx || 28)
          }));

          const ref = XLSX.utils.decode_range(ws['!ref'] || 'A1');

          return {
            name,
            index,
            order: index,
            status: index === 0 ? 1 : 0,
            row: ref.e.r + 1,
            column: ref.e.c + 1,
            celldata,
            merge: merges,
            columnlen,
            rowlen
          };
        });

        (window as any).luckysheet.create({
          container: sheetIdRef.current,
          data: sheets,
          allowEdit: false,
          showtoolbar: false,
          showinfobar: false,
          showstatisticBar: false,
          showsheetbar: true,
          defaultColWidth: 120,
          defaultRowHeight: 28
        });
      });
  }, [fileUrl]);

  return (
    <div className={containerClassName}>
      <div className="w-full h-full relative">
        <div className="absolute top-2 right-2 z-10">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        <div ref={containerRef} id={sheetIdRef.current} className="w-full h-full overflow-hidden" />
      </div>
    </div>
  );
};

// Code Viewer Component
const CodeViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({
  fileUrl,
  containerClassName
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    fetch(fileUrl)
      .then(r => r.text())
      .then(text => {
        // Dispose existing editor (important)
        if (editorRef.current) {
          editorRef.current.dispose();
          editorRef.current = null;
        }

        editorRef.current = monaco.editor.create(containerRef.current!, {
          value: text,
          readOnly: true,
          theme: 'vs-dark',
          minimap: { enabled: false },
          automaticLayout: true
        });
      })
      .catch(e => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color:#ccc;padding:16px">${e.message}</div>`;
        }
      });

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [fileUrl]);

  return (
    <div className={containerClassName}>
      <div className="w-full h-full relative">
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 z-10">
          <a
            href={fileUrl}
            download
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const ZipViewer: React.FC<{ fileUrl: string; containerClassName: string }> = ({ fileUrl, containerClassName }) => {
  const [zipContents, setZipContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(fileUrl)
      .then(r => r.arrayBuffer())
      .then(async (arrayBuffer) => {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const files: any[] = [];
        
        zip.forEach((relativePath, zipEntry) => {
          const internal = zipEntry as any;
          files.push({
            name: relativePath,
            isDirectory: zipEntry.dir,
            size: internal._data?.uncompressedSize || 0,
            date: zipEntry.date
          });
        });

        // Sort: directories first, then files, alphabetically
        files.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });

        setZipContents(files);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [fileUrl]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const buildTree = () => {
    const tree: any = {};
    
    zipContents.forEach(file => {
      const parts = file.name.split('/').filter(Boolean);
      let current = tree;
      
      parts.forEach((part:any, idx:any) => {
        if (!current[part]) {
          current[part] = {
            isDirectory: idx < parts.length - 1 || file.isDirectory,
            size: file.size,
            date: file.date,
            children: {}
          };
        }
        current = current[part].children;
      });
    });
    
    return tree;
  };

  const renderTree = (node: any, path: string = '', level: number = 0) => {
    return Object.keys(node).map(key => {
      const item = node[key];
      const fullPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedFolders.has(fullPath);
      
      return (
        <div key={fullPath} style={{ marginLeft: `${level * 20}px` }}>
          <div 
            className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => item.isDirectory && toggleFolder(fullPath)}
          >
            {item.isDirectory ? (
              <>
                <FaFolder className="text-yellow-400" />
                <span className="text-sm text-white">{key}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </>
            ) : (
              <>
                <FaFile className="text-gray-400" />
                <span className="text-sm text-white">{key}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatBytes(item.size)}
                </span>
              </>
            )}
          </div>
          
          {item.isDirectory && isExpanded && (
            <div>
              {renderTree(item.children, fullPath, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={containerClassName}>
      <div className="w-full h-full relative bg-gray-900">
        <div className="absolute top-2 right-2 z-10">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>

        <div className="w-full h-full overflow-auto p-4 pt-16">
          <div className="flex items-center gap-2 mb-4">
            <FaFileArchive className="text-yellow-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Archive Contents</h3>
          </div>

          {loading && (
            <div className="text-center text-gray-400 py-8">
              Loading archive...
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 py-8">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-3">
                {zipContents.length} items
              </div>
              {renderTree(buildTree())}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PptViewer: React.FC<{ fileUrl: string, containerClassName?: string }> = ({ fileUrl, containerClassName }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [_, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = new BroadcastChannel('zeta_channel');
    
    channel.onmessage = async (event) => {
      if (event.data.type === 'ZETA_READY') {
        console.log("React: Worker is ready. Fetching file...");
        setLoading(false);
        
        try {
          const res = await fetch(fileUrl);
          const buffer = await res.arrayBuffer();
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'LOAD_PPT', data: buffer },
            '*'
          );
          console.log("React: File data sent to iframe window");
        } catch (e) {
          console.error("React: Fetch error", e);
        }
      }
    };

    return () => channel.close();
  }, [fileUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel('zeta_channel');
    
    const handleMessage = (event:any) => {
      if (event.data.type === 'SLIDE_UPDATE') {
        setCurrentSlide(event.data.current);
        setTotalSlides(event.data.total);
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  useEffect(() => {
    // Inject dark mode styles into iframe
    if (iframeRef.current?.contentDocument) {
      const style = iframeRef.current.contentDocument.createElement('style');
      style.textContent = `
        html, body {
          background-color: #000 !important;
          color: #fff !important;
        }
        * {
          background-color: #000 !important;
          border-color: #000 !important;
        }
        canvas {
          background-color: #000 !important;
        }
      `;
      iframeRef.current.contentDocument.head.appendChild(style);
    }
  }, []);

  const handleNavPrev = () => {
    const channel = new BroadcastChannel('zeta_channel');
    channel.postMessage({ type: 'NAV_SLIDE', direction: 'PREV' });
  };

  const handleNavNext = () => {
    const channel = new BroadcastChannel('zeta_channel');
    channel.postMessage({ type: 'NAV_SLIDE', direction: 'NEXT' });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.log('Fullscreen error:', err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName || 'w-full h-full'}`}
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black">
          <LoadingSpinner size="lg" color="gold" />
          <div className="px-4 mt-10 text-center">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center gap-2 p-2 bg-black">
        {/* Navigation Controls - Center */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNavPrev}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title="Previous Slide"
          >
            <FaChevronLeft />
          </button>

          <div className="text-white text-sm font-medium px-3 py-1.5 min-w-fit">
            {totalSlides > 0 ? `${currentSlide} / ${totalSlides}` : '1'}
          </div>

          <button
            onClick={handleNavNext}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title="Next Slide"
          >
            <FaChevronRight />
          </button>

          <button
            onClick={handleFullscreen}
            className="px-3 py-1.5 rounded-md border-none cursor-pointer bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <FaExpand />
          </button>
        </div>

        {/* Download Button - Right */}
        <div className="ml-auto">
          <a 
            href={fileUrl} 
            download 
            className="flex items-center gap-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition-colors"
          >
            <FaDownload />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src="/zetajs/simple"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none', 
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        sandbox="allow-scripts allow-same-origin"
        allow="cross-origin-isolated"
      />
    </div>
  );
};

export default MediaViewer;