import { useRef } from "react";
import LusionCard from "./LusionCard";
import AnimatedHeading from "./AnimatedHeading";

// ─────────────────────────────────────────────────────────────
//  HeroSection
//
//  Layout:
//    [LEFT  — WebGL animated card + C-curve arc]
//    [RIGHT — eyebrow + animated h1 + body + CTA]
//
//  The section is 250vh tall so the sticky inner panel
//  gives the WebGL card room to travel (small → big).
//  The text on the right is NOT animated beyond the heading.
// ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef(null);

  return (
    /**
     * data-lusion-scroll is read by LusionCard to compute
     * scroll progress relative to this section.
     */
    <section
      ref={sectionRef}
      data-lusion-scroll
      className="relative"
      style={{ height: "250vh" }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#eceef5]">

        {/* ── WebGL canvas (full sticky area, z-10) ── */}
        <div className="absolute inset-0 z-10">
          <LusionCard />
        </div>

        {/* ── Left panel: C-curve arc + small card placeholder ── */}
        {/* This is visible ONLY at progress=0 (before WebGL takes over) */}
        <div className="absolute inset-0 z-0 flex items-center">
          <div className="relative flex-shrink-0 w-[44vw] max-w-[480px] h-[44vw] max-h-[480px] ml-[5vw]">

            {/* C-curve SVG */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-1/2 w-[75%] h-[75%] pointer-events-none"
              viewBox="0 0 260 260"
              fill="none"
            >
              <path
                d="M 210 18 C 210 18, 18 18, 18 130 C 18 242, 210 242, 210 242"
                stroke="#3355ff"
                strokeWidth="26"
                strokeLinecap="round"
              />
            </svg>

            {/* Small rounded card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-[46%] -translate-y-1/2 w-[68%] aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_20px_60px_#3355ff28]">
              {/* Vortex gradient placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-[#a0afff] via-[#6675ff] to-[#3355ff] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_45%_42%,_#c8d0ff55_0%,_#8899ff33_50%,_transparent_100%)]" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel: text (always visible, no z interference) ── */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <div className="ml-auto mr-[5vw] w-[42vw] max-w-[500px] pointer-events-auto">

            {/* Eyebrow */}
            <p className="text-[11px] font-bold tracking-[.22em] uppercase text-[#3355ff] mb-5 opacity-80">
              Beyond Visions Within Reach
            </p>

            {/* ── ANIMATED HEADING ── */}
            <AnimatedHeading
              text="We help brands create digital experiences that connect"
              className="text-[clamp(28px,3.4vw,52px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#111122] mb-5"
            />

            {/* Body — NOT animated */}
            <p className="text-[15px] leading-[1.8] text-[#666680] mb-9">
              Lusion is a digital production studio that brings your ideas to life
              through visually captivating designs and interactive experiences.
              With our talented team, we push the boundaries by solving complex
              problems, delivering tailored solutions that exceed expectations and
              engage audiences.
            </p>

            {/* CTA */}
            <button className="inline-flex items-center gap-2.5 bg-white border-none rounded-full px-7 py-3.5 text-[12px] font-bold tracking-[.14em] uppercase text-[#111122] shadow-[0_2px_20px_#00000010] transition-all duration-300 hover:shadow-[0_8px_36px_#3355ff1a] hover:-translate-y-0.5 cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-[#3355ff]" />
              About Us
            </button>
          </div>
        </div>

        {/* ── Scroll hint (fades after first scroll) ── */}
        <div
          id="lusion-scroll-hint"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 transition-opacity duration-500"
        >
          <span className="text-[10px] tracking-[.22em] uppercase text-[#666680] opacity-60">
            Scroll to explore
          </span>
          <div
            className="w-px h-8 bg-gradient-to-b from-[#3355ff] to-transparent"
            style={{ animation: "lusionScrollBar 1.6s ease infinite" }}
          />
        </div>

      </div>

      {/* ── Global keyframes injected once ── */}
      <style>{`
        @keyframes lusionScrollBar {
          0%   { transform: scaleY(0); transform-origin: top; }
          49%  { transform: scaleY(1); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}