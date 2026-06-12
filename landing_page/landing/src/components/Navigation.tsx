import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlassContainer } from "./GlassContainer";
import { useWaitlist } from "./waitlist/WaitlistContext";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Cloud", to: "/cloud" },
    { label: "Pricing", to: "/pricing" },
    { label: "About", to: "/about" },
];

export const Navigation = (): JSX.Element => {
    const [menuOpen, setMenuOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { open: openWaitlist, joined } = useWaitlist();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (
                !buttonRef.current?.contains(e.target as Node) &&
                !dropdownRef.current?.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [menuOpen]);

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
                    <div className="relative">
                        <GlassContainer className="w-[47px] h-[47px]"
                            brightness={1.2}
                        >
                            <button
                                ref={buttonRef}
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="relative w-[47px] h-[47px] shrink-0 z-[1] cursor-pointer rounded-[47px] flex items-center justify-center
                                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={menuOpen}
                            >
                                <span className="relative block w-[15px] h-[9px] pointer-events-none">
                                    <span
                                        className={`absolute left-0 block h-[1.5px] w-full rounded-full bg-white/65 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                            menuOpen
                                                ? "top-1/2 -translate-y-1/2 rotate-45"
                                                : "top-0 rotate-0"
                                        }`}
                                    />
                                    <span
                                        className={`absolute left-0 bottom-0 block h-[1.5px] w-full rounded-full bg-white/65 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                            menuOpen
                                                ? "top-1/2 bottom-auto -translate-y-1/2 -rotate-45"
                                                : "rotate-0"
                                        }`}
                                    />
                                </span>
                            </button>
                        </GlassContainer>
                    </div>

                    {/* Full logo — visible on sm and above */}
                    <Link
                        to="/"
                        aria-label="Essentialis home"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                    >
                        <img
                            className="w-[211px] h-[47px] object-contain pointer-events-none select-none"
                            alt="Essentialis"
                            src="./logofull.png"
                        />
                    </Link>
                    {/* Favicon — visible below sm */}
                    <Link
                        to="/"
                        aria-label="Essentialis home"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block md:hidden"
                    >
                        <img
                            className="w-[36px] h-[36px] object-contain pointer-events-none select-none"
                            alt="Essentialis"
                            src="./favicon.png"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => openWaitlist("nav")}
                        className="h-[45px] px-5 min-w-[135px] shrink-0 bg-white rounded-[77px] cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                        aria-label={joined ? "View your waitlist spot" : "Join waitlist"}
                    >
                        {joined ? (
                            <span className="text-black text-sm [font-family:'Inter',Helvetica] font-semibold tracking-[0] whitespace-nowrap">
                                You&#39;re #{joined.position.toLocaleString()}
                            </span>
                        ) : (
                            <span className="text-black text-sm [font-family:'Inter',Helvetica] font-semibold tracking-[0] whitespace-nowrap">
                                Join Waitlist
                            </span>
                        )}
                    </button>
                </nav>
            </GlassContainer>

            {/* Dropdown — rendered outside GlassContainer to avoid overflow-hidden clipping */}
            <div
                ref={dropdownRef}
                className={`absolute left-4 top-[79px] w-[180px] z-50 transition-all duration-200 ${
                    menuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
                <GlassContainer
                    cornerRadius={20}
                    baseStrength={20}
                    softness={20}
                    edgeBrightness={1.1}
                >
                    <ul
                        className="flex flex-col py-2 bg-[#00000050] rounded-[20px]
                        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
                    >
                        {navLinks.map((link) => {
                            const active = location.pathname === link.to;
                            return (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`block px-5 py-2 [font-family:'Inter',Helvetica] text-sm tracking-[0.35px] transition-colors ${
                                            active
                                                ? "text-white font-semibold"
                                                : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </GlassContainer>
            </div>
        </header>
    )
}
