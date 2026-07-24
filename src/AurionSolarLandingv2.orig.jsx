import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Sun, Menu, X, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp,
  ShieldCheck, Zap, Wrench, Factory, MapPin, Mail, Clock,
  Star, ArrowUp, Quote, Award, FileCheck2, ClipboardList,
  PackageCheck, Boxes, Globe2, FlaskConical, Layers, Ship, PhoneCall
} from "lucide-react";

/* lucide-react no longer ships brand/social icons (trademark reasons),
   so these are small inline SVG stand-ins with the same 14x14 usage. */
const Facebook = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Instagram = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Linkedin = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A5.98 5.98 0 0 1 16 8z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const Twitter = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);



const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --color-primary: #222831;
  --color-primary-dark: #14181D;
  --color-secondary: #393E46;
  --color-accent: #00ADB5;
  --color-accent-dark: #00939A;
  --white: #FFFFFF;
  --color-bg: #EEEEEE;
  --color-text: #2A2F38;
  --font-display: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}

.hg-chip-accent {
  display: inline-flex; align-items: center; gap: 6px; background: rgba(0,173,181,0.12);
  color: var(--color-accent-dark); font-weight: 700; font-size: 11px; letter-spacing: 0.5px;
  text-transform: uppercase; padding: 6px 12px; border-radius: 999px;
  border: 1px solid rgba(0,173,181,0.25);
}


/* ---------------------------------------------------------
   TYPE SCALE (px) — every text role on the page maps to one
   of these so sizing stays consistent site-wide:
   11  eyebrow / kicker / step number   (uppercase, tracked, 600)
   12  caption / meta / fine print
   13  small body (secondary text inside dense cards)
   14  body (default paragraph, base UI text, nav, inputs)
   15  h4 (card titles, small headings)
   15.5 lead (section intro paragraphs, hero/about supporting copy)
   16  h3 (subsection heading — process steps, group labels)
   24  h2 (section heading)
   26  stat-md (secondary stat numbers)
   32  stat-lg (primary/emphasized stat numbers)
   clamp(32,4.4vw,52) h1 (hero headline only)
--------------------------------------------------------- */
.hg-root { font-family: var(--font-body); font-size: 14px; color: var(--color-text); background: var(--color-bg); width: 100%; overflow-wrap: break-word; }
html, body { overflow-x: clip; max-width: 100%; }
.hg-root img, .hg-root svg { max-width: 100%; height: auto; }
.hg-root h1, .hg-root h2, .hg-root h3, .hg-root h4 { font-family: var(--font-display); color: var(--color-primary); margin: 0; }
.hg-root p { line-height: 1.7; }
.hg-root * { box-sizing: border-box; }
.hg-root a { text-decoration: none; color: inherit; }
.hg-root button { font-family: var(--font-body); cursor: pointer; }

.hg-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.hg-reveal.hg-in { opacity: 1; transform: translateY(0); }

.hg-btn-primary {
  background: var(--color-primary-dark); color: #fff; border: none; padding: 14px 28px;
  border-radius: 999px; font-weight: 600; font-size: 15px; display: inline-flex;
  align-items: center; gap: 8px; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  box-shadow: 0 8px 24px rgba(162, 162, 162, 0.28);
}
.hg-btn-primary:hover { transform: translateY(-2px); background: var(--color-accent-dark); box-shadow: 0 12px 30px rgba(0,173,181,0.38); }



.hg-btn-glass {
  background: rgba(255,255,255,0.10); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.28); color: #fff; padding: 14px 28px;
  border-radius: 999px; font-weight: 600; font-size: 15px; display: inline-flex;
  align-items: center; gap: 8px; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.hg-btn-glass:hover { transform: translateY(-2px); background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.45); box-shadow: 0 12px 30px rgba(0,0,0,0.2); }
.hg-btn-glass:active { transform: translateY(0); background: rgba(255,255,255,0.14); }
.hg-btn-glass:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }






.hg-btn-secondary {
  background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.6); padding: 13px 26px;
  border-radius: 999px; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.hg-btn-secondary:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

.hg-btn-outline {
  background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); padding: 10px 20px;
  border-radius: 999px; font-weight: 600; font-size: 13.5px; display: inline-flex; align-items: center; gap: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}
.hg-btn-outline:hover { background: var(--color-primary); color: #fff; }

.hg-card {
  background: var(--white); border-radius: 16px; padding: 18px 18px;
  box-shadow: 0 2px 8px rgba(34,40,49,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(34,40,49,0.06);
}
.hg-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(34,40,49,0.12); }

.hg-glass {
  background: rgba(255,255,255,0.10); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.22); border-radius: 18px;
}

