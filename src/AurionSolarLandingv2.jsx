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

/* ---------------------------------------------------------
   Aurion Solar PH — Landing Page
   DESIGN SOURCE: Helios Grid (design tokens, layout, motion,
   component structure preserved as-is). Only content/data
   below has been swapped for Philippine Aurion Solar
   Technologies Inc. — a B2B PV cell manufacturer.
   Design tokens (unchanged from Helios Grid): deep blue #0F4C81,
   sky blue #4A90E2, white, light gray #F5F7FA, dark gray #2F3A45,
   green accent #3CB371.
   Signature element: the "Day Arc" — unchanged animated curve,
   relabeled to represent production output rather than solar
   irradiance, since the visual asset itself is a design element.
--------------------------------------------------------- */

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --blue-deep: #0F4C81;
  --blue-sky: #4A90E2;
  --white: #FFFFFF;
  --gray-light: #F5F7FA;
  --gray-dark: #2F3A45;
  --green: #3CB371;
  --green-dark: #2E8B57;
  --font-display: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}

[data-theme="dark"] {
  --white: #16202B;
  --gray-light: #1C2833;
  --gray-dark: #E7ECF1;
}

.hg-root { font-family: var(--font-body); color: var(--gray-dark); background: var(--gray-light); }
.hg-root h1, .hg-root h2, .hg-root h3, .hg-root h4 { font-family: var(--font-display); color: var(--blue-deep); margin: 0; }
[data-theme="dark"] .hg-root h1, [data-theme="dark"] .hg-root h2, [data-theme="dark"] .hg-root h3, [data-theme="dark"] .hg-root h4 { color: #EAF2FA; }
.hg-root p { line-height: 1.7; }
.hg-root * { box-sizing: border-box; }
.hg-root a { text-decoration: none; color: inherit; }
.hg-root button { font-family: var(--font-body); cursor: pointer; }

.hg-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.hg-reveal.hg-in { opacity: 1; transform: translateY(0); }

.hg-btn-primary {
  background: var(--green); color: #fff; border: none; padding: 14px 28px;
  border-radius: 999px; font-weight: 600; font-size: 15px; display: inline-flex;
  align-items: center; gap: 8px; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  box-shadow: 0 8px 24px rgba(60,179,113,0.28);
}
.hg-btn-primary:hover { transform: translateY(-2px); background: var(--green-dark); box-shadow: 0 12px 30px rgba(60,179,113,0.38); }

.hg-btn-secondary {
  background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.6); padding: 13px 26px;
  border-radius: 999px; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.hg-btn-secondary:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

.hg-btn-outline {
  background: transparent; color: var(--blue-deep); border: 1.5px solid var(--blue-deep); padding: 10px 20px;
  border-radius: 999px; font-weight: 600; font-size: 13.5px; display: inline-flex; align-items: center; gap: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}
.hg-btn-outline:hover { background: var(--blue-deep); color: #fff; }
[data-theme="dark"] .hg-btn-outline { color: #EAF2FA; border-color: #EAF2FA; }
[data-theme="dark"] .hg-btn-outline:hover { background: #EAF2FA; color: var(--blue-deep); }

.hg-card {
  background: var(--white); border-radius: 18px; padding: 28px 24px;
  box-shadow: 0 2px 8px rgba(15,76,129,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(15,76,129,0.06);
}
.hg-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(15,76,129,0.12); }

.hg-glass {
  background: rgba(255,255,255,0.10); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.22); border-radius: 18px;
}

.hg-navlink { position: relative; font-weight: 500; font-size: 14.5px; padding: 6px 2px; }
.hg-navlink::after { content: ""; position: absolute; left: 0; bottom: -2px; height: 2px; width: 0; background: var(--green); transition: width 0.25s ease; }
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
  width: 100%; padding: 13px 16px; border-radius: 12px; border: 1.5px solid rgba(15,76,129,0.15);
  background: var(--gray-light); font-family: var(--font-body); font-size: 14.5px; color: var(--gray-dark);
  transition: border-color 0.2s ease;
}
.hg-input:focus { outline: none; border-color: var(--blue-sky); }

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

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className={`hg-reveal ${inView ? "hg-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
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
          <stop offset="0%" stopColor="#3CB371" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3CB371" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M20 220 Q 140 20 240 20 Q 340 20 460 220 L 460 240 L 20 240 Z" fill="url(#arcFill)" />
      <path d="M20 220 Q 140 20 240 20 Q 340 20 460 220" fill="none" stroke="#3CB371" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="620" strokeDashoffset="620">
        <animate attributeName="stroke-dashoffset" from="620" to="0" dur="2.2s" fill="freeze" begin="0.2s" />
      </path>
      <circle r="7" fill="#FFFFFF" stroke="#3CB371" strokeWidth="3">
        <animateMotion dur="6s" repeatCount="indefinite" path="M20 220 Q 140 20 240 20 Q 340 20 460 220" />
      </circle>
      {[0,1,2,3,4].map((i) => (
        <line key={i} x1={20 + i*110} y1="240" x2={20 + i*110} y2="230" stroke="#4A90E2" strokeWidth="2" opacity="0.5" />
      ))}
      <text x="20" y="256" fill="#4A90E2" fontSize="11" fontFamily="Inter, sans-serif">Shift start</text>
      <text x="205" y="256" fill="#4A90E2" fontSize="11" fontFamily="Inter, sans-serif">Mid-shift</text>
      <text x="415" y="256" fill="#4A90E2" fontSize="11" fontFamily="Inter, sans-serif">Shift end</text>
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function AurionSolarLanding() {
  const [dark, setDark] = useState(false);
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
    <div className="hg-root" data-theme={dark ? "dark" : "light"} style={{ position: "relative", overflowX: "hidden" }}>
      <style>{FONTS_CSS}</style>

      {/* Scroll progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${scrollPct}%`, background: "var(--green)", zIndex: 60, transition: "width 0.1s linear" }} />

      {/* ---------------- NAVBAR ---------------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: dark ? "rgba(22,32,43,0.85)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(15,76,129,0.08)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={`${import.meta.env.BASE_URL}images/aurion-logo.png`}
              alt="Aurion Solar"
              style={{ height: 40, width: "auto", display: "block", objectFit: "contain" }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, paddingLeft: 12, borderLeft: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(15,76,129,0.15)" }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, color: dark ? "#8FA3B5" : "#5B6B78", textTransform: "uppercase" }}>Philippine</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, color: dark ? "#8FA3B5" : "#5B6B78", textTransform: "uppercase" }}>Manufacturing Division</span>
            </div>
          </div>

          <nav className="hg-desktop-nav" style={{ display: "flex", gap: 30 }}>
            {navItems.map((n) => (
              <a key={n.id} className="hg-navlink" onClick={() => scrollTo(n.id)} style={{ cursor: "pointer" }}>{n.label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
              style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(15,76,129,0.15)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {dark ? <Sun size={16} color="#EAF2FA" /> : <Sun size={16} color="var(--blue-deep)" />}
            </button>
            <button className="hg-btn-outline hg-desktop-nav" onClick={() => scrollTo("contact")}>Request a Quote</button>
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
          <div style={{ padding: "10px 24px 20px", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(15,76,129,0.08)" }}>
            {navItems.map((n) => (
              <a key={n.id} onClick={() => scrollTo(n.id)} style={{ fontWeight: 500, cursor: "pointer" }}>{n.label}</a>
            ))}
            <button className="hg-btn-primary" style={{ justifyContent: "center" }} onClick={() => scrollTo("contact")}>Request a Quote</button>
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section style={{ position: "relative", background: "linear-gradient(135deg, #0B3A63 0%, var(--blue-deep) 45%, var(--blue-sky) 100%)", overflow: "hidden" }}>
        <svg style={{ position: "absolute", bottom: -2, left: 0, width: "160%" }} className="hg-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="rgba(255,255,255,0.06)" d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z" />
        </svg>
        <div className="hg-float" style={{ position: "absolute", top: 90, right: "8%", opacity: 0.25 }}><Sun size={70} color="#fff" /></div>
        <div className="hg-float" style={{ position: "absolute", bottom: 140, left: "4%", opacity: 0.18, animationDelay: "1.2s" }}><Zap size={54} color="#fff" /></div>
        <div className="hg-float" style={{ position: "absolute", top: 220, left: "20%", opacity: 0.15, animationDelay: "2s" }}><Factory size={40} color="#fff" /></div>

        <div className="hg-hero-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 115px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "center", position: "relative", zIndex: 2 }}>
          <div>
            <div className="hg-glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", marginBottom: 24, color: "#fff", fontSize: 13, fontWeight: 500 }}>
              <ShieldCheck size={15} /> PEZA-registered, export-oriented enterprise
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 4.4vw, 52px)", lineHeight: 1.12, fontWeight: 700, marginBottom: 22 }}>
              Manufacturing the Cells Inside Tomorrow's Solar Panels
            </h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 17, maxWidth: 480, marginBottom: 34 }}>
              Philippine Aurion Solar Technologies Inc. is a Batangas-based manufacturer and global supplier of high-efficiency N-Type bifacial solar cells — built for module makers who sell into Europe, the US, and beyond.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="hg-btn-primary" onClick={() => scrollTo("contact")}>Request a Quote <ArrowRight size={16} /></button>
              <button className="hg-btn-secondary" onClick={() => scrollTo("services")}>View Cell Datasheets</button>
            </div>

          </div>

          <div className="hg-hero-arc hg-glass" style={{ padding: "26px 22px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Production output trend</span>
              <span className="hg-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#3CB371", display: "inline-block" }} />
            </div>
            <DayArc />
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US / CAPABILITIES ---------------- */}
      <section id="why" style={{ padding: "100px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>Why manufacturers source cells from Aurion Solar PH</h2>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78" }}>We don't sell rooftop panels — we supply the cells that go inside them. Every batch is built to the tolerances module manufacturers actually specify.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22, alignItems: "stretch" }}>
          {[
            [ShieldCheck, "N-Type Bifacial Technology", "Low-LID cell architecture with <3% cell-to-module loss, tuned for high-efficiency module lines."],
            [PackageCheck, "PEZA Export Registration", "Zero-tariff raw material imports and exports, with full compliance documentation per shipment."],
            [Boxes, "Strategic Sourcing Location", "Close to upstream polysilicon, silver paste, and glass supply out of China, South Korea, and Japan."],
            [Globe2, "Compliant-Export Manufacturing", "Not currently subject to US AD/CVD photovoltaic investigations — a cleaner export path than several neighbors."],
            [FlaskConical, "Reliability Testing", "Anti-PID and attenuation testing on every production run before packaging and clearance."],
            [Factory, "Backed by GBFNEW POWER GROUP", "Established through direct investment from GBFNEW POWER GROUP INC., sharing group manufacturing standards."],
          ].map(([Icon, title, desc], i) => (
            <Reveal key={title} delay={i * 80} className="hg-stretch">
              <div className="hg-card" style={{ height: "100%", minHeight: 240, display: "flex", flexDirection: "column" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(74,144,226,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, flexShrink: 0 }}>
                  <Icon size={24} color="var(--blue-sky)" />
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14.5, color: dark ? "#B7C4D0" : "#5B6B78", flexGrow: 1 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCTS & SERVICES ---------------- */}
      <section id="services" style={{ padding: "100px 24px", background: dark ? "#131C25" : "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
              <h2 style={{ fontSize: 30, marginBottom: 14 }}>Our cell products &amp; services</h2>
              <p style={{ color: dark ? "#B7C4D0" : "#5B6B78" }}>Two platforms, one export-grade standard — plus the testing, clearance, and logistics that get every batch to your line.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22 }}>
            {[
              [Factory, "N-Type-183-16BB-Bifacial", "Our 16BB bifacial platform built for high-efficiency module lines, with <3% cell-to-module loss."],
              [Layers, "N-Type-210R-16BB-Bifacial", "A large-format 210R bifacial platform for higher-output module designs."],
              [Wrench, "Custom OEM Configuration", "Busbar count, wafer size, and packaging adjusted for qualified OEM orders."],
              [FlaskConical, "Reliability & Attenuation Testing", "LID, CTM loss, and Anti-PID testing performed on every production batch."],
              [FileCheck2, "PEZA Export Clearance", "Zero-tariff customs clearance processed under PEZA export-enterprise status."],
              [Ship, "Global Shipping & Logistics", "Ocean freight routed to partner ports across Europe, North America, and beyond."],
              [ClipboardList, "Post-Shipment Technical Support", "Technical liaison for module-line integration questions after every shipment."],
            ].map(([Icon, title, desc], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="hg-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "linear-gradient(135deg, var(--blue-deep), var(--blue-sky))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={22} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 16.5, marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: dark ? "#B7C4D0" : "#5B6B78", flexGrow: 1 }}>{desc}</p>
                  <a className="hg-navlink" style={{ marginTop: 16, color: "var(--green)", fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => scrollTo("contact")}>
                    Request datasheet <ArrowUpRight size={14} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT + STATS ---------------- */}
      <section id="about" style={{ padding: "100px 24px", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <Reveal>
          <div>
            <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 13.5, letterSpacing: 0.4 }}>ABOUT AURION SOLAR PH</span>
            <h2 style={{ fontSize: 30, margin: "10px 0 18px" }}>An export engine for the Aurion Solar group</h2>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78", marginBottom: 14 }}>
              Philippine Aurion Solar Technologies Inc. was established through direct investment from GBFNEW POWER GROUP INC. as a PEZA-registered, export-oriented manufacturer of photovoltaic cells. Operating from the FPIP Industrial Park in Santo Tomas, Batangas, the facility converts the Philippines' trade, logistics, and policy advantages into a reliable supply line for module manufacturers overseas.
            </p>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78", marginBottom: 26 }}>
              Our mandate is twofold: deliver stable, export-grade solar cells to Europe and the United States, and contribute to the Philippines' own industrial and export development in the process.
            </p>

          </div>
        </Reveal>
        <Reveal delay={120}>
          <div style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}>
            {/* Placeholder image from AurionSolarLanding source — replace with a real facility photo when available */}
            <img src="https://picsum.photos/seed/aurion-facility/900/900" alt="Placeholder — Aurion Solar Philippines manufacturing facility, FPIP Industrial Park, Santo Tomas, Batangas" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} loading="lazy" />
            <div style={{ position: "absolute", bottom: 18, left: 18, background: "#fff", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 30px rgba(15,76,129,0.18)" }}>
              <Award size={26} color="var(--green)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--blue-deep)" }}>PEZA-Registered Enterprise</div>
                <div style={{ fontSize: 12, color: "#5B6B78" }}>Export-Oriented Manufacturer</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- BENEFITS / PHILIPPINES ADVANTAGE ---------------- */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, var(--blue-deep), #124a7d)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
              <h2 style={{ fontSize: 30, color: "#fff", marginBottom: 14 }}>The Philippines advantage, by the numbers</h2>
              <p style={{ color: "rgba(255,255,255,0.75)" }}>Four structural reasons a Batangas manufacturing base gives our export customers an edge.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              [ShieldCheck, "Political stability & pro-US trade footing", "A long-standing US ally under the US–Philippines Mutual Defense Treaty, positioned to benefit from future \"friendly country\" trade preferences."],
              [Ship, "Proximity to upstream PV materials", "Short supply lines to polysilicon, silver paste, and glass from China, South Korea, and Japan, with reasonable ocean freight to the US West Coast."],
              [Globe2, "Outside current AD/CVD sanctions", "Unlike Vietnam, Thailand, Malaysia, Cambodia, India, Indonesia, and Laos, the Philippines is not currently subject to US AD/CVD PV investigations."],
              [Award, "PEZA tax & tariff incentives", "100% corporate income tax exemption for 4–6 years, zero-tariff raw material imports and exports, and unrestricted profit remittance."],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="hg-glass" style={{ padding: 24 }}>
                <Icon size={26} color="#3CB371" style={{ marginBottom: 12 }} />
                <h3 style={{ color: "#fff", fontSize: 16, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MANUFACTURING & EXPORT PROCESS ---------------- */}
      <section id="process" style={{ padding: "100px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>From wafer to warehouse</h2>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78" }}>A single, auditable production line from sourced raw material to cleared export shipment.</p>
          </div>
        </Reveal>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 27, top: 0, bottom: 0, width: 2, background: "rgba(74,144,226,0.2)" }} className="hg-timeline-line" />
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
              <div style={{ display: "flex", gap: 22, marginBottom: 34, position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--white)", border: "2px solid var(--blue-sky)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                  <Icon size={22} color="var(--blue-deep)" />
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginBottom: 4 }}>STEP {i + 1}</div>
                  <h3 style={{ fontSize: 16.5, marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: dark ? "#B7C4D0" : "#5B6B78" }}>{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- GLOBAL EXPORT MARKETS ---------------- */}
      <section id="projects" style={{ padding: "100px 24px", background: dark ? "#131C25" : "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 30px" }}>
              <h2 style={{ fontSize: 30, marginBottom: 14 }}>Where our cells go</h2>
              <p style={{ color: dark ? "#B7C4D0" : "#5B6B78" }}>Aurion Solar's group footprint spans 13 markets. Our Batangas line ships into this same network.</p>
            </div>
          </Reveal>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {["All", "Europe", "Americas", "Asia-Pacific", "Middle East"].map((f) => (
              <button
                key={f}
                onClick={() => setMarketFilter(f)}
                style={{
                  padding: "8px 18px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
                  border: "1.5px solid var(--blue-sky)",
                  background: marketFilter === f ? "var(--blue-sky)" : "transparent",
                  color: marketFilter === f ? "#fff" : "var(--blue-sky)",
                  transition: "all 0.2s ease",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18 }}>
            {markets.filter((m) => marketFilter === "All" || m.region === marketFilter).map((m, i) => (
              <Reveal key={m.country} delay={i * 40}>
                <div className="hg-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 22px" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{m.country}</div>
                    <div style={{ fontSize: 12, color: dark ? "#B7C4D0" : "#5B6B78" }}>{m.region} export market</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS / PARTNER VOICES ----------------
      <section style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontSize: 30, marginBottom: 46 }}>What module manufacturers say</h2>
        </Reveal>
        <Reveal>
          <div className="hg-card" style={{ padding: "40px 36px" }}>
            <Quote size={30} color="var(--blue-sky)" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 17, marginBottom: 22, color: dark ? "#DDE6EE" : "var(--gray-dark)" }}>{testimonials[testiIdx].text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="#3CB371" color="#3CB371" />)}
            </div>
            <div style={{ fontWeight: 600 }}>{testimonials[testiIdx].name}</div>
            <div style={{ fontSize: 13, color: dark ? "#B7C4D0" : "#5B6B78" }}>{testimonials[testiIdx].role}</div>
          </div>
        </Reveal>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 22 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setTestiIdx(i)} aria-label={`Testimonial ${i + 1}`}
              style={{ width: 8, height: 8, borderRadius: "50%", border: "none", background: i === testiIdx ? "var(--green)" : "rgba(74,144,226,0.25)" }} />
          ))}
        </div>
      </section> */}

      {/* ---------------- CERTIFICATIONS ---------------- */}
      <section style={{ padding: "60px 24px", background: dark ? "#131C25" : "var(--gray-light)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: dark ? "#B7C4D0" : "#5B6B78", letterSpacing: 0.6, marginBottom: 28 }}>REGISTERED, BACKED, AND VERIFIABLE</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, opacity: 0.7 }}>
            {["PEZA Registered Enterprise", "GBFNEW POWER GROUP INC.", "IEC 61215 (placeholder)", "IEC 61730 (placeholder)", "ISO 9001 (placeholder)"].map((n) => (
              <span key={n} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: dark ? "#DDE6EE" : "var(--blue-deep)" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" style={{ padding: "100px 24px", background: dark ? "#131C25" : "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 46 }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>Sourcing FAQ</h2>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78" }}>Questions from buyers and module manufacturers. Still have one after this? Reach out — see the contact section below.</p>
          </div>
        </Reveal>
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 40}>
            <div className="hg-card" style={{ marginBottom: 14, padding: "0 24px", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{f.q}</span>
                {openFaq === i ? <ChevronUp size={18} color="var(--green)" /> : <ChevronDown size={18} color="var(--blue-sky)" />}
              </div>
              <div className="hg-accordion-panel" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                <p style={{ fontSize: 14, color: dark ? "#B7C4D0" : "#5B6B78", paddingBottom: 20 }}>{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(120deg, var(--green-dark), var(--green))", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 18 }}>Looking for a reliable solar cell supply partner?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 30, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Tell us your target volume, cell platform, and shipping destination — we'll get back with lead time and pricing.
          </p>
          <button className="hg-btn-secondary" style={{ background: "#fff", color: "var(--green-dark)", borderColor: "#fff" }} onClick={() => scrollTo("contact")}>
            Request a Quote / Partnership Inquiry <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" style={{ padding: "100px 24px", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50 }}>
        <Reveal>
          <div>
            <h2 style={{ fontSize: 28, marginBottom: 10 }}>Request a quote</h2>
            <p style={{ color: dark ? "#B7C4D0" : "#5B6B78", marginBottom: 28 }}>For sourcing inquiries, datasheets, or partnership discussions — reach the Batangas team directly.</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="hg-input" placeholder="Company name" />
              <input className="hg-input" placeholder="Contact person" />
              <input className="hg-input" placeholder="Business email" type="email" />
              <input className="hg-input" placeholder="Phone / WhatsApp" type="tel" />
              <textarea className="hg-input" placeholder="Tell us about your module line and destination market" rows={4} />
              <button className="hg-btn-primary" style={{ justifyContent: "center" }} type="submit">Send Inquiry <ArrowRight size={16} /></button>
            </form>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
            <div style={{ borderRadius: 18, overflow: "hidden", height: 220, marginBottom: 24, background: dark ? "#1C2833" : "var(--gray-light)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(74,144,226,0.4)" }}>
              <div style={{ textAlign: "center", color: dark ? "#B7C4D0" : "#5B6B78" }}>
                <MapPin size={26} color="var(--blue-sky)" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13 }}>Map placeholder — FPIP Industrial Park, Santo Tomas, Batangas</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                [PhoneCall, "+86 189-3005-5606"],
                [Mail, "johndow@aurionsolar.com"],
                [MapPin, "Industrial Building Lot 16 & 17, FPIP Industrial Park I, Santo Anastacia, Santo Tomas, Batangas, 4234, Philippines"],
                [Clock, "Mon–Fri, 8:00 AM – 5:00 PM (PHT)"],
              ].map(([Icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(74,144,226,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} color="var(--blue-sky)" />
                  </div>
                  <span style={{ fontSize: 14.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ background: "var(--gray-dark)", color: "#D6DEE5", padding: "70px 24px 30px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={`${import.meta.env.BASE_URL}images/aurion-logo.png`}
                  alt="Aurion Solar"
                  style={{ height: 26, width: "auto", display: "block", objectFit: "contain" }}
                />
              </div>
              <span style={{ fontSize: 10, color: "#9FADB8", maxWidth: 100, lineHeight: 1.3 }}>Philippine Manufacturing Division</span>
            </div>
            <p style={{ fontSize: 13.5, color: "#9FADB8", maxWidth: 260 }}>A PEZA-registered manufacturer and supplier of N-Type bifacial solar cells, based in Santo Tomas, Batangas.</p>
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
            {navItems.map((n) => <div key={n.id} style={{ marginBottom: 10 }}><a onClick={() => scrollTo(n.id)} style={{ fontSize: 13.5, color: "#9FADB8", cursor: "pointer" }}>{n.label}</a></div>)}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Products</h4>
            {["N-Type-183-16BB-Bifacial", "N-Type-210R-16BB-Bifacial", "Manufacturing Process"].map((s) => (
              <div key={s} style={{ marginBottom: 10, fontSize: 13.5, color: "#9FADB8" }}>{s}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Stay updated</h4>
            <p style={{ fontSize: 13, color: "#9FADB8", marginBottom: 12 }}>Cell tech notes and export updates, monthly.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Email address" style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 13 }} />
              <button className="hg-btn-primary" style={{ padding: "10px 14px" }}><ArrowRight size={15} /></button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12.5, color: "#7E8C97" }}>
          <span>© 2026 Philippine Aurion Solar Technologies Inc. — a GBFNEW POWER GROUP INC. company.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <span>Privacy Policy</span><span>Terms & Conditions</span>
          </div>
        </div>
      </footer>

      {/* ---------------- FLOATING QUOTE BUTTON + BACK TO TOP ---------------- */}
      <button
        onClick={() => scrollTo("contact")}
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 55, background: "var(--green)", color: "#fff", border: "none", borderRadius: 999, padding: "14px 20px", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 26px rgba(60,179,113,0.4)" }}
      >
        <Zap size={15} /> Request a Quote
      </button>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{ position: "fixed", bottom: 28, left: 28, zIndex: 55, width: 44, height: 44, borderRadius: "50%", background: "var(--blue-deep)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(15,76,129,0.35)" }}
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
  { country: "America", region: "North America" },
  { country: "Vietnam", region: "Southeast Asia" },
  { country: "Thailand", region: "Southeast Asia" },
];