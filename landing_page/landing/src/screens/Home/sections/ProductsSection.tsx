import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from '../../../components/DynamicGradientEllipse';
import { FadeIn } from '../../../components/FadeIn';




const productFiles = [
  "project_outline_draft_2026.docx",
  "meeting_notes_q2.txt",
  "user_agreement_final_signed.pdf",
  "invoice_#10052_2026-05-04.xlsx",
  "data_analysis_results_v3.csv",
  "readme_backup.md",
  "header_image_banner_final.jpg",
  "icon_profile_placeholder.png",
  "animated_loader_icon.gif",
  "hero_graphic_vector_vector.svg",
  "product_view_01.webp",
  "background_temp_raw.tiff",
  "scanned_receipt_001.bmp",
  "voice_memo_003.mp3",
  "background_track_final.wav",
  "intro_jingle_short.aac",
  "user_uploaded_video_05.mp4",
  "screen_recording_demo.mov",
  "video_stream_360p.avi",
  "tutorial_video_1080p.m4a",
  "archive_project_backup_june.zip",
  "dataset_training_data.7z",
  "previous_system_state.rar",
  "installer_setup_run.exe",
  "system_configuration_files.cab",
  "temp_file_garbage.tmp",
  "shared_files.tar",
  "index_new_final.html",
  "styles_v2_main.css",
  "app_logic_engine.js",
  "user_profile_data.json",
  "web_manifest_json.jsonld",
  "response_structure.xml",
  "backend_processing_script.php",
  "database_query_results.sql",
];

const productDates = [
  "2004-03-12 14:22:05",
  "2015-09-01 07:11:45",
  "2022-11-20 22:30:10",
  "2000-05-15 03:05:55",
  "2010-01-30 18:45:12",
  "2025-02-14 12:00:00",
  "2008-08-08 08:08:08",
  "2013-12-25 15:20:30",
  "2018-06-05 09:15:22",
  "2002-10-10 11:11:11",
  "2021-04-22 17:00:00",
  "2006-07-04 13:30:00",
  "2011-03-19 20:10:05",
  "2016-11-11 11:11:11",
  "2024-01-01 00:00:01",
  "2009-09-09 14:00:00",
  "2014-02-14 06:15:30",
  "2019-12-31 23:59:59",
  "2001-06-01 10:00:00",
  "2023-08-15 16:45:00",
  "2007-04-20 08:30:00",
  "2012-10-31 21:00:00",
  "2017-05-25 13:15:00",
  "2026-03-10 09:00:00",
  "2003-01-20 12:00:00",
  "2005-12-05 18:00:00",
  "2020-07-07 07:07:07",
  "2010-05-05 05:05:05",
  "2015-01-15 15:15:15",
  "2022-09-01 10:30:00",
  "2000-01-01 12:00:00",
  "2018-03-15 22:15:00",
  "2009-11-11 11:11:11",
  "2025-10-10 10:10:10",
  "2013-06-06 06:06:06",
];

const builderCodeLines = [
  "const canvas = document.createElement('canvas');",
  "const ctx = canvas.getContext('2d');",
  "document.body.appendChild(canvas);",
  "canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.zIndex = '-1';",
  "",
  "let particles = [];",
  "const init = () => {",
  "    canvas.width = window.innerWidth; canvas.height = window.innerHeight;",
  "    particles = Array.from({length: 80}, () => ({",
  "        x: Math.random() * canvas.width, y: Math.random() * canvas.height,",
  "        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2",
  "    }));",
  "};",
  "",
  "const draw = () => {",
  "    ctx.clearRect(0, 0, canvas.width, canvas.height);",
  "    ctx.fillStyle = '#222'; ctx.fillRect(0,0, canvas.width, canvas.height);",
  "    particles.forEach(p => {",
  "        p.x += p.vx; p.y += p.vy;",
  "        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;",
  "        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;",
  "        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();",
  "        ",
  "        particles.forEach(p2 => {",
  "            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);",
  "            if(dist < 100) {",
  "                ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;",
  "                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();",
  "            }",
  "        });",
  "    });",
  "    requestAnimationFrame(draw);",
  "};",
  "",
  "window.onresize = init; init(); draw();",
];

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
    className?: string;
}

