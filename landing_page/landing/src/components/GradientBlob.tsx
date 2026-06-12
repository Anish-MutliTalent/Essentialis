import DynamicGradientEllipse from "./DynamicGradientEllipse";

/**
 * Composition primitives for the landing's signature ambient gradient clusters.
 *
 * The look isn't a single blob — it's a *cluster*: one small "white core" plus
 * several larger colored ellipses positioned so they all overlap the core from
 * different angles. The colored canvases use `mix-blend-overlay`, which only
 * lights up where there are bright pixels beneath it, so the bright multi-color
 * spot forms exactly where the colored ellipses coincide with the white core.
 *
 *   <WhiteCore  className="w-[642px] h-[658px] top-[280px] left-[480px]" />
 *   <ColorEllipse color="#9F3491" className="w-[642px] h-[658px] top-[180px] left-[450px]" phaseOffset={1.167} />
 *   <ColorEllipse color="#E89700" className="w-[934px] h-[957px] top-[350px] left-[330px]" phaseOffset={-1.496} colorBlur={38.65} multiLobe />
 *   <ColorEllipse color="#E89700" className="w-[640px] h-[658px] top-[450px] -left-[50px]" phaseOffset={-0.162} />
 *
 * (See Home/SolutionSection.tsx and Home/ValuesGridSection.tsx for canonical usage.)
 */

const WHITE_BG = "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.84) 34%, rgba(255,255,255,0.84) 100%)";

interface WhiteCoreProps {
  /** Absolute-positioning + sizing classes (e.g. "w-[642px] h-[658px] top-[280px] left-[480px]") */
  className?: string;
  /** Override blur radius (default 117.6px, matches home sections) */
  blur?: number;
  /** Pixel offset of the second white layer — gives the soft double-exposure look (default 15/14) */
  offsetX?: number;
  offsetY?: number;
  /** Opacity of the underlying gradient stops (default 0.84) */
  strength?: number;
}

export const WhiteCore = ({
  className = "",
  blur = 117.6,
  offsetX = -15,
  offsetY = 14,
  strength = 0.84,
}: WhiteCoreProps): JSX.Element => {
  const bg =
    strength === 0.84
      ? WHITE_BG
      : `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${strength}) 34%, rgba(255,255,255,${strength}) 100%)`;
  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute pointer-events-none ${className}`}
        style={{
          borderRadius: "50%",
          filter: `blur(${blur}px)`,
          background: bg,
        }}
      />
      <div
        aria-hidden="true"
        className={`absolute pointer-events-none ${className}`}
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          borderRadius: "50%",
          filter: `blur(${blur}px)`,
          background: bg,
        }}
      />
    </>
  );
};

interface ColorEllipseProps {
  color: string;
  className?: string;
  colorBlur?: number;
  phaseOffset?: number;
  multiLobe?: boolean;
  timeOffset?: number;
  opacity?: number;
  linearRotation?: boolean;
}

export const ColorEllipse = ({
  color,
  className = "",
  colorBlur = 48.1,
  phaseOffset = 0,
  multiLobe = false,
  timeOffset = 0,
  opacity = 1,
  linearRotation = false,
}: ColorEllipseProps): JSX.Element => {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none overflow-hidden ${className}`}
      style={{
        borderRadius: "50%",
        filter: `blur(${colorBlur}px)`,
        mixBlendMode: "overlay",
      }}
    >
      <DynamicGradientEllipse
        color={color}
        opacity={opacity}
        phaseOffset={phaseOffset}
        multiLobe={multiLobe}
        timeOffset={timeOffset}
        linearRotation={linearRotation}
      />
    </div>
  );
};
