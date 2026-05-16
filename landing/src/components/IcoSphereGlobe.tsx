import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Vertex ───────────────────────────────────────────────────────────────
const vertexShader = /* glsl */`
varying vec2 vUv;
void main(){
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// ─── Fragment ─────────────────────────────────────────────────────────────
const fragmentShader = /* glsl */`
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
varying vec2  vUv;

#define PI  3.14159265359
#define TAU 6.28318530718

// ── Cheap deterministic hash ──────────────────────────────────────────────
float rng(float s){ return fract(sin(s) * 43758.5453123); }

// ── 2D Simplex Noise for true fluid dynamics ──────────────────────────────
vec2 hash22(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}

float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x+p.y)*K1);
    vec2 a = p - i + (i.x+i.y)*K2;
    float m = step(a.y, a.x); 
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3 n = h*h*h*h*vec3(dot(a,hash22(i+0.0)), dot(b,hash22(i+o)), dot(c,hash22(i+1.0)));
    return dot(n, vec3(70.0));
}

// ── HSL → RGB (full saturation & lightness=0.55 for vivid output) ─────────
vec3 hsl2rgb(float h, float s, float l){
    h = fract(h);  // keep in [0,1]
    float r,g,b;
    float q = l < 0.5 ? l*(1.0+s) : l+s-l*s;
    float p = 2.0*l - q;
    // hue to component helper via inline lambda
    float h1=fract(h+0.333), h2=fract(h), h3=fract(h-0.333);
    r=(h1<0.167)?p+(q-p)*6.0*h1:(h1<0.5)?q:(h1<0.667)?p+(q-p)*(0.667-h1)*6.0:p;
    g=(h2<0.167)?p+(q-p)*6.0*h2:(h2<0.5)?q:(h2<0.667)?p+(q-p)*(0.667-h2)*6.0:p;
    b=(h3<0.167)?p+(q-p)*6.0*h3:(h3<0.5)?q:(h3<0.667)?p+(q-p)*(0.667-h3)*6.0:p;
    return vec3(r,g,b);
}

// ── Star field ────────────────────────────────────────────────────────────
float starField(vec2 fc, vec2 res){
    float col = 0.0;
    for(int i = 0; i < 130; i++){
        float fi = float(i);
        vec2 p   = vec2(rng(fi*3.7)*res.x, rng(fi*6.1)*res.y*0.85);
        float pr = rng(fi*2.3)*1.2 + 0.3;
        float br = rng(fi*5.9)*0.5 + 0.15;
        float tw = sin(uTime*(0.5+rng(fi*11.3)*1.5)+fi)*0.25+0.75;
        col += smoothstep(pr, 0.0, length(fc-p)) * br * tw;
    }
    return clamp(col, 0.0, 1.0);
}

// ── Rim glow — Gaussian angular × radial falloff ──────────────────────────
vec3 rimBlob(float angle, float rimT,
             float blobAngle, vec3 color,
             float angW, float rimW, float str){
    float da = mod(angle - blobAngle + PI, TAU) - PI;
    float angF = exp(-(da*da)/(angW*angW));
    float edge = 1.0 - rimT;                        // 0 at rim, 1 at center
    float rimF = exp(-(edge*edge)/(rimW*rimW));
    return color * angF * rimF * str;
}

// (outerGlow helper removed in favor of continuous radial fall-off)

