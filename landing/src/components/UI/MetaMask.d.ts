declare module '@metamask/logo' {
    interface MetaMaskLogoOptions {
      width?: number;
      height?: number;
      pxNotRatio?: boolean;
      followMouse?: boolean;
      slowDrift?: boolean;
    }
  
    interface MetaMaskLogoViewer {
      container: HTMLElement;
      stopAnimation: () => void;
    }
  
    export default function createLogo(options: MetaMaskLogoOptions): MetaMaskLogoViewer;
  }