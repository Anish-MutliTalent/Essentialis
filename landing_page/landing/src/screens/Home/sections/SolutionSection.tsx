import DynamicGradientEllipse from '../../../components/DynamicGradientEllipse';
import { FadeIn, FadeInStagger, FadeInItem } from '../../../components/FadeIn';


const bulletItems = [
  {
    text: "No seed phrases shoved at users.",
    content: (
      <span className="font-light tracking-[0.08px]">
        No seed phrases shoved at users.
      </span>
    ),
  },
  {
    text: 'No "glue code" between 5 SDKs to ship 1 feature.',
    content: (
      <>
        <span className="font-light tracking-[0.08px]">No&nbsp;</span>
        <span className="font-extralight italic tracking-[0.08px]">&quot;glue code&quot;</span>
        <span className="font-light tracking-[0.08px]">&nbsp;between&nbsp;</span>
        <span className="[font-family:'Cinzel',Helvetica] tracking-[0.08px]">5</span>
        <span className="font-light tracking-[0.08px]">&nbsp;SDKs to ship&nbsp;</span>
        <span className="[font-family:'Cinzel',Helvetica] tracking-[0.08px]">1</span>
        <span className="font-light tracking-[0.08px]">&nbsp;feature.</span>
      </>
    ),
  },
  {
    text: "No tradeoff between sovereignty and usability.",
    content: (
      <span className="font-light tracking-[0.08px]">
        No tradeoff between sovereignty and usability.
      </span>
    ),
  },
];