function VerticalParallaxMarquee({ children, baseVelocity = 100, className = "" }: ParallaxProps) {
    const baseY = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 100
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const y = useTransform(baseY, (v) => `${wrap(-50, 0, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseY.set(baseY.get() + moveBy);
    });

    return (
        <div 
            className={`overflow-hidden flex flex-col ${className}`}
            style={{ 
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
            }}
        >
            <motion.div className="flex flex-col" style={{ y }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}


type StatusPillProps = {
  label: string;
  dotClassName: string;
  containerClassName: string;
};

const StatusPill = ({
  label,
  dotClassName,
  containerClassName,
}: StatusPillProps): JSX.Element => {
  return (
    <GlassContainer
      cornerRadius={20}
      baseStrength={30}
      softness={30}
      className={containerClassName}
    >
      <div
        className="flex items-center px-4 py-2 h-full w-full
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)] rounded-full"
        aria-label={label}
      >
        <div className={dotClassName} />
        <div className="inline-flex flex-col items-start pl-2 pr-0 py-0 relative flex-[0_0_auto]">
          <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-neutral-300 text-sm tracking-[0.35px] leading-5 whitespace-nowrap">
            {label}
          </div>
        </div>
      </div>
    </GlassContainer>
  );
};

type CtaButtonProps = {
  label: string;
  variant: "light" | "glass";
};

const CtaButton = ({ label, variant }: CtaButtonProps): JSX.Element => {
  const isLight = variant === "light";

  if (isLight) {
    return (
      <button
        type="button"
        className="relative w-[187px] h-[54px] bg-white rounded-[48px] shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
        aria-label={label}
      >
        <span className="absolute top-3.5 left-[38px] text-black flex h-[26px] items-center justify-center text-center [font-family:'Inter',Helvetica] text-xl font-semibold leading-[25.6px] tracking-[0] whitespace-nowrap">
          {label}
        </span>
      </button>
    );
  }

  return (
    <GlassContainer
      cornerRadius={48}
      baseStrength={20}
      softness={20}
      className="w-[187px] h-[54px]"
    >
      <button
        type="button"
        className="relative w-full h-full bg-[#00000001] rounded-[48px] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
        aria-label={label}
      >
        <span className="absolute top-3.5 left-10 text-white flex h-[26px] items-center justify-center text-center [font-family:'Inter',Helvetica] text-xl font-semibold leading-[25.6px] tracking-[0] whitespace-nowrap">
          {label}
        </span>
      </button>
    </GlassContainer>
  );
};

export const ProductsSection = (): JSX.Element => {
  return (
    <div className="relative w-full mt-[200px] lg:mt-[507px]">
      <svg
        className="absolute top-[-442px] left-0 w-[1138px] h-[1968px] pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        width="1139"
        height="1968"
        viewBox="0 0 1139 1968"
        fill="none"
        aria-hidden="true"
      >
        <g filter="url(#filter0_gf_303_13554)">
          <ellipse cx="204" cy="1008.2" rx="321" ry="329" fill="url(#paint0_radial_303_13554)" fillOpacity="0.84" />
        </g>
        <g filter="url(#filter1_fg_303_13554)">
          <ellipse cx="200" cy="994.2" rx="321" ry="329" fill="url(#paint1_radial_303_13554)" fillOpacity="0.84" />
        </g>
        <g filter="url(#filter4_gf_303_13554)">
          <ellipse cx="582" cy="564.2" rx="321" ry="329" fill="url(#paint4_radial_303_13554)" fillOpacity="0.24" />
        </g>
        <defs>
          <filter id="filter0_gf_303_13554" x="-352.2" y="444" width="1112.4" height="1128.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="117.6" result="effect2_foregroundBlur_303_13554" />
          </filter>
          <filter id="filter1_fg_303_13554" x="-356.2" y="430" width="1112.4" height="1128.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="117.6" result="effect1_foregroundBlur_303_13554" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="effect1_foregroundBlur_303_13554" scale="43" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect2_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
          <filter id="filter2_gf_303_13554" x="-370.2" y="351" width="834.4" height="850.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="48.1" result="effect2_foregroundBlur_303_13554" />
          </filter>
          <filter id="filter3_gf_303_13554" x="-116.3" y="855.9" width="1088.6" height="1111.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={0} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="38.65" result="effect2_foregroundBlur_303_13554" />
          </filter>
          <filter id="filter4_gf_303_13554" x="25.8" y="0.000198364" width="1112.4" height="1128.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="117.6" result="effect2_foregroundBlur_303_13554" />
          </filter>
          <filter id="filter5_gf_303_13554" x="-198.2" y="64.0002" width="1041.4" height="1065.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0446428582072258 0.0446428582072258" numOctaves={3} seed={9103} />
            <feDisplacementMap in="shape" scale="62.799999237060547" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
            <feMerge result="effect1_texture_303_13554">
              <feMergeNode in="displacedImage" />
            </feMerge>
            <feGaussianBlur stdDeviation="48.1" result="effect2_foregroundBlur_303_13554" />
          </filter>
          <radialGradient id="paint0_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(204 1008.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
          <radialGradient id="paint1_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 994.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
          <radialGradient id="paint2_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(47 776.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="#9F3491" />
          </radialGradient>
          <radialGradient id="paint3_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(427.711 1428.7) rotate(90) scale(478.5 467)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="#E89700" />
          </radialGradient>
          <radialGradient id="paint4_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(582 564.2) rotate(90) scale(329 321)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="#FFB01F" />
          </radialGradient>
          <radialGradient id="paint5_radial_303_13554" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(322.5 596.7) rotate(90) scale(436.5 424.5)">
            <stop offset="0.336538" />
            <stop offset="1" stopColor="#E89700" />
          </radialGradient>
        </defs>
      </svg>
      {/* Left group dynamic overlays (matching the SVG bounds) */}
      <div className="absolute top-[-442px] left-0 w-[1138px] h-[1968px] pointer-events-none" aria-hidden="true">
        {/* Purple */}
        <div className="absolute overflow-hidden" style={{ left: '-274px', top: '447.2px', width: '642px', height: '658px', borderRadius: '321px/329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#9F3491" phaseOffset={0.967} linearRotation={false} />
        </div>
        {/* Orange 1 */}
        <div className="absolute overflow-hidden" style={{ left: '-50.3px', top: '800px', width: '934px', height: '957px', borderRadius: '467px/478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#E89700" phaseOffset={-2.057} linearRotation={false} />
        </div>
        {/* Orange 2 */}
        <div className="absolute overflow-hidden" style={{ left: '-102px', top: '160.2px', width: '849px', height: '873px', borderRadius: '424.5px/436.5px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#E89700" phaseOffset={1.860} linearRotation={false} />
        </div>
      </div>
      <div
        className="absolute top-[-321px] right-[-522px] w-[1414px] h-[1132px] pointer-events-none"
        aria-hidden="true"
      >
        <div className="top-[498px] left-[498px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
        <div className="top-[484px] left-[483px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
        <div className="absolute overflow-hidden" style={{ left: '350px', top: '164px', width: '698px', height: '715px', borderRadius: '349px/357.5px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#9F3491" phaseOffset={1.64} timeOffset={17.5} linearRotation={false} />
        </div>
        <div className="absolute overflow-hidden" style={{ left: '100px', top: '581px', width: '934px', height: '957px', borderRadius: '467px/478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#E89700" phaseOffset={-0.90} timeOffset={17.5} linearRotation={false} />
        </div>
        <div className="absolute overflow-hidden" style={{ left: '-20-0px', top: '484px', width: '640px', height: '658px', borderRadius: '320px/329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
          <DynamicGradientEllipse color="#E89700" phaseOffset={0.01} timeOffset={17.5} linearRotation={false} />
        </div>
      </div>
    <section
      className="relative flex flex-col w-full max-w-[1285px] items-start gap-8 lg:gap-[69px] mx-auto px-4 sm:px-6 lg:px-0"
      aria-labelledby="products-section-heading"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-[127px] relative self-stretch w-full flex-[0_0_auto]">
        <FadeIn>
          <header className="inline-flex flex-col items-start justify-center relative flex-[0_0_auto]">
            <h2
              id="products-section-heading"
              className="relative flex items-center w-fit mt-[-1.00px] [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]"
            >
              Two Products
            </h2>
            <div className="relative flex items-center w-fit [text-shadow:-2px_3px_7.8px_#8a373666] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
              One Philosophy
            </div>
          </header>
        </FadeIn>
        <FadeIn delay={0.1} className="w-full lg:w-[692px]">
          <p className="relative flex items-center w-full [font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[27px]">
            We&#39;re a small team focused on doing two things really well,
            instead of a dozen things half-way. More will come, but only when
            these are ready.
          </p>
        </FadeIn>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[46px] relative self-stretch w-full flex-[0_0_auto]">
        <motion.div
          className="w-full lg:w-[665px]"
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassContainer
            cornerRadius={14}
            baseStrength={10}
            softness={10}
            reflectionPresence={3}
            className="w-full"
          >
            <article className="relative w-full h-auto lg:h-[507px] bg-[#00000001] rounded-[14px] overflow-hidden
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.05)]">
            <VerticalParallaxMarquee 
              baseVelocity={2} 
              className="absolute top-[-84px] left-[27px] w-[475px] h-[980px]"
            >
              <div className="flex gap-[83px]">
                <div className="w-[236px] [font-family:'Inter',Helvetica] font-medium text-[#d4d4d426] text-sm tracking-[0.35px] leading-7">
                  {productFiles.map((file, index) => (
                    <div key={`${file}-${index}`}>
                      {file}
                      <br />
                    </div>
                  ))}
                </div>
                <div className="w-[156px] [font-family:'Inter',Helvetica] font-medium text-[#d4d4d426] text-sm tracking-[0.35px] leading-7">
                  {productDates.map((date, index) => (
                    <div key={`${date}-${index}`}>
                      {date}
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            </VerticalParallaxMarquee>
            <div className="flex flex-col w-full items-start gap-6 p-5 relative lg:absolute lg:w-[524px] lg:gap-[109px] lg:top-[calc(50.00%_-_208px)] lg:left-[calc(50.00%_-_262px)] lg:p-0">
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center w-fit [font-family:'Inter',Helvetica] font-medium text-neutral-300 text-base tracking-[0.35px] leading-5 whitespace-nowrap">
                  FOR EVERYONE
                </div>
                <StatusPill
                  label="LIVE IN CLOSED BETA"
                  containerClassName="w-[209px] h-[38px]"
                  dotClassName="relative w-2 h-2 bg-green-400 rounded-full shadow-[0px_0px_10px_#4ade80]"
                />
              </div>
              <div className="flex flex-col w-full lg:w-[506px] items-start gap-5 lg:gap-[25px] relative flex-[0_0_auto]">
                <img
                  className="relative w-full max-w-[506px] lg:max-w-none lg:self-stretch mt-[-28px] lg:mt-[-75.60px] mb-[-29px] ml-[-40.60px] mr-[-52.60px] aspect-[3] object-cover"
                  alt="Posthüas cloud product logo"
                  src="https://c.animaapp.com/UXoQJ2zg/img/cloud-essentialisfullbg-1.png"
                />
                <p className="relative flex items-center w-full lg:w-[485px] [font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]">
                  Own your most important documents with bank-level security. No
                  big-tech, no tracking, just pure privacy. Uses a simple UI, just
                  like the apps you already use
                </p>
                <CtaButton label="Learn More" variant="light" />
              </div>
            </div>
          </article>
          </GlassContainer>
        </motion.div>
        <motion.div
          className="w-full lg:w-[574px]"
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassContainer
          cornerRadius={14}
          baseStrength={10}
          softness={10}
          reflectionPresence={3}
          className="w-full lg:w-[574px]"
        >
          <article className="relative w-full h-auto lg:h-[507px] bg-[#00000001] rounded-[14px] overflow-hidden
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.05)]">
          <VerticalParallaxMarquee 
            baseVelocity={-2} 
            className="absolute top-[-84px] left-3.5 w-[353px] h-[864px]"
          >
            <div className="[font-family:'Intel_One_Mono',Helvetica] font-light text-[#ffffff2c] text-[13px] tracking-[0.35px] leading-4">
              {builderCodeLines.map((line, index) => (
                <div key={`${line}-${index}`}>
                  {line || <span>&nbsp;</span>}
                  <br />
                </div>
              ))}
            </div>
          </VerticalParallaxMarquee>
          <div className="flex flex-col w-full items-center gap-6 p-5 relative lg:absolute lg:w-[464px] lg:gap-[66px] lg:top-[calc(50.00%_-_208px)] lg:left-[calc(50.00%_-_232px)] lg:p-0">
            <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex items-center w-fit [font-family:'Inter',Helvetica] font-medium text-neutral-300 text-base tracking-[0.35px] leading-5 whitespace-nowrap">
                FOR BUILDERS
              </div>
              <StatusPill
                label="UNDER PROGRESS"
                containerClassName="w-[184px] h-[38px]"
                dotClassName="relative w-2 h-2 bg-[#ebc541] rounded-full shadow-[0px_0px_10px_#facc15]"
              />
            </div>
            <div className="flex flex-col items-start gap-5 lg:gap-[26px] relative self-stretch w-full flex-[0_0_auto]">
              <img
                className="relative w-full max-w-[348px] h-auto lg:w-[348px] lg:h-[105px]"
                alt="Vitalis Dev product logo"
                src="https://c.animaapp.com/UXoQJ2zg/img/1777969836338-1@2x.png"
              />
              <p className="relative flex items-center self-stretch [font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]">
                An agentic &quot;vibe-coding&quot; platform to create DApps, add
                accounts, storage, signing and smart contracts. Five prompts,
                not five protocols.
              </p>
              <CtaButton label="View Plans" variant="glass" />
            </div>
          </div>
        </article>
        </GlassContainer>
        </motion.div>
      </div>
    </section>
    </div>
  );
};
