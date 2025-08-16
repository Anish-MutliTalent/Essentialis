// src/components/MetaMaskLogo.tsx
import { useRef, useEffect } from "react";
import type { MetaMaskLogoOptions, MetaMaskLogoViewer } from "@metamask/logo";

interface Props extends Partial<MetaMaskLogoOptions> {
  className?: string;
}

export default function MetaMaskLogo({
  width = 300,
  height = 300,
  pxNotRatio = true,
  followMouse = true,
  slowDrift = true,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef   = useRef<MetaMaskLogoViewer | null>(null);

  useEffect(() => {
  if (viewerRef.current) return;
  import("@metamask/logo").then(({ default: createLogo }) => {
    const viewer = createLogo({ pxNotRatio, width, height, followMouse, slowDrift });
    viewerRef.current = viewer;
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(viewer.container);
    }
  });
  return () => {
    if (viewerRef.current) {
      viewerRef.current.stopAnimation();
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Ensure the container is cleared
      }
      viewerRef.current = null;
    }
  };
}, [pxNotRatio, width, height, followMouse, slowDrift]);

  return (
    <div
      ref={containerRef}
      className={className + " inline-block align-middle"}
      style={{ width, height }}
    />
  );
}