export const SolutionSection = (): JSX.Element => {
  return (
    <div className="relative flex flex-col items-center w-full mt-[422px] lg:block lg:h-[507px]">
      {/* ═══ LEFT BACKGROUND GROUP ═══════════════════════════════════════════
          SVG holds ONLY the white/black radial ellipses (untouched).
          The colored ellipses are now canvas-based DynamicGradientEllipse.  */}
      <svg
        className="absolute top-[-560px] left-0 w-[1121px] h-[1734px] pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        width="1122"
        height="1734"
        viewBox="0 0 1122 1734"
        fill="none"
        aria-hidden="true"
      >
        {/* White ellipse 0 — unchanged */}
        <g filter="url(#filter0_gf_303_13391)">
          <ellipse cx="230" cy="782.2" rx="321" ry="329" fill="url(#paint0_radial_303_13391)" fillOpacity="0.84" />
        </g>
        {/* White ellipse 1 — unchanged */}
        <g filter="url(#filter1_fg_303_13391)">
          <ellipse cx="226" cy="768.2" rx="321" ry="329" fill="url(#paint1_radial_303_13391)" fillOpacity="0.84" />
        </g>
        <defs>
          <filter id="filter0_gf_303_13391" x="-326.2" y="218" width="1112.4" height="1128.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13391">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="117.6" result="effect2_foregroundBlur_303_13391" />
          </filter>
          <filter id="filter1_fg_303_13391" x="-330.2" y="204" width="1112.4" height="1128.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="117.6" result="effect1_foregroundBlur_303_13391" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="effect1_foregroundBlur_303_13391" scale="43" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect2_texture_303_13391">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
          <radialGradient id="paint0_radial_303_13391" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(230 782.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
          <radialGradient id="paint1_radial_303_13391" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(226 768.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
        </defs>
      </svg>

      {/* ═══ LEFT COLORED ELLIPSES — dynamic canvases ═══════════════════════
          phaseOffset = atan2(whiteY - myY, whiteX - myX)
          Left whites avg centre ≈ (228, 775) in SVG coords.
          All lobes converge on the whites at t = 0 and every ~35 s cycle. */}

      {/* Colored ellipse 2 — Purple #9F3491 — overlay */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: `${-560 + 425.2 - 329}px`,   // ≈ -463.8px
          left: `${386 - 321}px`,            // ≈ 65px
          width: `${321 * 2}px`,             // 642px
          height: `${329 * 2}px`,            // 658px
          mixBlendMode: 'overlay',
          filter: 'blur(48.1px)',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.995} />
      </div>

      {/* Colored ellipse 3 — Orange #E89700 — overlay */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: `${-560 + 583.7 - 436.5}px`,  // ≈ -412.8px
          left: `${97.5 - 424.5}px`,          // ≈ -327px
          width: `${424.5 * 2}px`,            // 849px
          height: `${436.5 * 2}px`,           // 873px
          mixBlendMode: 'overlay',
          filter: 'blur(48.1px)',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={0.974} />
      </div>

      {/* Colored ellipse 4 — Orange #E89700 — overlay (the path/large one) */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: `${-560 + 1177.7 - 478.5}px`,  // ≈ 139.2px
          left: `${386 - 467}px`,              // ≈ -81px
          width: `${467 * 2}px`,               // 934px
          height: `${478.5 * 2}px`,            // 957px
          mixBlendMode: 'overlay',
          filter: 'blur(38.65px)',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.944} />
      </div>

      {/* Colored ellipse 5 — Yellow-orange #FFB01F — NO overlay, low opacity */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: `${-560 + 615.2 - 329}px`,   // ≈ -273.8px
          left: `${565 - 321}px`,            // ≈ 244px
          width: `${321 * 2}px`,             // 642px
          height: `${329 * 2}px`,            // 658px
          filter: 'blur(117.6px)',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <DynamicGradientEllipse color="#FFB01F" opacity={0.24} phaseOffset={2.698} />
      </div>

      {/* ═══ RIGHT BACKGROUND GROUP ══════════════════════════════════════════
          White ellipses stay as CSS divs, colored ones become canvases. */}
      <div
        className="absolute top-[-235px] right-[-795px] w-[1414px] h-[1132px]"
        aria-hidden="true"
      >
        {/* White ellipse — unchanged */}
        <div className="absolute top-[357px] left-[503px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
        {/* White ellipse — unchanged */}
        <div className="top-[343px] left-[488px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />

        {/* Colored ellipse — Purple #9F3491 — overlay → DYNAMIC */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: '147px',
            left: '408px',
            width: '642px',
            height: '658px',
            borderRadius: '321px / 329px',
            filter: 'blur(48.1px)',
            mixBlendMode: 'overlay',
          }}
        >
          <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} linearRotation={true} />
        </div>

        {/* Colored ellipse — Orange #E89700 — overlay → DYNAMIC */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: '476px',
            left: '329px',
            width: '934px',
            height: '957px',
            borderRadius: '467px / 478.5px',
            filter: 'blur(38.65px)',
            mixBlendMode: 'overlay',
          }}
        >
          <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} linearRotation={true} />
        </div>

        {/* Colored ellipse — Orange #E89700 — overlay → DYNAMIC */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: '439px',
            left: '-50px',
            width: '640px',
            height: '658px',
            borderRadius: '320px / 329px',
            filter: 'blur(48.1px)',
            mixBlendMode: 'overlay',
          }}
        >
          <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} linearRotation={true} />
        </div>
      </div>

      <img
        className="w-[547px] h-[547px] mix-blend-overlay pointer-events-none select-none lg:absolute lg:top-[-18px] lg:left-[calc(50%_-_24.6vw_-_273.5px)]"
        src="./shield.png"
      />
    <section
      aria-labelledby="jargon-free-layer-heading"
      className="flex w-full max-w-[723px] flex-col gap-6 md:gap-9 px-6 lg:px-0 lg:absolute lg:top-0 lg:left-[calc(50%_+_17.5vw_-_361.5px)] z-10"
    >
      <FadeIn>
        <header className="relative flex flex-col items-start justify-center w-full">
          <h2
            id="jargon-free-layer-heading"
            className="relative flex flex-wrap items-center [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] text-4xl sm:text-5xl lg:text-7xl font-normal leading-tight lg:leading-[79.2px] tracking-[-0.01em] text-white"
          >
            <span className="font-light tracking-[-0.01em]">A</span>
            <span className="font-extralight tracking-[-0.01em]">&nbsp;</span>
            <span className="tracking-[-0.01em]">jargon-free</span>
            <span className="font-extralight tracking-[-0.01em]">&nbsp;</span>
            <span className="font-light tracking-[-0.01em]">layer</span>
          </h2>
          <div className="relative flex flex-wrap items-center bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [text-shadow:-2px_3px_7.8px_#55005178] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] text-4xl sm:text-5xl lg:text-7xl font-light leading-tight lg:leading-[79.2px] tracking-[-0.01em] text-transparent [text-fill-color:transparent] italic">
            over the hard parts
          </div>
        </header>
      </FadeIn>
      <div className="flex w-full flex-col gap-[21px]">
        <FadeIn delay={0.1}>
          <p className="flex w-full items-center [font-family:'Inter',Helvetica] text-lg sm:text-xl lg:text-2xl font-light leading-relaxed lg:leading-[38px] tracking-[0.35px] text-white">
            We don&#39;t aim to reinvent decentralization. Our vision is to
            package it... Keys, signing, storage, identity, deployment.. into
            surfaces that anyone can pick up and use, and that any developer can
            build on in an afternoon.
          </p>
        </FadeIn>
        <FadeInStagger
          delay={0.2}
          className="relative flex flex-col gap-4 mt-2"
        >
          <ul aria-label="Jargon-free benefits" className="relative flex flex-col gap-4">
            {bulletItems.map((item) => (
              <FadeInItem key={item.text} direction="left">
                <li className="flex items-start gap-4">
                  <img
                    className="w-[43px] h-[5px] mt-[14px] lg:mt-[16px] flex-shrink-0"
                    alt=""
                    aria-hidden="true"
                    src='./line.svg'
                  />
                  <p className="[font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[38px]">
                    {item.content}
                  </p>
                </li>
              </FadeInItem>
            ))}
          </ul>
        </FadeInStagger>
      </div>
    </section>
    </div>
  );
};