.hg-navlink { position: relative; font-weight: 500; font-size: 14px; padding: 6px 2px; }
.hg-navlink::after { content: ""; position: absolute; left: 0; bottom: -2px; height: 2px; width: 0; background: var(--color-accent); transition: width 0.25s ease; }
.hg-navlink:hover::after { width: 100%; }

.hg-float { animation: hgFloat 5s ease-in-out infinite; }
@keyframes hgFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }

.hg-spin-slow { animation: hgSpin 30s linear infinite; }
@keyframes hgSpin { to { transform: rotate(360deg); } }

.hg-pulse-dot { animation: hgPulseDot 2.4s ease-in-out infinite; }
@keyframes hgPulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

.hg-wave { animation: hgWave 12s ease-in-out infinite alternate; }
@keyframes hgWave { from { transform: translateX(0); } to { transform: translateX(-40px); } }

.hg-accordion-panel { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }

.hg-input {
  width: 100%; padding: 13px 16px; border-radius: 12px; border: 1.5px solid rgba(34,40,49,0.15);
  background: var(--color-bg); font-family: var(--font-body); font-size: 14px; color: var(--color-text);
  transition: border-color 0.2s ease;
}
.hg-input:focus { outline: none; border-color: var(--color-accent); }

.hg-scrollbar-hide::-webkit-scrollbar { display: none; }

.hg-mobile-toggle { display: none; }

.hg-stretch { height: 100%; }

@media (max-width: 860px) {
  .hg-desktop-nav { display: none !important; }
  .hg-hero-grid { grid-template-columns: 1fr !important; }
  .hg-hero-arc { margin-top: 32px; }
  .hg-mobile-toggle { display: flex !important; align-items: center; justify-content: center; }
}

@media (max-width: 760px) {
  #about { grid-template-columns: 1fr !important; }
  #contact { grid-template-columns: 1fr !important; }
  footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
}

@media (max-width: 900px) {
  .hg-bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .hg-product-row { grid-template-columns: 1fr !important; }
  .hg-product-row .hg-product-media { min-height: 220px !important; order: -1; }
}

