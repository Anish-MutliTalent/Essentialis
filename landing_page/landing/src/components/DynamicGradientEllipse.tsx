import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GLOBAL_TIME_ORIGIN = typeof performance !== 'undefined' ? performance.now() : Date.now();
const SPEED_MULTIPLIER = 6;

const vertexShader = /* glsl */`
varying vec2 vUv;
void main(){
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */`
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColor;
uniform float uOpacity;
uniform float uPhaseOffset;
uniform float uLinearRotation;
uniform float uMultiLobe;
varying vec2  vUv;

#define PI  3.14159265359
#define TAU 6.28318530718

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

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for(int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main(){
    vec2 res    = uResolution;
    vec2 fc     = vec2(vUv.x, 1.0 - vUv.y) * res;
    vec2 center = res * 0.5;
    vec2 delta  = fc - center;

    vec2  norm        = delta / (res * 0.5);
    float ellipseDist = length(norm);

    float radialT = smoothstep(0.34, 1.0, ellipseDist);

    float angle = atan(delta.y, delta.x);

    float linearPhase = mod(uTime * 0.18, TAU);
    float easedPhase = linearPhase - 0.85 * sin(linearPhase);
    float activePhase = mix(easedPhase, linearPhase, uLinearRotation);
    float lobeAngle  = uPhaseOffset - activePhase;

    float da = mod(angle - lobeAngle + PI, TAU) - PI;

    float edgeNoise = noise(vec2(angle * 1.5 + uTime * 0.08, ellipseDist * 3.0)) * 0.35;
    da += edgeNoise;

    float angW      = 1.1 + noise(vec2(uTime * 0.1, 0.0)) * 0.15;
    float colorMask = exp(-(da * da) / (angW * angW));

    if (uMultiLobe > 0.5) {
        float da2 = mod(angle - lobeAngle + TAU/3.0 + PI, TAU) - PI;
        float da3 = mod(angle - lobeAngle - TAU/3.0 + PI, TAU) - PI;
        colorMask += exp(-(da2 * da2) / (angW * angW)) * 0.65;
        colorMask += exp(-(da3 * da3) / (angW * angW)) * 0.65;
    }

    vec2  turbUV = norm * 2.5 + uTime * 0.04;
    float turb   = fbm(turbUV) * 0.15 + 0.85;
    colorMask   *= turb;

    vec3 col = uColor * radialT * colorMask * 1.8;

    float alphaFade = 1.0 - smoothstep(0.75, 1.0, ellipseDist);

    col = min(col, 1.0);

    gl_FragColor = vec4(col, alphaFade * uOpacity);
}
`;

interface InstanceState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    color: THREE.Vector3;
    opacity: number;
    phaseOffset: number;
    linearRotation: number;
    multiLobe: number;
    timeOffset: number;
    isVisible: boolean;
}

class EllipseRenderManager {
    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.OrthographicCamera | null = null;
    private material: THREE.ShaderMaterial | null = null;
    private instances = new Map<symbol, InstanceState>();
    private rafId: number | null = null;
    private dpr = 1;

    private init() {
        if (this.renderer) return;
        const offscreen = document.createElement('canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: offscreen,
            antialias: false,
            alpha: true,
            preserveDrawingBuffer: true,
            premultipliedAlpha: true,
        });
        this.dpr = Math.min(window.devicePixelRatio, 2);
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000, 0);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime:           { value: 0 },
                uResolution:     { value: new THREE.Vector2() },
                uColor:          { value: new THREE.Vector3(1, 1, 1) },
                uOpacity:        { value: 1 },
                uPhaseOffset:    { value: 0 },
                uLinearRotation: { value: 0 },
                uMultiLobe:      { value: 0 },
            },
            transparent: true,
            depthWrite: false,
        });
        this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

        // Pre-compile shader on init to prevent frame drops on first visible render
        this.renderer.setSize(1, 1, false);
        this.renderer.compile(this.scene, this.camera);
        this.renderer.render(this.scene, this.camera);
    }

    register(state: InstanceState): symbol {
        this.init();
        const id = Symbol('ellipse');
        this.instances.set(id, state);
        if (this.rafId === null) this.rafId = requestAnimationFrame(this.tick);
        return id;
    }

    update(id: symbol, patch: Partial<InstanceState>) {
        const inst = this.instances.get(id);
        if (!inst) return;
        Object.assign(inst, patch);
    }

    unregister(id: symbol) {
        this.instances.delete(id);
        if (this.instances.size === 0 && this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private tick = () => {
        this.rafId = requestAnimationFrame(this.tick);
        if (!this.renderer || !this.scene || !this.camera || !this.material) return;
        const t = (performance.now() - GLOBAL_TIME_ORIGIN) / 1000 * SPEED_MULTIPLIER;
        const u = this.material.uniforms;

        for (const inst of this.instances.values()) {
            if (!inst.isVisible) continue;

            const canvas = inst.canvas;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (w === 0 || h === 0) continue;

            const maxSize = 128;
            const scale = Math.min(1, maxSize / Math.max(w, h));
            const tw = Math.max(1, Math.floor(w * scale));
            const th = Math.max(1, Math.floor(h * scale));

            this.renderer.setSize(tw, th, false);

            u.uTime.value           = t + inst.timeOffset;
            u.uResolution.value.set(tw, th);
            u.uColor.value.copy(inst.color);
            u.uOpacity.value        = inst.opacity;
            u.uPhaseOffset.value    = inst.phaseOffset;
            u.uLinearRotation.value = inst.linearRotation;
            u.uMultiLobe.value      = inst.multiLobe;

            this.renderer.render(this.scene, this.camera);

            if (canvas.width !== tw || canvas.height !== th) {
                canvas.width = tw;
                canvas.height = th;
            }
            const ctx = inst.ctx;
            if (!ctx) continue;
            ctx.clearRect(0, 0, tw, th);
            ctx.drawImage(this.renderer.domElement, 0, 0);
        }
    };
}

const manager = new EllipseRenderManager();

interface Props {
    color: string;
    opacity?: number;
    phaseOffset?: number;
    linearRotation?: boolean;
    multiLobe?: boolean;
    timeOffset?: number;
    className?: string;
    style?: React.CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function rgbaToRgb(s: string): [number, number, number] {
    const m = s.match(/[\d.]+/g);
    if (!m || m.length < 3) return [1, 1, 1];
    return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255];
}

function parseColor(c: string): [number, number, number] {
    if (c.startsWith('#')) return hexToRgb(c);
    if (c.startsWith('rgb')) return rgbaToRgb(c);
    return hexToRgb(c);
}

export default function DynamicGradientEllipse({
    color,
    opacity = 1,
    phaseOffset = 0,
    linearRotation = false,
    multiLobe = false,
    timeOffset = 0,
    className = '',
    style,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const idRef = useRef<symbol | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const [r, g, b] = parseColor(color);
        const id = manager.register({
            canvas,
            ctx,
            color: new THREE.Vector3(r, g, b),
            opacity,
            phaseOffset,
            linearRotation: linearRotation ? 1 : 0,
            multiLobe: multiLobe ? 1 : 0,
            timeOffset,
            isVisible: false,
        });
        idRef.current = id;

        const observer = new IntersectionObserver(([entry]) => {
            manager.update(id, { isVisible: entry.isIntersecting });
        });
        observer.observe(canvas);

        return () => {
            observer.disconnect();
            manager.unregister(id);
            idRef.current = null;
        };
    }, []);

    useEffect(() => {
        const id = idRef.current;
        if (!id) return;
        const [r, g, b] = parseColor(color);
        manager.update(id, {
            color: new THREE.Vector3(r, g, b),
            opacity,
            phaseOffset,
            linearRotation: linearRotation ? 1 : 0,
            multiLobe: multiLobe ? 1 : 0,
            timeOffset,
        });
    }, [color, opacity, phaseOffset, linearRotation, multiLobe, timeOffset]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: 'block', width: '100%', height: '100%', ...style }}
        />
    );
}
