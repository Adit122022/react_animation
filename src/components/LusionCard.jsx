import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
//  LusionCard — Scroll-driven WebGL card with parabolic warp
//  Left: animated WebGL card  |  Right: static text section
// ─────────────────────────────────────────────────────────────
export default function LusionCard() {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    bend: 0, bendT: 0,
    chroma: 0, chromaT: 0,
    zpop: 0, zpopT: 0,
    scaleX: 0.3, scaleXT: 0.3,
    scaleY: 0.3, scaleYT: 0.3,
    rotZ: -0.18, rotZT: -0.18,
    posX: 0, posXT: 0,
    opacity: 0, opacityT: 0,
  });
  const scrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, canvas.offsetWidth / canvas.offsetHeight, 0.01, 100);
    camera.position.z = 3;

    // ── Procedural vortex texture ─────────────────────────
    const SZ = 512;
    const texData = new Uint8Array(SZ * SZ * 4);
    for (let y = 0; y < SZ; y++) {
      for (let x = 0; x < SZ; x++) {
        const i = (y * SZ + x) * 4;
        const nx = x / SZ - 0.38, ny = y / SZ - 0.5;
        const r  = Math.sqrt(nx * nx + ny * ny);
        const a  = Math.atan2(ny, nx) + r * 12 - r * r * 6;
        const s  = 0.5 + 0.5 * Math.sin(a * 2.5 - r * 18);
        const t  = 0.5 + 0.5 * Math.cos(a * 1.8 + r * 14);
        const g  = Math.max(0, 1 - r * 3.2);
        texData[i]   = Math.min(255, Math.floor(55  + s * 100 + g * 120));
        texData[i+1] = Math.min(255, Math.floor(60  + t * 70  + g * 90));
        texData[i+2] = Math.min(255, Math.floor(200 + s * 55  + g * 55));
        texData[i+3] = 255;
        if (Math.random() < 0.0008) { texData[i]=220; texData[i+1]=220; texData[i+2]=255; }
      }
    }
    const tex = new THREE.DataTexture(texData, SZ, SZ, THREE.RGBAFormat);
    tex.needsUpdate = true;

    // ── High-density plane (80×80 segs) ──────────────────
    const geo = new THREE.PlaneGeometry(1, 1, 80, 80);

    // ── Shader material ───────────────────────────────────
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex:    { value: tex },
        uBend:   { value: 0 },
        uChroma: { value: 0 },
        uZpop:   { value: 0 },
      },
      transparent: true,
      vertexShader: `
        uniform float uBend;
        uniform float uZpop;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float yc   = uv.y * 2.0 - 1.0;
          float para = 1.0 - yc * yc;
          p.x += uBend * para * 0.22;
          p.z += uZpop  * para * 0.28;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        uniform float uChroma;
        varying vec2 vUv;
        void main() {
          float ab = uChroma * 0.014;
          float r  = texture2D(uTex, vUv + vec2(0.0,  ab)).r;
          float g  = texture2D(uTex, vUv               ).g;
          float b  = texture2D(uTex, vUv + vec2(0.0, -ab)).b;
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ── Ribbon tube ───────────────────────────────────────
    const ribbonPts = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      ribbonPts.push(new THREE.Vector3(
        -3 + t * 6,
        Math.sin(t * Math.PI * 2.2) * 0.3 + Math.cos(t * Math.PI * 3.1) * 0.1,
        -0.08
      ));
    }
    const ribCurve  = new THREE.CatmullRomCurve3(ribbonPts);
    const ribGeo    = new THREE.TubeGeometry(ribCurve, 200, 0.022, 8, false);
    const ribMat    = new THREE.MeshBasicMaterial({ color: 0x4466ff, transparent: true, opacity: 0 });
    const ribbon    = new THREE.Mesh(ribGeo, ribMat);
    scene.add(ribbon);

    // ── Helpers ───────────────────────────────────────────
    const lerp       = (a, b, f) => a + (b - a) * f;
    const clamp      = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const smoothstep = (e0, e1, x) => {
      const t = clamp((x - e0) / (e1 - e0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    // ── Scroll progress (0→1 within the canvas section) ──
    const getProgress = () => {
      const el = canvas.closest("[data-lusion-scroll]") || canvas.parentElement;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      return clamp(-rect.top / total, 0, 1);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────
    let time = 0;
    const s = stateRef.current;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      time += 0.016;

      const vel = scrollRef.current - lastScrollRef.current;
      lastScrollRef.current = scrollRef.current;

      const p = getProgress();
      const F = 0.07;

      // opacity
      if (p < 0.05)      s.opacityT = smoothstep(0, 0.05, p);
      else if (p > 0.88) s.opacityT = 1 - smoothstep(0.88, 1, p);
      else               s.opacityT = 1;

      // visible world units
      const vH  = 2 * Math.tan(THREE.MathUtils.degToRad(20)) * 3;
      const vW  = vH * (canvas.offsetWidth / canvas.offsetHeight);
      const asp = 16 / 9;

      // scale: small → big
      const tScale  = smoothstep(0.05, 0.85, p);
      const smallWW = 0.38 * vW;
      const bigWW   = 0.86 * vW;
      s.scaleXT = lerp(smallWW, bigWW,       tScale);
      s.scaleYT = lerp(smallWW / asp, bigWW / asp, tScale);

      // rotation: tilted → flat
      s.rotZT = lerp(-0.18, 0, smoothstep(0.1, 0.75, p));

      // x position: slightly left → center
      s.posXT = lerp(-vW * 0.1, 0, smoothstep(0.05, 0.75, p));

      // parabolic bend: peaks mid-transition
      const midT     = smoothstep(0.1, 0.55, p) - smoothstep(0.55, 0.88, p);
      const velSign  = vel > 0 ? 1 : -1;
      const velMag   = Math.min(Math.abs(vel) * 0.04, 1);
      s.bendT   = midT * velSign * velMag;
      s.chromaT = Math.abs(s.bendT) * 12;
      s.zpopT   = Math.abs(s.bendT) * 0.9;

      // ribbon alpha
      const ribA = smoothstep(0.15, 0.35, p) * (1 - smoothstep(0.7, 0.9, p));
      ribMat.opacity = 0.75 * ribA;
      ribbon.rotation.z = Math.sin(time * 0.7) * 0.05;
      ribbon.position.y = Math.sin(time * 0.5) * 0.05;

      // lerp all values
      s.bend   = lerp(s.bend,   s.bendT,   F);
      s.chroma = lerp(s.chroma, s.chromaT, F);
      s.zpop   = lerp(s.zpop,   s.zpopT,   F);
      s.scaleX = lerp(s.scaleX, s.scaleXT, 0.055);
      s.scaleY = lerp(s.scaleY, s.scaleYT, 0.055);
      s.rotZ   = lerp(s.rotZ,   s.rotZT,   0.055);
      s.posX   = lerp(s.posX,   s.posXT,   0.055);
      s.opacity= lerp(s.opacity,s.opacityT, 0.08);

      // elastic snap back to flat when idle
      if (Math.abs(vel) < 0.3) {
        s.bend   *= 0.86;
        s.chroma *= 0.86;
        s.zpop   *= 0.86;
      }

      mat.uniforms.uBend.value   = s.bend;
      mat.uniforms.uChroma.value = s.chroma;
      mat.uniforms.uZpop.value   = s.zpop;

      mesh.scale.set(s.scaleX, s.scaleY, 1);
      mesh.rotation.z = s.rotZ;
      mesh.position.set(s.posX, 0, 0);

      canvas.style.opacity = s.opacity;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      tex.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0 }}
    />
  );
}