void main(){
    vec2 res  = uResolution;
    // Y=0 at top, matching canvas convention
    vec2 fc   = vec2(vUv.x, 1.0-vUv.y) * res;

    // ── Sphere: centered, fills ~46% of the shorter side ─────────────────
    float cx = res.x * 0.5;
    float cy = res.y * 0.5;
    float r  = min(res.x, res.y) * 0.46;

    vec2  center = vec2(cx, cy);
    vec2  delta  = fc - center;
    float dist   = length(delta);
    float angle  = atan(delta.y, delta.x);
    float rimT   = clamp(dist/r, 0.0, 1.0);

    // ── Global rotation — one lap every ~35 s ─────────────────────────────
    float rot = uTime * 0.18;

    // ── True Fluid Dynamics & Proper Sequence (No Purple + Yellow clash) ──
    float ba[8]; vec3 bc[8]; float bw[8]; float brm[8]; float bs[8];

    // Hue definitions
    float hRed = 0.005 + sin(uTime * 0.031) * 0.010;  // Deep red
    float hOra = 0.055 + sin(uTime * 0.027) * 0.015;  // Orange
    float hOch = 0.110 + sin(uTime * 0.023) * 0.010;  // Ochre
    float hPur = 0.760 + sin(uTime * 0.028) * 0.025;  // Purple

    // Mirrored map guarantees all 4 colors are universally present on both sides.
    // Purple is fully buffered by Red, so Purple NEVER touches Ochre or Orange anywhere.
    // Sequence: Purple -> Red -> Orange -> Ochre -> [center wrap] -> Ochre -> Orange -> Red -> Purple
    float hArr[8];
    hArr[0] = hPur; hArr[1] = hRed; hArr[2] = hOra; hArr[3] = hOch;
    hArr[4] = hOch; hArr[5] = hOra; hArr[6] = hRed; hArr[7] = hPur;

    float lArr[8]; 
    lArr[0] = 0.45; lArr[1] = 0.55; lArr[2] = 0.55; lArr[3] = 0.48;
    lArr[4] = 0.48; lArr[5] = 0.55; lArr[6] = 0.55; lArr[7] = 0.45;

    // Restored uniform smooth gradients (no tiny pieces)
    // Red & Orange form the immensely bright core, Purple is full-sized but heavily dimmed so it hides in the mix.
    float sArr[8]; 
    sArr[0] = 0.45; sArr[1] = 1.40; sArr[2] = 1.40; sArr[3] = 0.90;
    sArr[4] = 0.90; sArr[5] = 1.40; sArr[6] = 1.40; sArr[7] = 0.45;

    for(int i=0; i<8; i++){
        float fi = float(i);
        float baseA = -PI + fi * 0.785398; 
        
        float drift = noise(vec2(fi * 1.3, uTime * 0.12)) * 1.5; 
        
        ba[i] = baseA + uTime * 0.04 + drift;  
        bc[i] = hsl2rgb(hArr[i], 1.0, lArr[i]);
        
        // Massive, overlapping angular spread to obliterate all empty black gaps.
        bw[i] = 0.55 + noise(vec2(fi * 2.1, uTime * 0.3)) * 0.20;
        brm[i]= 0.08;
        bs[i] = (1.1 + noise(vec2(fi * 1.7, uTime * 0.4)) * 0.2) * sArr[i];
    }

    // ── Output accumulators ───────────────────────────────────────────────
    vec3  color = vec3(0.0);
    float alpha = 0.0;

    // ── Outside sphere: stars + outer glow ───────────────────────────────
    if(dist > r){
        // Stars (only visible outside sphere)
        float s = starField(fc, res);
        color  += vec3(s);
        alpha  = s * 0.8;

        // Spread is a few 10s of pixels
        float spread = r * 0.06 + 15.0; // scales gracefully, e.g. 50px-70px radius
        float outDist = dist - r;
        
        if(outDist < spread * 3.0){
            vec3 og = vec3(0.0);
            for(int i=0; i<8; i++){
                float da = mod(angle - ba[i] + PI, TAU) - PI;
                float glowW = bw[i] * 2.5; 
                float angF = exp(-(da*da)/(glowW*glowW));
                og += bc[i] * angF * bs[i];
            }
            // Radial exponential fade makes it sharp at the rim and fades quickly
            float radialFade = exp(-(outDist*outDist)/(spread*spread));
            og *= radialFade * 0.17; // opacity scale for the outer glow
            
            og     = clamp(og, 0.0, 1.0);
            color += og;
            alpha  = max(alpha, length(og) * 0.7);
        }
    }

    // ── Inside sphere: dark body + vivid rim glow ─────────────────────────
    if(dist <= r){
        // Deep ambient warm body instead of empty black
        color = vec3(0,0,0);
        alpha = 1.0;

        vec3 rim = vec3(0.0);
        for(int i=0; i<8; i++){
            rim += rimBlob(angle, rimT, ba[i], bc[i], bw[i], brm[i], bs[i]);
        }

        // ── 3D Projection Volumetric Bleed ──
        float nz = sqrt(max(1.0 - rimT * rimT, -0.1));
        
        vec3 bleed = vec3(0.0);
        // Stretches the bleed heavily into the center (lower exponent) avoiding dark spots
        float bleedFade = exp(-nz * 1.8) * 0.65; 
        
        float rimSoften = smoothstep(0.0, 0.20, nz); 

        for(int i=0; i<8; i++){
            // Allow the bleed gradients to spread widely
            float dynamicW = 0.45; 
            bleed += rimBlob(angle, rimT, ba[i], bc[i], bw[i]*0.9, dynamicW, bs[i] * bleedFade * rimSoften);
        }

        color += clamp(rim + bleed, 0.0, 1.0);
    }

    // ── True Gaussian Blur Sweep Arc Lines ────────────────────────────────
    float lineDist = abs(dist - r);
    float sigma = dist > r ? 1.5 : 18.0; // More blur: softer 1.5px outer, deep 18px inner
    
    // True Gaussian distribution formula: exp(-x^2 / 2σ^2)
    float lineT = exp(-(lineDist * lineDist) / (2.0 * sigma * sigma));

    // Slowed down the speed of the sweep arcs
    float sweepA1     = uTime * 0.25;
    float sweepA2     = -uTime * 0.15 + 2.0;
    float daS1        = mod(angle - sweepA1 + PI, TAU) - PI;
    float daS2        = mod(angle - sweepA2 + PI, TAU) - PI;
    
    // Exponential angular tail. Gives buttery smooth ease-in/ease-out tapering,
    // avoiding linear or immediate hard stops.
    float arc1        = exp(-(daS1*daS1) / 0.15);
    float arc2        = exp(-(daS2*daS2) / 0.25);
    
    // Reduced opacity for a glassier, extremely faint reflection
    vec3  arcCol      = vec3(1.0) * 0.15; 
    float arcCombined = (arc1 + arc2) * lineT;
    
    color += arcCol * arcCombined;
    alpha  = max(alpha, arcCombined);

    // ── Anti-alias sphere edge ────────────────────────────────────────────
    if(dist > r-2.0 && dist < r+2.0){
        float aa = smoothstep(r+2.0, r-2.0, dist);
        alpha    = mix(alpha, 1.0, aa);
    }

    // ── Filmic tone (prevents colour clipping to flat white) ─────────────
    color = 1.0 - exp(-color * 1.2);

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

// ═══════════════════════════════════════════════════════════════════════════
export default function IcoSphereGlobe({ className = '' }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: true,          // transparent background — composites over page
            preserveDrawingBuffer: true,
        });
        const dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(dpr);
        renderer.setClearColor(0x000000, 0);

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const scene  = new THREE.Scene();

        const uniforms = {
            uTime:       { value: 0 },
            uResolution: { value: new THREE.Vector2() },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            depthWrite: false,
        });

        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

        const resize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            renderer.setSize(w, h, false);
            uniforms.uResolution.value.set(w * dpr, h * dpr);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const clock = new THREE.Clock();
        let rafId: number;
        const animate = () => {
            rafId = requestAnimationFrame(animate);
            uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        };
        animate();

        // const handleKeyDown = (e:any) => {
        //     if (e.key === 's') { // Press 's' to save
        //         const dataURL = canvas.toDataURL('image/png');
        //         const link = document.createElement('a');
        //         link.download = 'ico-sphere-globe.png';
        //         link.href = dataURL;
        //         link.click();
        //     }
        // };
        // window.addEventListener('keydown', handleKeyDown);
        // return () => {
        //     window.removeEventListener('keydown', handleKeyDown);
        //     cancelAnimationFrame(rafId);
        //     ro.disconnect();
        //     renderer.dispose();
        //     material.dispose();
        // };
    }, []);

    return (
        <div className={className} style={{ width: "100%", height: "100%", position: "relative" }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    outline: "none",
                    filter: "blur(2px)", // Global gaussian blur diffuses the sharp edges into an optical aura
                    willChange: "filter"
                }}
            />
        </div>
    );
}
