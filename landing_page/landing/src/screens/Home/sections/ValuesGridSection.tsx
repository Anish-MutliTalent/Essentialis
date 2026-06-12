import { motion } from 'framer-motion';
import { GlassContainer } from '../../../components/GlassContainer';
import DynamicGradientEllipse from '../../../components/DynamicGradientEllipse';
import { Parallax } from '../../../components/Parallax';

const valueCards = [
  {
    number: "01",
    title: "SIMPLICITY",
    description: "Powerful technology should feel effortless.",
    filterId: "vg-s-01",
    filterColor: "#bb4622ff", filterOpacity: 1, filterDx: -1, filterDy: 1, filterStd: 2,
    positionClass: "lg:row-[1_/_2] lg:col-[1_/_2]",
    contentClass:
      "flex flex-col gap-1 lg:items-start lg:top-[51px] lg:absolute lg:left-[82px] lg:w-[244px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
  {
    number: "02",
    title: "OWNERSHIP",
    description: "Users should always be in control. Not platforms",
    filterId: "vg-s-02",
    filterColor: "#911d76ff", filterOpacity: 1, filterDx: -1, filterDy: 1, filterStd: 2,
    positionClass: "lg:row-[1_/_2] lg:col-[2_/_3]",
    contentClass:
      "flex flex-col gap-1 lg:items-start lg:top-[51px] lg:absolute lg:left-[82px] lg:w-[244px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
  {
    number: "03",
    title: "PRIVACY",
    description: "Security shouldn't come at the cost of usability.",
    filterId: "vg-s-03",
    filterColor: "#bd4423ff", filterOpacity: 1, filterDx: 1, filterDy: 1, filterStd: 2,
    positionClass: "lg:row-[1_/_2] lg:col-[3_/_4]",
    contentClass:
      "flex flex-col gap-1 lg:absolute lg:top-[51px] lg:left-[82px] lg:w-[244px] lg:h-[119px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
  {
    number: "04",
    title: "CLARITY",
    description: "If something is valuable, it should be understandable.",
    filterId: "vg-s-04",
    filterColor: "#a16d46ff", filterOpacity: 1, filterDx: -1, filterDy: 1, filterStd: 2,
    positionClass: "lg:row-[2_/_3] lg:col-[1_/_2]",
    contentClass:
      "flex flex-col gap-1 lg:absolute lg:top-[51px] lg:left-[82px] lg:w-[244px] lg:h-[119px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
  {
    number: "05",
    title: "OPENNESS",
    description: "Systems should be open, verifiable, and honest",
    filterId: "vg-s-05",
    filterColor: "#914c14ff", filterOpacity: 1, filterDx: 1, filterDy: 1, filterStd: 0.95,
    positionClass: "lg:row-[2_/_3] lg:col-[2_/_3]",
    contentClass:
      "flex flex-col gap-1 lg:top-[calc(50.00%_-_60px)] lg:h-[119px] lg:absolute lg:left-[82px] lg:w-[244px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
  {
    number: "06",
    title: "UTILITY",
    description: "Technology people can actually use in their daily lives.",
    filterId: "vg-s-06",
    filterColor: "#48320d", filterOpacity: 1, filterDx: 1, filterDy: 1, filterStd: 2,
    positionClass: "lg:row-[2_/_3] lg:col-[3_/_4]",
    contentClass:
      "flex flex-col gap-1 lg:absolute lg:top-[51px] lg:left-[82px] lg:w-[244px] lg:h-[119px]",
    titleClass:
      "[font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-4xl tracking-[0] leading-[normal]",
    descriptionClass:
      "[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base lg:text-2xl tracking-[0.35px] leading-relaxed lg:leading-[25px]",
  },
];

export const ValuesGridSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          {valueCards.map((card) => (
            <filter key={card.filterId} id={card.filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
                <feFuncA type="linear" slope="-1" intercept="1" />
              </feComponentTransfer>
              <feGaussianBlur in="invertedAlpha" stdDeviation={card.filterStd} result="blurredInverted" />
              <feOffset in="blurredInverted" dx={card.filterDx} dy={card.filterDy} result="offsetBlurred" />
              <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
              <feFlood floodColor={card.filterColor} floodOpacity={card.filterOpacity} result="shadowColor" />
              <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="coloredShadow" />
              </feMerge>
            </filter>
          ))}
          {/* "Our values" gradient text — #8a3736 at opacity 0.420 */}
          <filter id="vg-s-values" x="-20%" y="-20%" width="140%" height="140%">
            <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
              <feFuncA type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
            <feGaussianBlur in="invertedAlpha" stdDeviation="3.9" result="blurredInverted" />
            <feOffset in="blurredInverted" dx="-2" dy="3" result="offsetBlurred" />
            <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
            <feFlood floodColor="#8a3736" floodOpacity="0.420" result="shadowColor" />
            <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="coloredShadow" />
            </feMerge>
          </filter>
          <linearGradient id="vg-number-gradient-0" x1="0" y1="0.2" x2="0.65" y2="0.7">
            <stop offset="0" stopColor="white" stopOpacity="0.56" />
            <stop offset="0.5" stopColor="white" stopOpacity="0" />
            <stop offset="0.7" stopColor="white" stopOpacity="0.1" />
            <stop offset="1" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="vg-number-gradient-1" x1="0.5" y1="0.2" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.56" />
            <stop offset="0.5" stopColor="white" stopOpacity="0" />
            <stop offset="0.7" stopColor="white" stopOpacity="0.1" />
            <stop offset="1" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    <section
      aria-labelledby="values-grid-heading"
      className="relative mx-auto -mt-[15px] w-full pb-8 lg:pb-0 lg:w-[1414px] lg:h-[1132px]"
    >
      <Parallax strength={0.3} className="absolute top-0 left-0 w-[1414px] h-[1132px] pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-0"
      >
        {/* White ellipse — unchanged */}
        <div className="absolute top-[357px] left-[353px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
        {/* White ellipse — unchanged */}
        <div className="top-[343px] left-[338px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />

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
          <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe={true} linearRotation={true} />
        </div>

        {/* Colored ellipse — Warm Orange #FA8500 — overlay → DYNAMIC */}
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
          <DynamicGradientEllipse color="#FA8500" opacity={1} phaseOffset={-1.496} multiLobe={true} linearRotation={true} />
        </div>

        {/* Colored ellipse — Warm Orange #FA8500 — overlay → DYNAMIC */}
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
          <DynamicGradientEllipse color="#FA8500" opacity={1} phaseOffset={-0.162} multiLobe={true} linearRotation={true} />
        </div>
      </div>
      </Parallax>
      <motion.header
        className="flex flex-col items-start justify-center px-4 sm:px-6 pt-8 pb-6 lg:px-0 lg:pt-0 lg:pb-0 lg:absolute lg:top-[340px] lg:left-[91px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2
          id="values-grid-heading"
          className="relative flex items-center w-fit mt-[-1.00px] [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]"
        >
          Six things we believe in.
        </h2>
        <p className="relative flex items-center w-fit [filter:url(#vg-s-values)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
          Our values
        </p>
      </motion.header>
      <div
        className="relative lg:absolute mx-4 sm:mx-6 lg:mx-0 h-auto lg:w-[1225px] lg:h-[443px] lg:top-[523px] lg:left-[95px] rounded-[14px]  after:content-[''] after:absolute after:inset-0 after:p-px after:rounded-[14px] after:[background:linear-gradient(135deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.28)_5%,rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(255,255,255,0.12)_95%,rgba(255,255,255,0.18)_100%)] after:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:[-webkit-mask-composite:xor] after:[mask-composite:exclude] after:pointer-events-none after:z-[3]"
      >
      <div
        role="list"
        aria-label="Core values"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(2,fit-content(100%))] w-full h-full bg-transparent rounded-[14px] overflow-hidden border-[none]"
      >
        {valueCards.map((card, i) => (
          <motion.div
            key={card.number}
            className={`${card.positionClass}`}
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
            whileHover={{ scale: 1.025, zIndex: 10 }}
            style={{ position: 'relative' }}
          >
          <GlassContainer
                cornerRadius={0}
                baseStrength={14}
                softness={5}
                edgeContrast={2.5}
                shadowContrast={2.5}
                reflectionPresence={0.8}
                bevelSaturation={1.2}
                edgeBrightness={1.1}
                brightness={1.2}>
          <article
            role="listitem"
            className={`relative flex flex-col gap-2 p-5 pl-6 lg:block lg:p-0 justify-self-start [align-self:start] w-full lg:w-[408px] h-auto lg:h-[221px] bg-transparent`}
          >
            <svg
              className="self-start lg:absolute lg:top-3 lg:left-[30px] overflow-visible"
              width="80"
              height="50"
              viewBox="0 0 80 50"
            >
              <text
                x="0"
                y="40"
                fill="#ffffff0A"
                strokeWidth="0.8"
                fontSize="28"
                className="[font-family:'Cinzel',serif] font-bold"
              >
                <tspan stroke="url(#vg-number-gradient-0)">{card.number[0]}</tspan>
                <tspan stroke="url(#vg-number-gradient-1)">{card.number[1]}</tspan>
              </text>
            </svg>
            <div className={card.contentClass}>
              <h3 className={card.titleClass} style={{ filter: `url(#${card.filterId})` }}>
                {card.title}
              </h3>
              <p className={card.descriptionClass}>{card.description}</p>
            </div>
          </article>
          </GlassContainer>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
    </>
  );
};
