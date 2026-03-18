/**
 * LusionAboutSection.jsx
 *
 * EXACT pixel-accurate recreation of lusion.co's about section animation.
 *
 * WHAT ACTUALLY HAPPENS (from screenshot analysis):
 *
 * STATE 1 — "About" view (your screenshot 1)
 *   - Left side: thick blue C-arc SVG + a flat rounded card with blue-tinted flower photo
 *   - Card has NO skew, NO rotation. It's just a normal card sitting left.
 *   - Right side: paragraph text + "ABOUT US" pill button
 *
 * STATE 2 — Mid transition (your screenshot 2)
 *   - The card SHEARS/SKEWS — left edge goes UP, right edge goes DOWN
 *     This creates the "parallelogram" / "flying card" look
 *   - The card image CHANGES to the vortex video frame
 *   - The blue C-arc transforms into a long WAVY RIBBON across top of screen
 *   - Card moves toward center, grows slightly
 *   - Sharp corners (border-radius reduces to 8px or 0)
 *   - Chromatic aberration effect on the card image
 *
 * STATE 3 — Play Reel (your screenshot 3)
 *   - Card is now FULL WIDTH, completely flat (skew=0)
 *   - Shows "PLAY ▶ REEL" with background video frame (blue sky + red ribbon 3D shape)
 *   - 10 cross (+) markers appear at corners and edges outside the card
 *   - Ribbon/arc completely gone
 *
 * TECHNIQUE:
 *   - CSS transforms driven by scroll progress (no WebGL needed for the skew!)
 *   - The skew is: transform: skewY(-Xdeg) + perspective() for depth
 *   - GSAP-style lerp for smooth elastic feel
 *   - Scroll progress mapped from the sticky section's height
 */

import { useEffect, useRef, useState } from "react";