@media (max-width: 600px) {
  .hg-bento-grid { grid-template-columns: 1fr !important; }
  .hg-about-stats { grid-template-columns: 1fr 1fr !important; }
  .hg-about-closing { grid-template-columns: 1fr !important; }
  .hg-about-closing > div { justify-content: flex-start !important; }
}
`;

/* ---------- small utility hook for scroll-reveal ---------- */
function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className={`hg-reveal ${inView ? "hg-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ---------- animated counter ---------- */
function Counter({ target, prefix = "", suffix = "", duration = 1600 }) {
  const [ref, inView] = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ---------- Day Arc signature SVG (hero) — unchanged design asset ---------- */
function DayArc() {
  return (
    <svg viewBox="0 0 480 260" width="100%" height="auto" role="img" aria-label="Illustrative production output curve rising and falling across a shift">
      <defs>
        <linearGradient id="arcFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ADB5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00ADB5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M20 220 Q 140 20 240 20 Q 340 20 460 220 L 460 240 L 20 240 Z" fill="url(#arcFill)" />
      <path d="M20 220 Q 140 20 240 20 Q 340 20 460 220" fill="none" stroke="#00ADB5" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="620" strokeDashoffset="620">
        <animate attributeName="stroke-dashoffset" from="620" to="0" dur="2.2s" fill="freeze" begin="0.2s" />
      </path>
      <circle r="7" fill="#FFFFFF" stroke="#00ADB5" strokeWidth="3">
        <animateMotion dur="6s" repeatCount="indefinite" path="M20 220 Q 140 20 240 20 Q 340 20 460 220" />
      </circle>
      {[0,1,2,3,4].map((i) => (
        <line key={i} x1={20 + i*110} y1="240" x2={20 + i*110} y2="230" stroke="#393E46" strokeWidth="2" opacity="0.5" />
      ))}
      <text x="20" y="256" fill="#393E46" fontSize="11" fontFamily="Inter, sans-serif">Shift start</text>
      <text x="205" y="256" fill="#393E46" fontSize="11" fontFamily="Inter, sans-serif">Mid-shift</text>
      <text x="415" y="256" fill="#393E46" fontSize="11" fontFamily="Inter, sans-serif">Shift end</text>
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function AurionSolarLanding() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [testiIdx, setTestiIdx] = useState(0);
  const [marketFilter, setMarketFilter] = useState("All");
  const [cookieVisible, setCookieVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setScrollPct(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowTop(scrollTop > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestiIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = useCallback((id) => {
    setMobileNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navItems = [
    { id: "why", label: "Capabilities" },
    { id: "services", label: "Products" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "projects", label: "Markets" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];

  return (
<div className="hg-root" style={{ position: "relative" }}>
        <style>{FONTS_CSS}</style>

      {/* Scroll progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${scrollPct}%`, background: "var(--color-accent)", zIndex: 60, transition: "width 0.1s linear" }} />

      {/* ---------------- NAVBAR ---------------- */}
<header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(34,40,49,0.08)" }}>        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={`${import.meta.env.BASE_URL}images/aurion-logov2.png`}
              alt="Aurion Solar"
              style={{ height: 40, width: "auto", display: "block", objectFit: "contain" }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, paddingLeft: 12, borderLeft: "1px solid rgba(34,40,49,0.15)" }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, color: "#5B6B78", textTransform: "uppercase" }}>Philippine</span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, color: "#5B6B78", textTransform: "uppercase" }}>Manufacturing Division</span>
            </div>
          </div>

<nav className="hg-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 30, marginLeft: "auto", marginRight: 24 }}>
            {navItems.map((n) => (
              <a key={n.id} className="hg-navlink" onClick={() => scrollTo(n.id)} style={{ cursor: "pointer" }}>{n.label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* <button className="hg-btn-outline hg-desktop-nav" onClick={() => scrollTo("contact")}>Request a Quote</button> */}
            <button
              onClick={() => setMobileNav((v) => !v)}
              style={{ display: "none", background: "none", border: "none" }}
              className="hg-mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div style={{ padding: "10px 24px 20px", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(34,40,49,0.08)" }}>
            {navItems.map((n) => (
              <a key={n.id} onClick={() => scrollTo(n.id)} style={{ fontWeight: 500, cursor: "pointer" }}>{n.label}</a>
            ))}
            <button className="hg-btn-glass" onClick={() => scrollTo("contact")}>Request a Quote <ArrowRight size={16} /></button>
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
<section
  style={{
    position: "relative",
    backgroundImage: `linear-gradient(206deg, rgba(15, 18, 22, 15%) 0%, rgba(34, 40, 49, 25%) 45%, rgba(32, 33, 33, 0.81) 100%), url(${import.meta.env.BASE_URL}images/bg.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
  }}
>        <svg style={{ position: "absolute", bottom: -2, left: 0, width: "160%" }} className="hg-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="rgba(255,255,255,0.06)" d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z" />
        </svg>
        {/* <div className="hg-float" style={{ position: "absolute", top: 90, right: "8%", opacity: 0.25 }}><Sun size={70} color="#fff" /></div>
        <div className="hg-float" style={{ position: "absolute", bottom: 140, left: "4%", opacity: 0.18, animationDelay: "1.2s" }}><Zap size={54} color="#fff" /></div>
        <div className="hg-float" style={{ position: "absolute", top: 220, left: "20%", opacity: 0.15, animationDelay: "2s" }}><Factory size={40} color="#fff" /></div> */}

        <div className="hg-hero-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "65px 24px 90px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 36, alignItems: "center", position: "relative", zIndex: 2 }}>
          <div>
            <div className="hg-glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", marginBottom: 24, color: "#fff", fontSize: 13, fontWeight: 500 }}>
              <ShieldCheck size={15} color="var(--color-accent)" /> PEZA-registered, export-oriented enterprise
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 4.4vw, 52px)", lineHeight: 1.12, fontWeight: 700, marginBottom: 22 }}>
              Manufacturing the Cells Inside Tomorrow's Solar Panels
            </h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15.5, maxWidth: 480, marginBottom: 26 }}>
              Philippine Aurion Solar Technologies Inc. is a Batangas-based manufacturer and global supplier of high-efficiency N-Type bifacial solar cells — built for module makers who sell into Europe, the US, and beyond.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="hg-btn-glass" onClick={() => scrollTo("contact")}>Request a Quote <ArrowRight size={16} /></button>
              
              {/* <button className="hg-btn-secondary" onClick={() => scrollTo("services")}>View Cell Datasheets</button> */}
            </div>

          </div>


        </div>
      </section>

      {/* ---------------- WHY CHOOSE US / CAPABILITIES ---------------- */}
      <section id="why" style={{ padding: "36px 24px 40px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Why manufacturers source cells from Aurion Solar PH</h2>
            <p style={{ color: "#5B6B78", fontSize: 15.5 }}>We don't sell rooftop panels — we supply the cells that go inside them. Every batch is built to the tolerances module manufacturers actually specify.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, alignItems: "stretch" }} className="hg-bento-grid">
          {[
            [ShieldCheck, "N-Type Bifacial Technology", "Low-LID cell architecture with <3% cell-to-module loss, tuned for high-efficiency module lines.", true],
            [PackageCheck, "PEZA Export Registration", "Zero-tariff raw material imports and exports, with full compliance documentation per shipment.", false],
            [Boxes, "Strategic Sourcing Location", "Close to upstream polysilicon, silver paste, and glass supply out of China, South Korea, and Japan.", false],
            [Globe2, "Compliant-Export Manufacturing", "Not currently subject to US AD/CVD photovoltaic investigations — a cleaner export path than several neighbors.", false],
            [FlaskConical, "Reliability Testing", "Anti-PID and attenuation testing on every production run before packaging and clearance.", false],
          ].map(([Icon, title, desc, featured], i) => (
            <Reveal key={title} delay={i * 60} className="hg-stretch" style={{ gridColumn: featured ? "span 2" : "span 1" }}>
              {featured ? (
                <div style={{
                  height: "100%", minHeight: 128, display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden",
                  background: "linear-gradient(135deg, var(--color-primary), #14181D)",
                  boxShadow: "0 10px 24px rgba(34,40,49,0.2)",
                }}>
                  <span className="hg-chip-accent" style={{ position: "absolute", top: 14, right: 18, padding: "4px 10px", fontSize: 10, background: "rgba(0,173,181,0.2)", color: "#fff", border: "1px solid rgba(0,173,181,0.4)" }}>Flagship platform</span>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon size={19} color="#fff" />
                  </div>
                  <h3 style={{ color: "#fff", fontSize: 15, marginBottom: 4, maxWidth: 360 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", maxWidth: 400 }}>{desc}</p>
                </div>
              ) : (
                <div className="hg-card" style={{ height: "100%", minHeight: 128, display: "flex", flexDirection: "column", padding: "18px 18px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,173,181,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, flexShrink: 0 }}>
                    <Icon size={17} color="var(--color-accent)" />
                  </div>
                  <h3 style={{ fontSize: 15, marginBottom: 5 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#5B6B78", flexGrow: 1 }}>{desc}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCTS & SERVICES ---------------- */}
      <section id="services" style={{ padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>Our cell products &amp; services</h2>
              <p style={{ color: "#5B6B78", fontSize: 15.5 }}>Two platforms, one export-grade standard — plus the testing, clearance, and logistics that get every batch to your line.</p>
            </div>
          </Reveal>
          {/* Featured platforms — staggered, alternating rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              [Factory, "N-Type-183-16BB-Bifacial", "Our 16BB bifacial platform built for high-efficiency module lines, with <3% cell-to-module loss.", "linear-gradient(135deg, var(--color-primary), #14181D)", "rgba(34,40,49,0.55)"],
              [Layers, "N-Type-210R-16BB-Bifacial", "A large-format 210R bifacial platform for higher-output module designs.", "linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))", "rgba(0,147,154,0.5)"],
              [Wrench, "Custom OEM Configuration", "Busbar count, wafer size, and packaging adjusted for qualified OEM orders.", "linear-gradient(135deg, #2A2F38, #393E46)", "rgba(34,40,49,0.55)"],
            ].map(([Icon, title, desc, panelBg, tint], i) => (
              <Reveal key={title} delay={i * 60}>
                <div
                  className="hg-product-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: i % 2 === 0 ? "1.1fr 0.9fr" : "0.9fr 1.1fr",
                    borderRadius: 16, overflow: "hidden", minHeight: 128,
                    boxShadow: "0 8px 20px rgba(34,40,49,0.10)",
                  }}
                >
                  <div style={{
                    order: i % 2 === 0 ? 0 : 1,
                    background: panelBg, padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>0{i + 1}</span>
                    <h3 style={{ color: "#fff", fontSize: 15, marginBottom: 4, maxWidth: 340 }}>{title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, maxWidth: 360, marginBottom: 10 }}>{desc}</p>
                    <a
                      onClick={() => scrollTo("contact")}
                      style={{
                        cursor: "pointer", width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
                      }}
                      aria-label="Request datasheet"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <div className="hg-product-media" style={{ order: i % 2 === 0 ? 1 : 0, position: "relative", minHeight: 128 }}>
                    <img
                      src={`${import.meta.env.BASE_URL}images/ntype183.png`}
                      alt={title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                    <div style={{ position: "absolute", inset: 0, background: tint }} />
                    <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} color="#fff" />
                      </div>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Request datasheet for full specs</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Supporting services — compact grid */}
          <Reveal>
            <h3 style={{ fontSize: 16, marginBottom: 12, color: "var(--color-primary)" }}>End-to-end support with every shipment</h3>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              [FlaskConical, "Reliability & Attenuation Testing", "LID, CTM loss, and Anti-PID testing performed on every production batch."],
              [FileCheck2, "PEZA Export Clearance", "Zero-tariff customs clearance processed under PEZA export-enterprise status."],
              [Ship, "Global Shipping & Logistics", "Ocean freight routed to partner ports across Europe, North America, and beyond."],
              [ClipboardList, "Post-Shipment Technical Support", "Technical liaison for module-line integration questions after every shipment."],
            ].map(([Icon, title, desc], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="hg-card" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 128 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,173,181,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon size={17} color="var(--color-accent)" />
                  </div>
                  <h3 style={{ fontSize: 15, marginBottom: 5 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#5B6B78", flexGrow: 1 }}>{desc}</p>
                  <a className="hg-navlink" style={{ marginTop: 10, color: "var(--color-accent)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => scrollTo("contact")}>
                    Request datasheet <ArrowUpRight size={12} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT + STATS ---------------- */}
      <section id="about" style={{ padding: "40px 24px", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 40, alignItems: "start" }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <span className="hg-chip-accent" style={{ width: "fit-content" }}>About Aurion Solar PH</span>
            <h2 style={{ fontSize: 24, margin: "8px 0 12px" }}>An export engine for the Aurion Solar group</h2>
            <p style={{ color: "#5B6B78", fontSize: 15.5, marginBottom: 24 }}>
              Philippine Aurion Solar Technologies Inc. was established through direct investment from GBFNEW POWER GROUP INC. as a PEZA-registered, export-oriented manufacturer of photovoltaic cells. Operating from the FPIP Industrial Park in Santo Tomas, Batangas, the facility converts the Philippines' trade, logistics, and policy advantages into a reliable supply line for module manufacturers overseas.
            </p>

            <div className="hg-about-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 30 }}>
              <div style={{ background: "var(--white)", border: "1px solid rgba(34,40,49,0.08)", borderRadius: 16, padding: "18px 16px" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-display)" }}><Counter target={13} /></div>
                <div style={{ fontSize: 12, color: "#5B6B78", marginTop: 4 }}>Export markets served</div>
              </div>
              <div style={{ background: "var(--color-primary)", borderRadius: 16, padding: "18px 16px" }}>
                <Award size={20} color="var(--color-accent)" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>PEZA-Registered, Export-Oriented Enterprise</div>
              </div>
            </div>

            <a
              onClick={() => scrollTo("process")}
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, marginTop: "auto" }}
            >
              <span style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ArrowUpRight size={16} color="var(--color-primary)" />
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>See how a batch moves from wafer to warehouse</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", marginBottom: 24 }}>
              <img src={`${import.meta.env.BASE_URL}images/about-aurion.png`} alt="Aurion Solar Philippines manufacturing facility, FPIP Industrial Park, Santo Tomas, Batangas" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} loading="lazy" />
              <div style={{ position: "absolute", bottom: 18, left: 18, background: "#fff", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 30px rgba(34,40,49,0.18)" }}>
                <Award size={26} color="var(--color-accent)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-primary)" }}>PEZA-Registered Enterprise</div>
                  <div style={{ fontSize: 12, color: "#5B6B78" }}>Export-Oriented Manufacturer</div>
                </div>
              </div>
            </div>
            <div className="hg-about-closing" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
              <p style={{ color: "#5B6B78", fontSize: 15.5, margin: 0 }}>
                Our mandate is twofold: deliver stable, export-grade solar cells to Europe and the United States, and contribute to the Philippines' own industrial and export development in the process.
              </p>
              {/* <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                <PhoneCall size={16} color="var(--color-accent)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>+63 123 456 7891</span>
              </div> */}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- BENEFITS / PHILIPPINES ADVANTAGE ---------------- */}
      <section style={{ padding: "40px 24px", background: "linear-gradient(135deg, var(--color-primary), #14181D)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
              <h2 style={{ fontSize: 24, color: "#fff", marginBottom: 8 }}>The Philippines advantage, by the numbers</h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15.5 }}>Four structural reasons a Batangas manufacturing base gives our export customers an edge.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              [ShieldCheck, "Political stability & pro-US trade footing", "A long-standing US ally under the US–Philippines Mutual Defense Treaty, positioned to benefit from future \"friendly country\" trade preferences."],
              [Ship, "Proximity to upstream PV materials", "Short supply lines to polysilicon, silver paste, and glass from China, South Korea, and Japan, with reasonable ocean freight to the US West Coast."],
              [Globe2, "Outside current AD/CVD sanctions", "Unlike Vietnam, Thailand, Malaysia, Cambodia, India, Indonesia, and Laos, the Philippines is not currently subject to US AD/CVD PV investigations."],
              [Award, "PEZA tax & tariff incentives", "100% corporate income tax exemption for 4–6 years, zero-tariff raw material imports and exports, and unrestricted profit remittance."],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="hg-glass" style={{ padding: 18, minHeight: 128, display: "flex", flexDirection: "column" }}>
                <Icon size={19} color="#222831" style={{ marginBottom: 8 }} />
                <h3 style={{ color: "#fff", fontSize: 15, marginBottom: 5 }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, flexGrow: 1 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MANUFACTURING & EXPORT PROCESS ---------------- */}
      <section id="process" style={{ padding: "40px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>From wafer to warehouse</h2>
            <p style={{ color: "#5B6B78", fontSize: 15.5 }}>A single, auditable production line from sourced raw material to cleared export shipment.</p>
          </div>
        </Reveal>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 27, top: 0, bottom: 0, width: 2, background: "rgba(0,173,181,0.2)" }} className="hg-timeline-line" />
          {[
            [Layers, "Raw Material Sourcing", "Polysilicon, silver paste, and glass sourced from regional partners in China, South Korea, and Japan."],
            [Factory, "N-Type Cell Fabrication", "Bifacial cell production with 16BB busbar architecture across the 183 and 210R platforms."],
            [FlaskConical, "Reliability & Attenuation Testing", "LID, CTM loss, and Anti-PID testing performed on every production batch."],
            [PackageCheck, "Packaging & Batch Documentation", "Export-grade packaging paired with full batch traceability and test reports."],
            [FileCheck2, "PEZA Export Clearance", "Zero-tariff customs clearance processed under PEZA export-enterprise status."],
            [Ship, "Global Shipping", "Ocean freight routed to partner ports across Europe, North America, and beyond."],
            [Wrench, "Technical Support", "Post-shipment technical liaison for module-line integration questions."],
          ].map(([Icon, title, desc], i) => (
            <Reveal key={title} delay={i * 60}>
              <div style={{ display: "flex", gap: 18, marginBottom: 22, position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--white)", border: "2px solid var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                  <Icon size={22} color="var(--color-primary)" />
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div className="hg-chip-accent" style={{ marginBottom: 6, padding: "3px 10px", fontSize: 10 }}>Step {i + 1}</div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#5B6B78" }}>{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- GLOBAL EXPORT MARKETS ---------------- */}
      <section id="projects" style={{ padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 16px" }}>
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>Where our cells go</h2>
              <p style={{ color: "#5B6B78", fontSize: 15.5 }}>Aurion Solar's group footprint spans 13 markets. Our Batangas line ships into this same network.</p>
            </div>
          </Reveal>
          {/* <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {["All", "Europe", "Americas", "Asia-Pacific" ].map((f) => (
              <button
                key={f}
                onClick={() => setMarketFilter(f)}
                style={{
                  padding: "8px 18px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
                  border: "1.5px solid var(--color-accent)",
                  background: marketFilter === f ? "var(--color-accent)" : "transparent",
                  color: marketFilter === f ? "#fff" : "var(--color-accent)",
                  transition: "all 0.2s ease",
                }}
              >
                {f}
              </button>
            ))}
          </div> */}
          <div style={{ background: "var(--color-bg)", borderRadius: 24, padding: "28px", display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 24, alignItems: "center" }} className="hg-product-row">
            <Reveal>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-display)" }}><Counter target={13} suffix=" markets" /></div>
                <p style={{ color: "#5B6B78", fontSize: 13, marginTop: 8 }}>Across three continents, with the Batangas line shipping into the same distribution network.</p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              {markets.map((m, i) => (
                <Reveal key={m.country} delay={i * 40}>
                  <div className="hg-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{m.country}</div>
                      <div style={{ fontSize: 12, color: "#5B6B78" }}>{m.region} export market</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS / PARTNER VOICES ----------------
      <section style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontSize: 30, marginBottom: 46 }}>What module manufacturers say</h2>
        </Reveal>
        <Reveal>
          <div className="hg-card" style={{ padding: "40px 36px" }}>
            <Quote size={30} color="var(--color-accent)" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 17, marginBottom: 22, color: "var(--color-text)" }}>{testimonials[testiIdx].text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="#222831" color="#222831" />)}
            </div>
            <div style={{ fontWeight: 600 }}>{testimonials[testiIdx].name}</div>
            <div style={{ fontSize: 13, color: "#5B6B78" }}>{testimonials[testiIdx].role}</div>
          </div>
        </Reveal>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 22 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setTestiIdx(i)} aria-label={`Testimonial ${i + 1}`}
              style={{ width: 8, height: 8, borderRadius: "50%", border: "none", background: i === testiIdx ? "var(--color-accent)" : "rgba(0,173,181,0.25)" }} />
          ))}
        </div>
      </section> */}

      {/* ---------------- CERTIFICATIONS ---------------- */}
      <section style={{ padding: "40px 24px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#5B6B78", letterSpacing: 0.6, marginBottom: 24 }}>REGISTERED, BACKED, AND VERIFIABLE</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, opacity: 0.7 }}>
            {["PEZA Registered Enterprise", "GBFNEW POWER GROUP INC.", "IEC 61215 (placeholder)", "IEC 61730 (placeholder)", "ISO 9001 (placeholder)"].map((n) => (
              <span key={n} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--color-primary)" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" style={{ padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Sourcing FAQ</h2>
            <p style={{ color: "#5B6B78", fontSize: 15.5 }}>Questions from buyers and module manufacturers. Still have one after this? Reach out — see the contact section below.</p>
          </div>
        </Reveal>
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 40}>
            <div className="hg-card" style={{ marginBottom: 14, padding: "0 24px", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{f.q}</span>
                {openFaq === i ? <ChevronUp size={18} color="var(--color-accent)" /> : <ChevronDown size={18} color="var(--color-accent)" />}
              </div>
              <div className="hg-accordion-panel" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                <p style={{ fontSize: 14, color: "#5B6B78", paddingBottom: 20 }}>{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section style={{ padding: "50px 24px", position: "relative", overflow: "hidden", background: "linear-gradient(120deg, var(--color-accent-dark), var(--color-accent))", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,40,49,0.25) 0%, rgba(34,40,49,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-35%", left: "-8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,40,49,0.18) 0%, rgba(34,40,49,0) 70%)", pointerEvents: "none" }} />
        <Reveal style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>Looking for a reliable solar cell supply partner?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15.5, marginBottom: 26, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Tell us your target volume, cell platform, and shipping destination — we'll get back with lead time and pricing.
          </p>
          <button className="hg-btn-secondary" style={{ background: "#fff", color: "var(--color-accent-dark)", borderColor: "#fff" }} onClick={() => scrollTo("contact")}>
            Request a Quote / Partnership Inquiry <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" style={{ padding: "40px 24px", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        <Reveal>
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Request a quote</h2>
            <p style={{ color: "#5B6B78", fontSize: 15.5, marginBottom: 24 }}>For sourcing inquiries, datasheets, or partnership discussions — reach the Batangas team directly.</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="hg-input" placeholder="Company name" />
              <input className="hg-input" placeholder="Contact person" />
              <input className="hg-input" placeholder="Business email" type="email" />
              <input className="hg-input" placeholder="Phone / Viber" type="tel" />
              <textarea className="hg-input" placeholder="Tell us about your module line and destination market" rows={4} />
              <button className="hg-btn-primary" style={{ justifyContent: "center" }} type="submit">Send Inquiry <ArrowRight size={16} /></button>
            </form>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
<div style={{ borderRadius: 18, overflow: "hidden", height: 170, marginBottom: 18 }}>
  <iframe
    title="Aurion Solar Location"
    src="https://www.google.com/maps?q=Philippine+Aurion+Solar,14.135663,121.1309939&z=17&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                [PhoneCall, "+63 123 456 7891"],
                [Mail, "dev@aurionsolar.com"],
                [MapPin, "Industrial Building Lot 16 & 17, FPIP Industrial Park I, Santo Anastacia, Santo Tomas, Batangas, 4234, Philippines"],
                [Clock, "Mon–Fri, 8:00 AM – 5:00 PM (PHT)"],
              ].map(([Icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,173,181,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} color="var(--color-accent)" />
                  </div>
                  <span style={{ fontSize: 14 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ background: "var(--color-text)", color: "#D6DEE5", padding: "48px 24px 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={`${import.meta.env.BASE_URL}images/aurion-logov2.png`}
                  alt="Aurion Solar"
                  style={{ height: 26, width: "auto", display: "block", objectFit: "contain" }}
                />
              </div>
              <span style={{ fontSize: 11, color: "#9FADB8", maxWidth: 100, lineHeight: 1.3 }}>Philippine Manufacturing Division</span>
            </div>
            <p style={{ fontSize: 13, color: "#9FADB8", maxWidth: 260 }}>A PEZA-registered manufacturer and supplier of N-Type bifacial solar cells, based in Santo Tomas, Batangas.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Navigate</h4>
            {navItems.map((n) => <div key={n.id} style={{ marginBottom: 10 }}><a onClick={() => scrollTo(n.id)} style={{ fontSize: 13, color: "#9FADB8", cursor: "pointer" }}>{n.label}</a></div>)}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Products</h4>
            {["N-Type-183-16BB-Bifacial", "N-Type-210R-16BB-Bifacial", "Manufacturing Process"].map((s) => (
              <div key={s} style={{ marginBottom: 10, fontSize: 13, color: "#9FADB8" }}>{s}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Stay updated</h4>
            <p style={{ fontSize: 13, color: "#9FADB8", marginBottom: 12 }}>Cell tech notes and export updates, monthly.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Email address" style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.5)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 13 }} />
              <button className="hg-btn-primary" style={{ padding: "10px 14px" }}><ArrowRight size={15} /></button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#7E8C97" }}>
          <span>© 2026 Philippine Aurion Solar Technologies Inc. — a GBFNEW POWER GROUP INC. company.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <span>Privacy Policy</span><span>Terms & Conditions</span>
          </div>
        </div>
      </footer>

      {/* ---------------- FLOATING QUOTE BUTTON + BACK TO TOP ---------------- */}
      {/* <button
        onClick={() => scrollTo("contact")}
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 55, background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 999, padding: "14px 20px", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 26px rgba(0,173,181,0.4)" }}
      >
        <Zap size={15} /> Request a Quote
      </button> */}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{ position: "fixed", bottom: 28, left: 28, zIndex: 55, width: 44, height: 44, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(34,40,49,0.35)" }}
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ---------------- COOKIE CONSENT ---------------- */}

    </div>
  );
}

/* ---------- content data (sourced from AurionSolarLanding.jsx) ---------- */
const testimonials = [
  { text: "Cell-to-module loss came in under spec on every batch we've run so far. That consistency is what we plan our lines around.", name: "Module Line Manager", role: "EU-based PV Manufacturer" },
  { text: "The PEZA export paperwork was clean from the first shipment. Fewer surprises at customs on our end.", name: "Procurement Lead", role: "North American Distributor" },
  { text: "Anti-PID numbers held up in our own bench tests, which isn't always the case with new cell suppliers.", name: "Quality Engineer", role: "EPC & Module Assembler" },
];

const faqs = [
  { q: "What is your minimum order quantity for cells?", a: "MOQ varies by cell platform and current production allocation. Share your target volume through the quote form and our team will confirm availability." },
  { q: "Can cells be customized for our module line?", a: "Busbar count, wafer size, and packaging can be adjusted for qualified OEM orders, subject to minimum volumes and lead-time review." },
  { q: "What test reports come with each shipment?", a: "Every batch ships with LID, CTM loss, and Anti-PID test documentation alongside standard export paperwork." },
  { q: "Which Incoterms do you support?", a: "FOB and CIF are standard for most export lanes; other terms can be discussed for larger or recurring orders." },
  { q: "Are your exports affected by US AD/CVD measures?", a: "The Philippines is not currently on the list of countries subject to US AD/CVD photovoltaic investigations, unlike several neighboring manufacturing hubs." },
];

/* Aurion Solar's group footprint (13 markets), grouped into regions to
   drive the filter control carried over from the Helios Grid design. */
const markets = [
  { country: "Germany", region: "Europe" },
  { country: "United States", region: "Americas" },
  { country: "Vietnam", region: "Asia-Pacific" },
  { country: "Thailand", region: "Asia-Pacific" },
];