import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────
//  AnimatedHeading
//  Each word slides up + fades in when the element
//  enters the viewport. Staggered per-word delay.
// ─────────────────────────────────────────────────────
export default function AnimatedHeading({ text, className = "" }) {
  const ref     = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <h1 ref={ref} className={`overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.28em] last:mr-0"
        >
          <span
            className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transitionDelay: `${i * 80}ms`,
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity:   visible ? 1 : 0,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}