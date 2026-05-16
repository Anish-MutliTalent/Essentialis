"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CursorSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMounted, setIsMounted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const mouseGLRef = useRef({ x: 0.5, y: 0.5 });
    const targetGLRef = useRef({ x: 0.5, y: 0.5 });
    const rafRef = useRef<number>(0);

    const springConfig = { damping: 40, stiffness: 100, mass: 2 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setIsMounted(true);
        mouseX.set(window.innerWidth / 2);
        mouseY.set(window.innerHeight / 2);
        targetGLRef.current = { x: 0.5, y: 0.5 };
        mouseGLRef.current = { x: 0.5, y: 0.5 };

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            targetGLRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [mouseX, mouseY]);

    // WebGL setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;
        glRef.current = gl;

        const vertSrc = `
            attribute vec2 aPos;
            void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
        `;

        // Premium rainbow-spectrum flow field shader on deep contrasted black
        const fragSrc = `
            precision highp float;
            uniform float uTime;
            uniform vec2 uRes;
            uniform vec2 uMouse;

            float hash(vec2 p) {
                p = fract(p * vec2(234.34, 435.345));
                p += dot(p, p + 34.23);
                return fract(p.x * p.y);
            }
            float noise(vec2 p) {
                vec2 i = floor(p), f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(hash(i), hash(i + vec2(1,0)), u.x),
                    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
                    u.y
                );
            }
            float fbm(vec2 p, int oct) {
                float v = 0.0, a = 0.5;
                for (int i = 0; i < 7; i++) {
                    if (i >= oct) break;
                    v += a * noise(p);
                    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
                    a *= 0.45;
                }
                return v;
            }

            // HSV to RGB conversion for smooth rainbow cycling
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uRes;
                uv.y = 1.0 - uv.y;
                float T = uTime * 0.35;

                // Cursor warp — distort UV before feeding into flow field
                vec2 toMouse = uv - uMouse;
                toMouse.x *= uRes.x / uRes.y;
                float dM = length(toMouse);
                
                // Push fluid away from cursor
                vec2 pushDir = toMouse * exp(-dM * 6.0) * 0.5;
                
                // Swirl tangentially around cursor
                vec2 swirl = vec2(-toMouse.y, toMouse.x) * exp(-dM * 5.0) * 0.4;
                
                // Base UV mapped with cursor deformation
                vec2 baseWarp = uv - pushDir + swirl;

                // Fine grain noise
                float grain = fbm(baseWarp * 1000.0 + vec2(T * 1.0, -T * 0.8), 2);

                // Inject grain jitter
                vec2 warpedUv = baseWarp + (grain - 0.5) * 0.005;

                // Flow field
                vec2 q = vec2(
                    fbm(warpedUv * 1.8 + vec2(T * 0.28, T * 0.21), 3),
                    fbm(warpedUv * 1.8 + vec2(5.2, 1.3) + vec2(T * 0.24, -T * 0.19), 3)
                );
                vec2 r = vec2(
                    fbm(warpedUv + 3.0 * q + vec2(1.7, 9.2) + T * 0.38, 3),
                    fbm(warpedUv + 3.0 * q + vec2(8.3, 2.8) - T * 0.32, 3)
                );
                float f = fbm(warpedUv + 3.2 * r + T * 0.14, 4);

                // Particulate grain
                f += (grain - 0.5) * 0.15;

                // Fold — ridge/cloth-like creases
                float folded = abs(sin(f * 3.14159 * 2.6 + T * 0.18));
                folded = pow(folded, 2.4);
                
                float lum = f * 0.55 + folded * 0.45;
                lum = mix(lum, lum * (grain * 2.0), 0.2);
                lum = clamp(lum, 0.0, 1.0);

                // Surface ripple from cursor
                float ripple = exp(-dM * 3.0) * sin(dM * 22.0 - T * 5.5) * 0.05;
                lum += ripple;

                // ============ PREMIUM RAINBOW COLOR SYSTEM ============
                
                // Deep contrasted black base — much darker than before
                vec3 base = vec3(0.012, 0.012, 0.016);  // near-pure black with blue tint

                // Rainbow spectrum colors — vibrant and saturated
                vec3 electricBlue  = vec3(0.10, 0.40, 1.00);
                vec3 cyan          = vec3(0.00, 0.85, 0.95);
                vec3 magenta       = vec3(0.85, 0.10, 0.80);
                vec3 violet        = vec3(0.55, 0.15, 0.95);
                vec3 warmAmber     = vec3(1.00, 0.65, 0.10);
                vec3 hotPink       = vec3(1.00, 0.20, 0.50);
                vec3 emerald       = vec3(0.10, 0.90, 0.50);
                
                // Slow-cycling hue offset — the entire palette shifts over time
                float hueShift = T * 0.08;
                
                // Position-dependent rainbow angle — spatial variation
                float spatialHue = (uv.x * 0.4 + uv.y * 0.3) + f * 1.2 + hueShift;
                
                // Create flowing rainbow from spatial+temporal hue
                vec3 rainbow = hsv2rgb(vec3(fract(spatialHue), 0.85, 1.0));

                // Mix specific spectrum colors based on flow field intensity zones
                vec3 col = base;
                
                // Layer 1: Deep violet/blue undertow in shadows
                col = mix(col, base + violet * 0.08, smoothstep(0.0, 0.25, lum));
                
                // Layer 2: Electric blue mid-tones  
                col = mix(col, base + electricBlue * 0.14, smoothstep(0.15, 0.40, lum));
                
                // Layer 3: Cyan/magenta split based on flow direction
                float flowAngle = atan(r.y - 0.5, r.x - 0.5);
                vec3 splitColor = mix(cyan, magenta, smoothstep(-1.0, 1.0, sin(flowAngle + T * 0.3)));
                col = mix(col, base + splitColor * 0.16, smoothstep(0.30, 0.55, lum));
                
                // Layer 4: Rainbow peaks — full spectrum at high luminance
                col = mix(col, base + rainbow * 0.20, smoothstep(0.50, 0.75, lum));
                
                // Layer 5: Hot highlights — warm amber/pink at peaks
                vec3 hotHighlight = mix(warmAmber, hotPink, sin(f * 6.0 + T) * 0.5 + 0.5);
                col += hotHighlight * smoothstep(0.72, 1.0, lum) * 0.12;
                
                // Layer 6: Emerald accent ribbons in fold lines
                col += emerald * 0.06 * folded * smoothstep(0.4, 0.7, lum);

                // Cursor glow — rainbow-tinted radial glow
                float cursorGlow = exp(-dM * dM * 5.0) * 0.12;
                vec3 cursorColor = hsv2rgb(vec3(fract(T * 0.15), 0.6, 1.0));
                col += cursorColor * cursorGlow;
                
                // Tight inner cursor accent — cycling warm/cool
                vec3 innerAccent = mix(vec3(0.95, 0.75, 0.20), vec3(0.40, 0.80, 1.00), sin(T * 0.5) * 0.5 + 0.5);
                col += innerAccent * exp(-dM * dM * 18.0) * 0.25;

                // Vignette — deep black edges
                vec2 vc = uv - 0.5;
                float vig = 1.0 - dot(vc * vec2(1.3, 1.5), vc * vec2(1.3, 1.5)) * 1.3;
                col *= max(vig, 0.0);

                gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
            }
        `;

        function mkShader(type: number, src: string) {
            const s = gl!.createShader(type)!;
            gl!.shaderSource(s, src);
            gl!.compileShader(s);
            return s;
        }

        const prog = gl.createProgram()!;
        gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vertSrc));
        gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fragSrc));
        gl.linkProgram(prog);
        gl.useProgram(prog);
        programRef.current = prog;

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, "uTime");
        const uRes = gl.getUniformLocation(prog, "uRes");
        const uMouse = gl.getUniformLocation(prog, "uMouse");

        function resize() {
            const qualityScale = 0.75; 
            canvas!.width = window.innerWidth * qualityScale;
            canvas!.height = window.innerHeight * qualityScale;
            canvas!.style.width = window.innerWidth + "px";
            canvas!.style.height = window.innerHeight + "px";
        }
        resize();
        window.addEventListener("resize", resize);

        const start = performance.now();
        function frame() {
            const m = mouseGLRef.current;
            const tgt = targetGLRef.current;
            m.x += (tgt.x - m.x) * 0.028;
            m.y += (tgt.y - m.y) * 0.028;

            const elapsed = (performance.now() - start) / 1000;
            gl!.viewport(0, 0, canvas!.width, canvas!.height);
            gl!.uniform1f(uTime, elapsed);
            gl!.uniform2f(uRes, canvas!.width, canvas!.height);
            gl!.uniform2f(uMouse, m.x, m.y);
            gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
            rafRef.current = requestAnimationFrame(frame);
        }
        frame();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[#030308]">

            {/* WebGL rainbow flow field */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: "block" }}
            />

            {/* Reactive halo — rainbow-tinted following cursor */}
            <motion.div
                className="absolute w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] rounded-full blur-[100px] md:blur-[140px] mix-blend-screen z-10 will-change-transform"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(120,80,255,0.12) 0%, rgba(0,200,255,0.08) 40%, transparent 70%)",
                }}
            />

            {/* Inner accent — warm gold/pink cycling */}
            <motion.div
                className="absolute w-[30vw] h-[30vw] md:w-[20vw] md:h-[20vw] rounded-full blur-[80px] md:blur-[100px] mix-blend-screen z-10 will-change-transform"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(255,150,50,0.08) 0%, rgba(200,50,200,0.05) 50%, transparent 70%)",
                }}
            />
        </div>
    );
};

export default CursorSpotlight;