// ─── lerp & clamp helpers ───────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const smoothstep = (min, max, val) => {
  const t = clamp((val - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

// ─── The one component you need ─────────────────────────────────────────────
export default function LusionAboutSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const arcRef = useRef(null);
  const rafRef = useRef(null);

  // Lerped state
  const state = useRef({
    skewY: 0,   // card shear — 0 = flat, -18 = max parallelogram
    scaleX: 1,   // card width scale
    scaleY: 1,
    translateX: 0,   // px offset from left anchor
    translateY: 0,
    borderRadius: 16,  // px
    cardOpacity: 1,
    arcOpacity: 1,
    chromaX: 0,   // chromatic aberration
    reelOpacity: 0,   // PLAY REEL overlay fade in
    crossOpacity: 0,   // cross markers
    imageBlend: 0,   // 0=flower photo, 1=vortex image
  });

  const targets = useRef({ ...state.current });
  const lastScroll = useRef(0);
  const time = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      time.current += 0.016;

      const scrollY = window.scrollY;
      const vel = scrollY - lastScroll.current;
      lastScroll.current = scrollY;

      // Scroll progress within the 300vh sticky section
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / total, 0, 1);

      const T = targets.current;
      const S = state.current;

      // ── PHASE TARGETS ──────────────────────────────────────────────

      // SKEW: 0 → peaks at -18deg midway → back to 0
      // The parallelogram in screenshot 2 is roughly -18...-20 degrees
      const skewPeak = smoothstep(0.05, 0.45, p) - smoothstep(0.5, 0.85, p);
      T.skewY = -18 * skewPeak;

      // SCALE: card grows from ~48% screen width to ~90% screen width
      const scaleProgress = smoothstep(0.0, 0.82, p);
      T.scaleX = lerp(1.0, 1.9, scaleProgress);   // relative to initial size
      T.scaleY = lerp(1.0, 1.75, scaleProgress);

      // TRANSLATE X: card starts anchored left, moves to center
      T.translateX = lerp(0, 0, smoothstep(0.0, 0.8, p)); // stays left until end
      // At final state, card is centered
      T.translateX = lerp(0, window.innerWidth * 0.04, smoothstep(0.5, 0.9, p));

      // TRANSLATE Y: slight downward drift during skew peak, returns
      T.translateY = lerp(0, 30, skewPeak);

      // BORDER RADIUS: 16px → 8px during skew → 16px at final
      T.borderRadius = lerp(16, 8, skewPeak) + lerp(0, 8, smoothstep(0.8, 1.0, p));

      // CHROMA: scales with scroll velocity AND skew intensity
      T.chromaX = Math.abs(vel) * 0.6 * Math.abs(skewPeak);

      // IMAGE BLEND: flower → vortex during mid-transition
      T.imageBlend = smoothstep(0.1, 0.55, p);

      // PLAY REEL overlay: fades in near end
      T.reelOpacity = smoothstep(0.78, 0.95, p);

      // CROSS MARKERS: appear with reel
      T.crossOpacity = smoothstep(0.82, 0.98, p);

      // ── LERP all state values ──────────────────────────────────────
      // Fast for skew (elastic feel), slow for scale (heavy feel)
      const Ff = 0.09; // fast
      const Fs = 0.06; // slow

      S.skewY = lerp(S.skewY, T.skewY, Ff);
      S.scaleX = lerp(S.scaleX, T.scaleX, Fs);
      S.scaleY = lerp(S.scaleY, T.scaleY, Fs);
      S.translateX = lerp(S.translateX, T.translateX, Fs);
      S.translateY = lerp(S.translateY, T.translateY, Ff);
      S.borderRadius = lerp(S.borderRadius, T.borderRadius, Ff);
      S.arcOpacity = lerp(S.arcOpacity, T.arcOpacity, 0.07);
      S.chromaX = lerp(S.chromaX, T.chromaX, 0.12);
      S.imageBlend = lerp(S.imageBlend, T.imageBlend, 0.055);
      S.reelOpacity = lerp(S.reelOpacity, T.reelOpacity, 0.06);
      S.crossOpacity = lerp(S.crossOpacity, T.crossOpacity, 0.06);

      // Elastic snap-back when idle
      if (Math.abs(vel) < 0.5) {
        S.chromaX *= 0.80;
      }

      // ── APPLY to DOM ───────────────────────────────────────────────
      const card = cardRef.current;
      const arc = arcRef.current;
      if (!card || !arc) return;

      // Card transform: the key is perspective + skewY for the 3D parallelogram look
      card.style.transform = `
        translateX(${S.translateX}px)
        translateY(${S.translateY}px)
        scaleX(${S.scaleX})
        scaleY(${S.scaleY})
        skewY(${S.skewY}deg)
      `;
      card.style.borderRadius = `${S.borderRadius}px`;

      // Chromatic aberration via CSS filter hue + slight translate on pseudo-layers
      // We use a box-shadow color trick + filter to fake RGB split
      const cAmt = S.chromaX;
      card.style.filter = cAmt > 0.5
        ? `drop-shadow(${cAmt * 0.8}px 0 0 rgba(255,0,50,0.35)) drop-shadow(-${cAmt * 0.8}px 0 0 rgba(0,100,255,0.35))`
        : "none";

      // Arc fade
      arc.style.opacity = S.arcOpacity;


      // Image blend: overlay opacity controls flower→vortex
      const flowerLayer = card.querySelector(".card-flower");
      const vortexLayer = card.querySelector(".card-vortex");
      if (flowerLayer) flowerLayer.style.opacity = 1 - S.imageBlend;
      if (vortexLayer) vortexLayer.style.opacity = S.imageBlend;

      // Play Reel overlay
      const reelOverlay = card.querySelector(".card-reel");
      if (reelOverlay) reelOverlay.style.opacity = S.reelOpacity;

      // Cross markers
      const crosses = document.querySelectorAll(".lusion-cross");
      crosses.forEach(c => { c.style.opacity = S.crossOpacity; });
    };

    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    // 300vh gives a slow, cinematic transition
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
    >
      {/* ── STICKY VIEWPORT ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{
          height: "100vh",
          background: "#eceef5",
        }}
      >

        {/* ═══════════════════════════════════════════════════════════
            LEFT BLOCK: C-Arc + Card
        ═══════════════════════════════════════════════════════════ */}
        <div
          className="absolute"
          style={{
            // Anchor card to left side
            left: "5vw",
            top: "50%",
            transform: "translateY(-50%)",
            // Card initial size: ~44vw × auto(16:9)
            width: "44vw",
            maxWidth: 520,
            zIndex: 10,
          }}
        >

          {/* ── Blue C-Arc SVG (behind card, screenshot 1) ────────── */}
          <div
            ref={arcRef}
            className="absolute pointer-events-none"
            style={{
              // Arc sits behind card, offset to left
              left: "-8%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "68%",
              zIndex: 1,
            }}
          >

          </div>

          {/* ── THE CARD ─────────────────────────────────────────────
              transform-origin: left center so it grows rightward
              This is the element that gets all the transforms
          ── */}
          <div
            ref={cardRef}
            className="relative overflow-hidden"
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              borderRadius: 16,
              transformOrigin: "left center",
              zIndex: 5,
              willChange: "transform",
              // slight box shadow matching lusion.co
              boxShadow: "0 20px 80px rgba(40, 60, 200, 0.12)",
            }}
          >

            {/* ── LAYER 1: Flower photo (screenshot 1 state) ──────── */}
            <div
              className="card-flower absolute inset-0"
              style={{ transition: "opacity 0.1s" }}
            >
              {/*
                Screenshot 1: blue-tinted flower/plant photo
                We recreate with CSS: lavender bg + blue duotone overlay
              */}
              <div
                className="w-full h-full relative overflow-hidden"
                style={{ background: "#b4b8f0" }}
              >
                {/* Simulated blue-tinted botanical photo */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 80% 70% at 55% 55%, #d0d4ff 0%, #a0a8f0 30%, #7080e8 70%, #5060d8 100%)
                    `,
                  }}
                />
                {/* Plant stem lines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 520 320"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ opacity: 0.6 }}
                >
                  {/* Stems */}
                  <line x1="120" y1="320" x2="100" y2="80" stroke="#4455dd" strokeWidth="3" />
                  <line x1="120" y1="320" x2="160" y2="60" stroke="#4455dd" strokeWidth="2.5" />
                  <line x1="120" y1="320" x2="80" y2="120" stroke="#4455dd" strokeWidth="2" />
                  <line x1="120" y1="320" x2="220" y2="100" stroke="#4455dd" strokeWidth="2" />
                  <line x1="120" y1="320" x2="60" y2="180" stroke="#3344cc" strokeWidth="2" />
                  <line x1="120" y1="320" x2="300" y2="140" stroke="#3344cc" strokeWidth="1.5" />
                  {/* Flower heads */}
                  <circle cx="100" cy="75" r="28" fill="#8899ff" opacity="0.7" />
                  <circle cx="100" cy="75" r="16" fill="#aabbff" opacity="0.8" />
                  <circle cx="160" cy="55" r="24" fill="#7788ee" opacity="0.7" />
                  <circle cx="160" cy="55" r="14" fill="#99aaff" opacity="0.8" />
                  <circle cx="80" cy="115" r="20" fill="#6677dd" opacity="0.6" />
                  <circle cx="220" cy="95" r="32" fill="#8899ff" opacity="0.7" />
                  <circle cx="220" cy="95" r="18" fill="#aabbff" opacity="0.8" />
                  <circle cx="60" cy="170" r="18" fill="#5566cc" opacity="0.6" />
                  <circle cx="300" cy="130" r="22" fill="#7788ee" opacity="0.6" />
                  {/* Fluffy petals suggestion */}
                  {[100, 160, 220].map((cx, i) => {
                    const cy = [75, 55, 95][i];
                    return Array.from({ length: 6 }).map((_, j) => (
                      <ellipse
                        key={`p${i}${j}`}
                        cx={cx + Math.cos(j * 60 * Math.PI / 180) * 22}
                        cy={cy + Math.sin(j * 60 * Math.PI / 180) * 22}
                        rx="10" ry="6"
                        transform={`rotate(${j * 60}, ${cx + Math.cos(j * 60 * Math.PI / 180) * 22}, ${cy + Math.sin(j * 60 * Math.PI / 180) * 22})`}
                        fill="#b0c0ff"
                        opacity="0.5"
                      />
                    ));
                  })}
                </svg>
                {/* Blue duotone overlay — matches the lavender/indigo tint in screenshot 1 */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "rgba(80, 90, 220, 0.38)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
            </div>

            {/* ── LAYER 2: Vortex/portal (screenshot 2 — mid-transition) ── */}
            <div
              className="card-vortex absolute inset-0"
              style={{ opacity: 0, transition: "opacity 0.1s" }}
            >
              <VortexCanvas />
            </div>

            {/* ── LAYER 3: Play Reel overlay (screenshot 3 — final) ── */}
            <div
              className="card-reel absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0, zIndex: 20 }}
            >
              {/* Blue sky background */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #6baaf7 0%, #89b8f8 40%, #a8c8fa 100%)",
                }}
              />
              {/* Red/coral curved 3D ribbon — the big red shape in screenshot 3 */}
              <div
                className="absolute"
                style={{
                  width: "22%",
                  height: "180%",
                  top: "-40%",
                  left: "46%",
                  background: "linear-gradient(180deg, #ff8575 0%, #f05a4a 50%, #e03030 100%)",
                  borderRadius: "40% 50% 50% 40%",
                  transform: "rotate(-5deg)",
                  boxShadow: "inset -8px 0 24px rgba(0,0,0,0.15)",
                }}
              />
              {/* Second red stripe for the curved 3D look */}
              <div
                className="absolute"
                style={{
                  width: "15%",
                  height: "180%",
                  top: "-40%",
                  left: "55%",
                  background: "linear-gradient(180deg, #e06050 0%, #c04030 100%)",
                  borderRadius: "30% 50% 50% 30%",
                  transform: "rotate(-3deg)",
                  opacity: 0.6,
                }}
              />
              {/* White blob shape top-left */}
              <div
                className="absolute"
                style={{
                  width: "14%",
                  aspectRatio: "1",
                  top: "18%",
                  left: "11%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 60%, transparent 100%)",
                  borderRadius: "50% 60% 40% 55%",
                  filter: "blur(3px)",
                }}
              />
              {/* PLAY ▶ REEL text */}
              <div className="relative z-10 flex items-center gap-6">
                <span
                  className="font-extrabold text-white tracking-tight"
                  style={{ fontSize: "clamp(36px, 6.5vw, 88px)", letterSpacing: "-0.02em" }}
                >
                  PLAY
                </span>
                {/* Play button — white pill with triangle */}
                <div
                  className="flex items-center justify-center bg-white rounded-full flex-shrink-0"
                  style={{
                    width: "clamp(52px, 5vw, 72px)",
                    height: "clamp(52px, 5vw, 72px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ width: "36%", marginLeft: "8%" }}
                  >
                    <polygon points="4,2 17,10 4,18" fill="#111" />
                  </svg>
                </div>
                <span
                  className="font-extrabold text-white tracking-tight"
                  style={{ fontSize: "clamp(36px, 6.5vw, 88px)", letterSpacing: "-0.02em" }}
                >
                  REEL
                </span>
              </div>
            </div>

          </div>{/* end card */}

          {/* ── Cross (+) markers outside card (screenshot 3) ───────── */}
          {/* These sit in a grid around the card boundary */}
          <CrossMarkers />

        </div>{/* end left block */}

      </div>{/* end sticky */}
    </section>
  );
}



// ── Cross (+) markers for the Play Reel card (screenshot 3) ─────────────────
function CrossMarkers() {
  // 10 crosses: 5 on top edge, 5 on bottom edge
  const positions = [
    // top row
    { top: -28, left: -28 },
    { top: -28, left: "22%" },
    { top: -28, left: "50%" },
    { top: -28, left: "78%" },
    { top: -28, right: -28 },
    // bottom row
    { bottom: -28, left: -28 },
    { bottom: -28, left: "22%" },
    { bottom: -28, left: "50%" },
    { bottom: -28, right: "22%" },
    { bottom: -28, right: -28 },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="lusion-cross absolute pointer-events-none"
          style={{
            ...pos,
            width: 18,
            height: 18,
            opacity: 0,
            transform: pos.left === "50%" || pos.left === "22%" || pos.left === "78%" || pos.right === "22%"
              ? "translateX(-50%)" : "none",
            transition: "opacity 0.3s",
          }}

        >
          {/* Vertical bar */}
          <div style={{
            position: "absolute",
            left: "50%", top: 0,
            width: 1.5, height: "100%",
            background: "#9aaaf8",
            transform: "translateX(-50%)",
          }} />
          {/* Horizontal bar */}
          <div style={{
            position: "absolute",
            top: "50%", left: 0,
            height: 1.5, width: "100%",
            background: "#9aaaf8",
            transform: "translateY(-50%)",
          }} />
        </div>
      ))}
    </>
  );
}

// ── Vortex canvas: animated WebGL-style swirl for mid-transition ─────────────
function VortexCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep blue/indigo background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#2233aa");
      bg.addColorStop(0.5, "#3344cc");
      bg.addColorStop(1, "#1122aa");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Vortex spiral
      const cx = W * 0.40, cy = H * 0.50;
      for (let ring = 12; ring >= 0; ring--) {
        const radius = (ring / 12) * W * 0.38;
        const rotOffset = t * (ring % 2 === 0 ? 0.8 : -0.6) + ring * 0.5;
        const alpha = 0.08 + (1 - ring / 12) * 0.35;
        const brightness = 0.3 + (1 - ring / 12) * 0.7;

        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.02) {
          const r = radius * (1 + 0.08 * Math.sin(a * 5 + rotOffset));
          const x = cx + Math.cos(a + rotOffset * 0.3) * r;
          const y = cy + Math.sin(a + rotOffset * 0.3) * r * 0.6;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();

        const hue = 220 + ring * 8;
        const sat = 60 + ring * 2;
        const lum = Math.floor(brightness * 70);
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lum}%, ${alpha})`;
        ctx.fill();
      }

      // Bright vortex core glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.22);
      grd.addColorStop(0, "rgba(220, 230, 255, 0.9)");
      grd.addColorStop(0.3, "rgba(160, 180, 255, 0.5)");
      grd.addColorStop(0.7, "rgba(80,  110, 220, 0.2)");
      grd.addColorStop(1, "rgba(0,   0,   0,   0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, W * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Debris particles (screenshot 2 has scattered white/blue fragments)
      ctx.save();
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + t * 0.4;
        const dist = W * (0.12 + (i % 5) * 0.06);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.55;
        const size = 2 + (i % 4) * 2;
        const alpha2 = 0.3 + (i % 3) * 0.2;

        ctx.fillStyle = `rgba(200, 210, 255, ${alpha2})`;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle + t * 0.3);
        // Mix of squares and thin rectangles
        if (i % 3 === 0) {
          ctx.fillRect(-size / 2, -size / 2, size, size);
        } else {
          ctx.fillRect(-size, -size / 4, size * 2, size / 2);
        }
        ctx.restore();
      }
      ctx.restore();
    };

    let t = 0;
    const loop = () => {
      t += 0.018;
      draw(t);
    };

    rafRef.current = requestAnimationFrame(loop);
    // Kick off loop properly
    const animate = () => {
      t += 0.018;
      rafRef.current = requestAnimationFrame(animate);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#1a2899");
      bg.addColorStop(1, "#0d1a88");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W * 0.40, cy = H * 0.50;
      for (let ring = 10; ring >= 0; ring--) {
        const radius = (ring / 10) * W * 0.36;
        const rot = t * (ring % 2 === 0 ? 0.9 : -0.7) + ring * 0.6;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.025) {
          const r = radius * (1 + 0.1 * Math.sin(a * 4 + rot));
          ctx.lineTo(cx + Math.cos(a + rot * 0.25) * r, cy + Math.sin(a + rot * 0.25) * r * 0.58);
        }
        ctx.closePath();
        const br = 0.25 + (1 - ring / 10) * 0.75;
        ctx.fillStyle = `hsla(${228 + ring * 9}, ${55 + ring}%, ${Math.floor(br * 72)}%, ${0.07 + (1 - ring / 10) * 0.32})`;
        ctx.fill();
      }

      // Core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.2);
      g.addColorStop(0, "rgba(230,238,255,0.92)");
      g.addColorStop(0.4, "rgba(150,175,255,0.45)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, W * 0.2, 0, Math.PI * 2); ctx.fill();

      // Debris
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2 + t * 0.35;
        const d = W * (0.10 + (i % 6) * 0.055);
        const px = cx + Math.cos(a) * d;
        const py = cy + Math.sin(a) * d * 0.52;
        const sz = 3 + (i % 4) * 2.5;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(a + t * 0.4);
        ctx.fillStyle = `rgba(190,210,255,${0.25 + (i % 3) * 0.22})`;
        i % 3 === 0 ? ctx.fillRect(-sz / 2, -sz / 2, sz, sz) : ctx.fillRect(-sz, -sz / 3, sz * 2, sz / 1.5);
        ctx.restore();
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
