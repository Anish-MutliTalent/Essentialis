import { GlassContainer } from "./GlassContainer";


export const Navigation = (): JSX.Element => {
    return (
        <header id="nav" className="fixed top-[42px] left-1/2 w-[90%] max-w-[712px] h-[71px] z-50 will-change-transform [transform:translateX(-50%)_translateZ(0)]">
            {/* Blur parent — blur spreads beyond this element's bounds (ink overflow) */}
            <div className="absolute inset-0 pointer-events-none -z-[1]" style={{filter:'blur(5px)',opacity:0.9}}>
                {/* Ring source — masked to a thin 4px ring, gradient rotates inside */}
                <div className="absolute -inset-[4px] rounded-[76px]" style={{
                    WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite:'xor',
                    mask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite:'exclude',
                    padding:'4px'
                }}>
                    <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square animate-nav-rotate"
                        style={{background:'conic-gradient(from 0deg at 50% 50%,rgba(220,20,60,1) 0%,rgba(255,120,0,1) 25%,rgba(200,130,10,1) 50%,rgba(255,50,130,1) 75%,rgba(220,20,60,1) 100%)'}}
                    />
                </div>
            </div>
            <GlassContainer className="w-[100%] h-[100%] z-50"
                baseStrength={24}
                extraBlur={2}
                softness={32}
                edgeContrast={2.3}
                shadowContrast={2.3}
                refractionContrast={1.5}
                extraContrast={1.1}
                reflectionPresence={1}
                bevelSaturation={1}
                edgeBrightness={1}
                brightness={1}
            >
                <nav
                    className="absolute w-full h-full flex items-center justify-between px-4 bg-[#00000030] rounded-[72px]
                    shadow-[inset_-1px_-1px_0_0_rgba(255,255,255,0.3),inset_1px_1px_0_0_rgba(255,255,255,0.3)]"
                    aria-label="Primary"
                >
                    <GlassContainer className="w-[47px] h-[47px]"
                        brightness={1.2}
                    >
                        <button
                            type="button"
                            className="w-[47px] h-[47px] shrink-0 z-[1] cursor-pointer rounded-[47px]
                            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
                            aria-label="Open menu"
                        >
                            <img
                                className="w-full h-full pointer-events-none select-none"
                                alt=""
                                aria-hidden="true"
                                src="https://c.animaapp.com/UXoQJ2zg/img/menu.svg"
                            />
                        </button>
                    </GlassContainer>

                    {/* Full logo — visible on sm and above */}
                    <img
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[211px] h-[47px] object-contain pointer-events-none select-none hidden md:block"
                        alt="Essentialis"
                        src="./logofull.png"
                    />
                    {/* Favicon — visible below sm */}
                    <img
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] object-contain pointer-events-none select-none block md:hidden"
                        alt="Essentialis"
                        src="./favicon.png"
                    />

                    <button
                        type="button"
                        className="w-[135px] h-[45px] shrink-0 bg-white rounded-[77px] cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                        aria-label="Join waitlist"
                    >
                        <span className="text-black text-sm [font-family:'Inter',Helvetica] font-semibold tracking-[0] whitespace-nowrap">
                            <a href="https://old.essentialis.cloud/join-waitlist">Join Waitlist</a>
                        </span>
                    </button>
                </nav>
            </GlassContainer>
        </header>
    )
}