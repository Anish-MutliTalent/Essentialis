import React, { useMemo } from "react";
import jazzicon from "@metamask/jazzicon";

export function walletToSeed(address: string): number {
  const clean = address.toLowerCase().replace(/^0x/, "");
  // first 8 chars (4 bytes) → integer
  return parseInt(clean.slice(0, 8), 16);
}

export function jazziconToDataUrl(seed: number, size: number): string {
  // Jazzicon returns a div containing an <svg>
  const el = jazzicon(size, seed);
  const svgElement = el.firstChild as SVGElement;

  if (!svgElement) {
    throw new Error("Jazzicon did not return an SVG element");
  }

  // Full outer HTML of the <svg> tag
  const svg = new XMLSerializer().serializeToString(svgElement);

  // Encode for use in <img src>
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml,${encoded}`;
}

type JazziconAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wallet: string;
  size?: number;
};

const JazziconAvatar: React.FC<JazziconAvatarProps> = ({
  wallet,
  size = 48,
  alt = "Profile",
  ...props
}) => {
  const src = useMemo(() => {
    const seed = walletToSeed(wallet);
    return jazziconToDataUrl(seed, size);
  }, [wallet, size]);

  return <img src={src} alt={alt} width={size} height={size} {...props} />;
};

export default JazziconAvatar;