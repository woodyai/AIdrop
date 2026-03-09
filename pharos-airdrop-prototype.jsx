import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════
const C = {
  bg: "#F4F5FA", bgCard: "#FFFFFF", bgPanel: "#FFFFFF",
  surface: "#ECEEF8", surfaceLight: "#E4E7F5",
  accent: "#4F46E5", accentDim: "#4338CA", accentMuted: "rgba(79,70,229,0.10)",
  purple: "#7C3AED", purpleMuted: "rgba(124,58,237,0.10)",
  orange: "#F59E0B", orangeMuted: "rgba(245,158,11,0.10)",
  pink: "#EC4899", blue: "#3B82F6", blueMuted: "rgba(59,130,246,0.10)",
  text: "#1F2937", dim: "#6B7280", muted: "#9CA3AF",
  border: "#E5E7EB", borderLight: "#F3F4F6",
  white: "#fff", black: "#000", success: "#22C55E",
};

const FONT = `'Outfit', 'DM Sans', -apple-system, sans-serif`;

// ═══════════════════════════════════════════
//  PERSONA DATA
// ═══════════════════════════════════════════
const PERSONAS = {
  "builder-btc-yes-steady": { name: "The Architect", icon: "🏗️", color: C.accent, desc: "Methodical. Patient. You build empires brick by brick.", tier: 3 },
  "builder-btc-yes-bold": { name: "The Visionary", icon: "🔮", color: C.purple, desc: "You see what others can't. Future-proof and fearless.", tier: 3 },
  "builder-btc-no-steady": { name: "The Sentinel", icon: "🛡️", color: C.blue, desc: "Grounded in reality. You protect what matters.", tier: 2 },
  "builder-btc-no-bold": { name: "The Pioneer", icon: "⚡", color: C.orange, desc: "Breaking new ground with calculated conviction.", tier: 2 },
  "builder-eth-yes-steady": { name: "The Strategist", icon: "♟️", color: C.accent, desc: "Every move is intentional. You play the long game.", tier: 3 },
  "builder-eth-yes-bold": { name: "The Catalyst", icon: "🧪", color: C.purple, desc: "You spark change. Innovation runs in your veins.", tier: 3 },
  "builder-eth-no-steady": { name: "The Guardian", icon: "🗿", color: C.blue, desc: "Skeptical but loyal. You hold the line.", tier: 2 },
  "builder-eth-no-bold": { name: "The Maverick", icon: "🚀", color: C.pink, desc: "Contrarian to the core. You zig when others zag.", tier: 2 },
  "explorer-btc-yes-steady": { name: "The Navigator", icon: "🧭", color: C.accent, desc: "Charting paths through uncharted territory.", tier: 2 },
  "explorer-btc-yes-bold": { name: "The Alchemist", icon: "✨", color: C.purple, desc: "Turning curiosity into gold. Everything you touch evolves.", tier: 3 },
  "explorer-btc-no-steady": { name: "The Scholar", icon: "📚", color: C.blue, desc: "Knowledge is power. You study before you strike.", tier: 2 },
  "explorer-btc-no-bold": { name: "The Rebel", icon: "🔥", color: C.pink, desc: "Question everything. Trust nothing. Build your own path.", tier: 2 },
  "explorer-eth-yes-steady": { name: "The Oracle", icon: "👁️", color: C.purple, desc: "You see the patterns. The future speaks to you.", tier: 3 },
  "explorer-eth-yes-bold": { name: "The Trailblazer", icon: "⚡", color: C.orange, desc: "First in, last out. You live for the frontier.", tier: 3 },
  "explorer-eth-no-steady": { name: "The Analyst", icon: "📊", color: C.blue, desc: "Data over drama. Numbers never lie.", tier: 2 },
  "explorer-eth-no-bold": { name: "The Rogue", icon: "🎭", color: C.pink, desc: "Unpredictable. Brilliant. Dangerously creative.", tier: 2 },
};

const QUIZ = [
  { q: "When the market dips 30%, you ___", a: { label: "Build more", val: "builder", emoji: "🏗️" }, b: { label: "Explore new plays", val: "explorer", emoji: "🧭" } },
  { q: "If you could only hold one asset forever", a: { label: "Bitcoin", val: "btc", emoji: "₿" }, b: { label: "Ethereum", val: "eth", emoji: "⟠" } },
  { q: "AI will replace banks within 10 years?", a: { label: "Absolutely", val: "yes", emoji: "🤖" }, b: { label: "Not a chance", val: "no", emoji: "🏦" } },
  { q: "Your motto in Web3", a: { label: "Slow & steady wins", val: "steady", emoji: "🐢" }, b: { label: "Fortune favors the bold", val: "bold", emoji: "🦅" } },
];

const TASKS = [
  { name: "Daily Check-in", icon: "✅", status: "done", reward: "+0.5 PROS", time: "2m ago" },
  { name: "Claim Faucet Tokens", icon: "🪙", status: "done", reward: "+1.2 PROS", time: "15m ago" },
  { name: "Daily Prediction (Free)", icon: "🎯", status: "run", reward: "~0.8 PROS", time: "Guess right = earn" },
  { name: "Auto-Stake Idle PROS", icon: "🔒", status: "lock", reward: "Unlock at Lv.2" },
  { name: "Auto-Compound Yield", icon: "📈", status: "lock", reward: "Unlock at Lv.3" },
  { name: "Governance Voting", icon: "🗳️", status: "lock", reward: "Unlock at Lv.4" },
];

// ═══════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(79,70,229,.15)}50%{box-shadow:0 0 40px rgba(79,70,229,.3)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes cardFlip{0%{transform:perspective(800px) rotateY(90deg) scale(.85);opacity:0}60%{transform:perspective(800px) rotateY(-5deg) scale(1.02);opacity:1}100%{transform:perspective(800px) rotateY(0) scale(1);opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes taskIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes bounceIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes dotPulse{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
`;

// ═══════════════════════════════════════════
//  HELPER: getPersona
// ═══════════════════════════════════════════
function getPersona(answers) {
  const key = answers.join("-");
  return PERSONAS[key] || PERSONAS["builder-btc-yes-bold"];
}
function getBonus(tier) { return tier === 3 ? 3 : tier === 2 ? 2 : 1; }

// ═══════════════════════════════════════════
//  VIEW SWITCHER (top‑level)
// ═══════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("pc"); // "pc" | "app"
  const [sharedAnswers, setSharedAnswers] = useState(null);

  return (
    <div style={{ fontFamily: FONT, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      {/* Top toggle */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 0", gap: "4px" }}>
        {[
          { id: "pc", label: "💻 PC — Airdrop Checker" },
          { id: "app", label: "📱 App — Post-Login" },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: "10px 24px", fontSize: "13px", fontWeight: 600,
            fontFamily: FONT, cursor: "pointer", border: "none",
            borderRadius: t.id === "pc" ? "10px 0 0 10px" : "0 10px 10px 0",
            background: view === t.id ? C.accent : C.surface,
            color: view === t.id ? "#fff" : C.dim,
            transition: "all .2s",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ textAlign: "center", padding: "8px 0 4px", fontSize: "11px", color: C.muted }}>
        INTERACTIVE PROTOTYPE — Click through to experience the full flow
      </div>

      {view === "pc"
        ? <PCView onDone={(ans) => { setSharedAnswers(ans); setView("app"); }} />
        : <AppView answers={sharedAnswers} onBack={() => setView("pc")} />
      }
    </div>
  );
}

// ═══════════════════════════════════════════
//  PC VIEW — Airdrop Checker + Lightbox
// ═══════════════════════════════════════════
function PCView({ onDone }) {
  const [modal, setModal] = useState(null); // null | "quiz" | "generating" | "card" | "register" | "success"
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [persona, setPersona] = useState(null);
  const [cardReady, setCardReady] = useState(false);
  const [countdown, setCountdown] = useState("23:59:47");

  // Countdown tick
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        const [h, m, s] = prev.split(":").map(Number);
        let total = h * 3600 + m * 60 + s - 1;
        if (total < 0) total = 86399;
        const hh = String(Math.floor(total / 3600)).padStart(2, "0");
        const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
        const ss = String(total % 60).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleQuizSelect = (val) => {
    if (selected) return;
    setSelected(val);
    setTimeout(() => {
      const next = [...answers, val];
      if (quizStep < QUIZ.length - 1) {
        setAnswers(next); setQuizStep(quizStep + 1); setSelected(null);
      } else {
        setAnswers(next);
        setModal("generating");
        const p = getPersona(next);
        setPersona(p);
        setTimeout(() => { setModal("card"); setTimeout(() => setCardReady(true), 400); }, 2800);
      }
    }, 500);
  };

  const BASE = 2847;
  const bonus = persona ? Math.round(BASE * getBonus(persona.tier) / 100) : 0;

  // ── backdrop + modal ──
  const renderModal = () => {
    if (!modal) return null;
    return (
      <div onClick={() => {}} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(15,15,40,.55)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "overlayIn .3s ease",
      }}>
        <div style={{
          width: modal === "success" ? 520 : 480,
          maxHeight: "90vh", overflow: "auto",
          background: C.bgPanel, borderRadius: "20px",
          border: `1px solid ${C.border}`,
          boxShadow: `0 32px 80px rgba(0,0,0,.12)`,
          animation: "modalIn .4s ease",
        }}>
          {modal === "quiz" && renderQuiz()}
          {modal === "generating" && renderGenerating()}
          {modal === "card" && renderCard()}
          {modal === "register" && renderRegister()}
          {modal === "success" && renderSuccess()}
        </div>
      </div>
    );
  };

  // ── quiz ──
  const renderQuiz = () => {
    const q = QUIZ[quizStep];
    const progress = ((quizStep + (selected ? 1 : 0)) / QUIZ.length) * 100;
    return (
      <div style={{ padding: "32px 36px" }}>
        <button onClick={() => { if (quizStep === 0) { setModal(null); } else { setQuizStep(quizStep - 1); setAnswers(answers.slice(0, -1)); setSelected(null); } }} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: "13px", fontFamily: FONT, display: "flex", alignItems: "center", gap: "4px", padding: 0, marginBottom: "12px" }}>← Back</button>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: C.dim, fontWeight: 500 }}>Creating Your AI Identity</span>
          <span style={{ fontSize: "12px", color: C.accent, fontWeight: 700 }}>{quizStep + 1}/{QUIZ.length}</span>
        </div>
        <div style={{ height: "4px", background: C.surface, borderRadius: "2px", marginBottom: "32px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${C.accent},${C.purple})`, borderRadius: "2px", transition: "width .5s ease" }} />
        </div>
        {/* AI icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 12px",
            background: `linear-gradient(135deg,${C.accent}20,${C.purple}20)`,
            border: `2px solid ${C.accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px",
            boxShadow: `0 0 32px ${C.accentMuted}`,
          }}>{["🤖", "🧠", "⚡", "🎯"][quizStep]}</div>
          <div style={{ fontSize: "10px", color: C.accent, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Pharos AI is analyzing you
          </div>
        </div>
        {/* question */}
        <div key={quizStep} style={{ animation: "fadeUp .35s ease" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: C.text, textAlign: "center", lineHeight: 1.4, marginBottom: "32px" }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[q.a, q.b].map((opt, i) => {
              const isSel = selected === opt.val;
              const otherSel = selected && !isSel;
              return (
                <button key={i} onClick={() => handleQuizSelect(opt.val)} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "20px", background: isSel ? `${C.accent}12` : C.surface,
                  border: `2px solid ${isSel ? C.accent : C.border}`,
                  borderRadius: "14px", cursor: "pointer", transition: "all .25s",
                  opacity: otherSel ? 0.35 : 1, transform: isSel ? "scale(1.01)" : "scale(1)",
                  fontFamily: FONT,
                }}>
                  <span style={{
                    fontSize: "28px", width: "48px", height: "48px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isSel ? C.accentMuted : C.bgPanel, borderRadius: "12px",
                  }}>{opt.emoji}</span>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: isSel ? C.accent : C.text }}>{opt.label}</span>
                  {isSel && <div style={{ marginLeft: "auto", width: "22px", height: "22px", borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", animation: "bounceIn .3s" }}><span style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>✓</span></div>}
                </button>
              );
            })}
          </div>
        </div>
        {/* dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "28px" }}>
          {QUIZ.map((_, i) => <div key={i} style={{ width: i === quizStep ? "20px" : "7px", height: "7px", borderRadius: "4px", background: i <= quizStep ? C.accent : C.surface, transition: "all .3s" }} />)}
        </div>
      </div>
    );
  };

  // ── generating ──
  const renderGenerating = () => (
    <div style={{ padding: "60px 36px", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", borderRadius: "50%", border: `3px solid ${C.accent}30`, borderTopColor: C.accent, animation: "spin 1s linear infinite" }} />
      <div style={{ fontSize: "18px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Generating Your AI Identity</div>
      <div style={{ fontSize: "13px", color: C.dim }}>Pharos AI is analyzing your answers...</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "20px" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.accent, animation: `dotPulse 1.4s ease infinite`, animationDelay: `${i * 0.16}s` }} />)}
      </div>
    </div>
  );

  // ── identity card ──
  const renderCard = () => {
    if (!persona) return null;
    const p = persona;
    const bonusPct = getBonus(p.tier);
    return (
      <div style={{ padding: "32px 36px" }}>
        <button onClick={() => { setModal("quiz"); setQuizStep(0); setAnswers([]); setSelected(null); setCardReady(false); setPersona(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: "13px", fontFamily: FONT, display: "flex", alignItems: "center", gap: "4px", padding: 0, marginBottom: "12px" }}>← Back</button>
        <div style={{ textAlign: "center", fontSize: "10px", color: C.accent, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", animation: "fadeIn .5s" }}>Your AI Identity</div>
        {/* card */}
        <div style={{
          background: `linear-gradient(155deg,${C.surface} 0%,${p.color}10 50%,${C.surface} 100%)`,
          borderRadius: "20px", padding: "28px 24px", border: `1px solid ${p.color}35`,
          animation: cardReady ? "cardFlip .8s ease" : "none", opacity: cardReady ? 1 : 0,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,transparent 30%,${p.color}06 50%,transparent 70%)`, backgroundSize: "200% 200%", animation: "shimmer 4s linear infinite", pointerEvents: "none" }} />
          {/* avatar */}
          <div style={{ textAlign: "center", marginBottom: "16px", position: "relative" }}>
            <div style={{
              width: "88px", height: "88px", borderRadius: "50%", margin: "0 auto",
              background: `linear-gradient(135deg,${p.color}25,${p.color}08)`,
              border: `3px solid ${p.color}50`, boxShadow: `0 0 36px ${p.color}25`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px",
            }}>{p.icon}</div>
            <div style={{
              position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)",
              background: p.color, color: "#fff", fontSize: "9px", fontWeight: 800,
              padding: "2px 10px", borderRadius: "8px", letterSpacing: "0.5px",
            }}>TIER {p.tier}</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: C.text, marginBottom: "4px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: C.dim, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
          {/* stats */}
          {cardReady && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", animation: "fadeUp .5s ease .2s both" }}>
            {[{ l: "Conviction", v: answers[0] === "builder" ? "92%" : "87%" }, { l: "AI Affinity", v: answers[2] === "yes" ? "High" : "Mid" }, { l: "Risk DNA", v: answers[3] === "bold" ? "Bold" : "Steady" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 4px", background: `${C.bg}80`, borderRadius: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: p.color }}>{s.v}</div>
                <div style={{ fontSize: "9px", color: C.dim, marginTop: "2px" }}>{s.l}</div>
              </div>
            ))}
          </div>}
        </div>

        {/* Bonus reveal */}
        {cardReady && <div style={{
          marginTop: "16px", padding: "18px 20px",
          background: `linear-gradient(135deg,${p.color}10,transparent)`,
          borderRadius: "14px", border: `1px solid ${p.color}20`,
          animation: "fadeUp .5s ease .4s both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "10px", color: C.dim }}>AI Bonus Unlocked</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: p.color }}>+{bonusPct}%</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: C.dim }}>Bonus Amount</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: C.text }}>+{bonus} <span style={{ fontSize: "12px", color: C.accent }}>PROS</span></div>
            </div>
          </div>
          <div style={{ height: "1px", background: C.border, margin: "0 0 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: C.text, fontWeight: 600 }}>Total: {(BASE + bonus).toLocaleString()} PROS</span>
            <span style={{ fontSize: "12px", color: C.dim, opacity: .7 }}>Base {BASE.toLocaleString()} + Bonus {bonus}</span>
          </div>
        </div>}

        {/* Timer + lock message */}
        {cardReady && <div style={{
          marginTop: "14px", padding: "14px 18px",
          background: `${C.orange}0c`, borderRadius: "12px",
          border: `1px solid ${C.orange}20`,
          display: "flex", alignItems: "center", gap: "12px",
          animation: "fadeUp .5s ease .6s both",
        }}>
          <span style={{ fontSize: "20px" }}>⏳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", color: C.orange, fontWeight: 600 }}>Bonus reserved for {countdown}</div>
            <div style={{ fontSize: "11px", color: C.dim, marginTop: "2px" }}>Sign up now to lock it in permanently</div>
          </div>
        </div>}

        {/* CTA buttons */}
        {cardReady && <div style={{ display: "flex", gap: "10px", marginTop: "18px", animation: "fadeUp .5s ease .8s both" }}>
          <button style={{
            flex: 1, padding: "13px", background: "transparent",
            border: `2px solid ${C.accent}30`, borderRadius: "12px",
            cursor: "pointer", color: C.accent, fontSize: "13px", fontWeight: 600,
            fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}>📤 Share to X</button>
          <button onClick={() => setModal("register")} style={{
            flex: 1.6, padding: "13px",
            background: `linear-gradient(135deg,${C.accent},${C.accentDim})`,
            border: "none", borderRadius: "12px", cursor: "pointer",
            color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: FONT,
          }}>Lock In My Bonus →</button>
        </div>}
      </div>
    );
  };

  // ── register ──
  const renderRegister = () => {
    if (!persona) return null;
    const p = persona;
    return (
      <div style={{ padding: "36px 40px" }}>
        <button onClick={() => setModal("card")} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: "13px", fontFamily: FONT, display: "flex", alignItems: "center", gap: "4px", padding: 0, marginBottom: "12px" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔐</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>Lock In Your AI Bonus</div>
          <div style={{ fontSize: "13px", color: C.dim, lineHeight: 1.6 }}>Create your Pharos Wallet account to permanently secure your <span style={{ color: p.color, fontWeight: 600 }}>+{bonus} PROS</span> bonus</div>
        </div>

        {/* Summary strip */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: C.surface, borderRadius: "12px", marginBottom: "24px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: `2px solid ${p.color}30` }}>{p.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{p.name} · Tier {p.tier}</div>
            <div style={{ fontSize: "11px", color: C.dim }}>Total: {(BASE + bonus).toLocaleString()} PROS</div>
          </div>
          <div style={{ fontSize: "11px", color: C.orange, fontWeight: 600 }}>⏳ {countdown}</div>
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>, label: "Continue with Google", bg: C.white, color: C.black, border: `1px solid ${C.border}` },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>, label: "Continue with Apple", bg: C.black, color: "#fff", border: `1px solid ${C.borderLight}` },
            { icon: <span style={{ fontSize: "16px" }}>✉️</span>, label: "Continue with Email", bg: C.surface, color: C.text, border: `1px solid ${C.border}` },
          ].map((btn, i) => (
            <button key={i} onClick={() => setModal("success")} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "14px 20px", background: btn.bg, color: btn.color,
              border: btn.border || "none", borderRadius: "12px",
              fontSize: "14px", fontWeight: 600, fontFamily: FONT, cursor: "pointer",
              transition: "all .15s",
            }}>{btn.icon}{btn.label}</button>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: C.muted, lineHeight: 1.5 }}>
          By continuing, you agree to Pharos Wallet Terms of Service
        </div>
      </div>
    );
  };

  // ── success / download ──
  const renderSuccess = () => {
    if (!persona) return null;
    const p = persona;
    return (
      <div style={{ padding: "36px 40px" }}>
        {/* Checkmark */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 16px",
            background: C.accentMuted, border: `3px solid ${C.accent}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "34px", animation: "bounceIn .5s ease",
          }}>✅</div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: C.text, marginBottom: "4px" }}>Bonus Locked!</div>
          <div style={{ fontSize: "13px", color: C.dim }}>Your AI Identity and bonus are secured</div>
        </div>

        {/* Summary card */}
        <div style={{
          background: `linear-gradient(135deg,${C.surface},${p.color}08)`,
          borderRadius: "16px", padding: "20px", border: `1px solid ${p.color}20`,
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: `2px solid ${p.color}40` }}>{p.icon}</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>{p.name}</div>
              <div style={{ fontSize: "11px", color: p.color, fontWeight: 600 }}>Tier {p.tier} · AI Identity Confirmed</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: `${C.bg}80`, borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: C.dim }}>Base</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>{BASE.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: `${C.bg}80`, borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: C.dim }}>AI Bonus</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: p.color }}>+{bonus}</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: `${C.bg}80`, borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: C.dim }}>Total</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C.accent }}>{(BASE + bonus).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Download section */}
        <div style={{
          background: C.surface, borderRadius: "16px", padding: "24px",
          border: `1px solid ${C.border}`, textAlign: "center", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "4px" }}>Activate Your AI Agent</div>
          <div style={{ fontSize: "12px", color: C.dim, lineHeight: 1.5, marginBottom: "20px" }}>Download the Pharos Wallet — your Agent earns $PROS while you sleep</div>

          {/* QR placeholder */}
          <div style={{
            width: "140px", height: "140px", margin: "0 auto 16px",
            background: C.white, borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "4px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", width: "100px" }}>
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: "1px", background: Math.random() > 0.45 ? C.black : C.white }} />
              ))}
            </div>
            <span style={{ fontSize: "9px", color: C.muted, marginTop: "4px" }}>Scan to download</span>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 20px", background: C.black, color: "#fff",
              border: `1px solid ${C.borderLight}`, borderRadius: "10px",
              fontSize: "12px", fontWeight: 600, fontFamily: FONT, cursor: "pointer",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              App Store
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 20px", background: C.black, color: "#fff",
              border: `1px solid ${C.borderLight}`, borderRadius: "10px",
              fontSize: "12px", fontWeight: 600, fontFamily: FONT, cursor: "pointer",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.63c.56.37 1.28.4 1.88.06L21.9 12.9a1.52 1.52 0 000-2.6L5.06.52C4.46.18 3.74.2 3.18.58A1.5 1.5 0 002.5 1.87v19.45c0 .55.27 1.07.68 1.31z"/></svg>
              Google Play
            </button>
          </div>
        </div>

        {/* Email backup */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: `${C.accent}08`, borderRadius: "10px", border: `1px solid ${C.accent}15`, marginBottom: "16px" }}>
          <span style={{ fontSize: "16px" }}>📧</span>
          <span style={{ fontSize: "12px", color: C.dim }}>Download link also sent to your email</span>
        </div>

        {/* Referral CTA */}
        <div style={{
          background: `linear-gradient(135deg,${C.purpleMuted},${C.accentMuted})`,
          borderRadius: "14px", padding: "18px", border: `1px solid ${C.purple}20`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ fontSize: "18px" }}>👥</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>Invite 3 friends → Upgrade to Tier {Math.min(persona.tier + 1, 3)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flex: 1, padding: "10px 14px", background: C.bgPanel, borderRadius: "8px", fontSize: "12px", color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>pharos.app/ref/ax7k2m</div>
            <button style={{ padding: "10px 16px", background: C.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>Copy</button>
          </div>
        </div>

        {/* Switch to app view */}
        <button onClick={() => onDone(answers)} style={{
          width: "100%", marginTop: "16px", padding: "14px",
          background: "transparent", border: `2px solid ${C.accent}30`,
          borderRadius: "12px", cursor: "pointer",
          color: C.accent, fontSize: "13px", fontWeight: 600, fontFamily: FONT,
        }}>
          Preview App Experience →
        </button>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  //  PC PAGE LAYOUT
  // ═══════════════════════════════════════════
  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 32px 60px" }}>
      {renderModal()}

      {/* Navbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 24px", borderBottom: `1px solid ${C.border}`, marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🏛️</div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>Pharos</span>
          <span style={{ fontSize: "12px", color: C.dim, fontWeight: 500, marginLeft: "4px" }}>Airdrop Checker</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px 16px", background: C.surface, borderRadius: "8px", fontSize: "12px", color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>0x7a3f...e82d</div>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.accent})` }} />
        </div>
      </div>

      {/* Airdrop summary */}
      <div style={{
        background: C.bgPanel, borderRadius: "20px", padding: "32px",
        border: `1px solid ${C.border}`, marginBottom: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "11px", color: C.dim, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Your Airdrop Allocation</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: C.text, lineHeight: 1 }}>2,847</span>
              <span style={{ fontSize: "20px", fontWeight: 600, color: C.accent }}>$PROS</span>
            </div>
            <div style={{ fontSize: "13px", color: C.dim, marginTop: "8px" }}>Based on your testnet activity, social tasks, and early supporter status</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: C.dim, marginBottom: "4px" }}>Estimated Value</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: C.text }}>TGE Price TBD</div>
            <div style={{ fontSize: "11px", color: C.dim }}>Claim at launch</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {[
            { label: "Testnet", value: "1,200", pct: "42%" },
            { label: "Social", value: "847", pct: "30%" },
            { label: "Early Bonus", value: "800", pct: "28%" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, padding: "14px", background: C.surface, borderRadius: "12px" }}>
              <div style={{ fontSize: "10px", color: C.dim, marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>{item.value}</div>
              <div style={{ fontSize: "10px", color: C.muted }}>{item.pct}</div>
            </div>
          ))}
        </div>

        {/* Claim button (base - always visible) */}
        <button style={{
          width: "100%", marginTop: "20px", padding: "16px",
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "12px", cursor: "pointer",
          color: C.text, fontSize: "15px", fontWeight: 600, fontFamily: FONT,
        }}>
          Claim 2,847 $PROS to wallet
        </button>
      </div>

      {/* ★ AI BONUS BANNER ★ */}
      <div onClick={() => { setModal("quiz"); setQuizStep(0); setAnswers([]); setSelected(null); setCardReady(false); setPersona(null); }} style={{
        background: `linear-gradient(135deg,${C.orangeMuted || 'rgba(245,158,11,0.08)'},${C.purpleMuted},${C.accentMuted})`,
        borderRadius: "20px", padding: "28px 32px",
        border: `1px solid ${C.orange}25`,
        cursor: "pointer", transition: "all .2s",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg,${C.orange},${C.purple},${C.accent})`,
          backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px",
              background: `linear-gradient(135deg,${C.accent}20,${C.purple}20)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", border: `2px solid ${C.accent}30`,
              boxShadow: `0 0 24px ${C.accentMuted}`,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: C.text, marginBottom: "4px" }}>Want more $PROS?</div>
              <div style={{ fontSize: "13px", color: C.dim, lineHeight: 1.5 }}>
                Create your <span style={{ color: C.accent, fontWeight: 600 }}>AI Identity</span> to unlock up to <span style={{ color: C.orange, fontWeight: 700 }}>+3% bonus allocation</span>
              </div>
            </div>
          </div>
          <div style={{
            padding: "12px 24px",
            background: `linear-gradient(135deg,${C.accent},${C.accentDim})`,
            borderRadius: "12px", color: "#fff",
            fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap",
          }}>
            Unlock AI Bonus →
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "18px" }}>
          {[
            { icon: "🎭", text: "Create unique AI alter ego" },
            { icon: "⚡", text: "AI Agent earns while you sleep" },
            { icon: "👥", text: "Invite friends → tier up → more bonus" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px" }}>{f.icon}</span>
              <span style={{ fontSize: "11px", color: C.dim }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* footer links */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "24px" }}>
        {["Docs", "Community", "Blog", "Support"].map(l => (
          <span key={l} style={{ fontSize: "12px", color: C.muted, cursor: "pointer" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  APP VIEW — Phone frame with Agent Dashboard
// ═══════════════════════════════════════════
function AppView({ answers, onBack }) {
  const ans = answers || ["builder", "btc", "yes", "bold"];
  const persona = getPersona(ans);
  const bonus = Math.round(2847 * getBonus(persona.tier) / 100);
  const [earnings, setEarnings] = useState(1.70);
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 400); }, []);
  useEffect(() => {
    const t = setInterval(() => setEarnings(p => p + Math.random() * 0.03), 2200);
    return () => clearInterval(t);
  }, []);

  const p = persona;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px 40px" }}>
      <button onClick={onBack} style={{
        alignSelf: "flex-start", padding: "8px 16px",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "8px", cursor: "pointer",
        color: C.dim, fontSize: "12px", fontWeight: 500, fontFamily: FONT,
        marginBottom: "12px",
      }}>← Back to PC View</button>

      {/* Phone frame */}
      <div style={{
        width: "390px", height: "800px", background: C.bg,
        borderRadius: "40px", border: `2px solid ${C.border}`,
        overflow: "hidden", position: "relative",
        boxShadow: `0 0 60px rgba(0,0,0,.12), 0 0 100px ${C.accentMuted}`,
      }}>
        {/* notch */}
        <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "120px", height: "28px", background: C.black, borderRadius: "14px" }} />
        </div>

        {/* scrollable content */}
        <div style={{ height: "calc(100% - 50px)", overflowY: "auto", padding: "0 20px 20px" }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", animation: ready ? "fadeIn .5s" : "none", opacity: ready ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", border: `2px solid ${p.color}35` }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>{p.name}</div>
                <div style={{ fontSize: "10px", color: C.accent, fontWeight: 500 }}>Agent Active</div>
              </div>
            </div>
            <div style={{ padding: "5px 10px", borderRadius: "16px", background: C.accentMuted, border: `1px solid ${C.accent}25`, fontSize: "10px", fontWeight: 600, color: C.accent, display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.success, animation: "pulse 1.5s infinite" }} />Lv.1
            </div>
          </div>

          {/* Airdrop summary mini */}
          <div style={{
            background: `linear-gradient(135deg,${C.surface},${p.color}08)`,
            borderRadius: "16px", padding: "18px", border: `1px solid ${p.color}20`,
            marginBottom: "14px", animation: ready ? "fadeUp .5s ease .1s both" : "none",
          }}>
            <div style={{ fontSize: "10px", color: C.dim, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Your Total Airdrop</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: C.text }}>{(2847 + bonus).toLocaleString()}</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: C.accent }}>PROS</span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: C.dim }}>Base 2,847</span>
              <span style={{ fontSize: "11px", color: p.color, fontWeight: 600 }}>+ AI Bonus +{bonus}</span>
            </div>
          </div>

          {/* Earnings card */}
          <div style={{
            background: C.surface, borderRadius: "16px", padding: "18px",
            border: `1px solid ${C.border}`, marginBottom: "14px",
            animation: ready ? "fadeUp .5s ease .2s both" : "none",
          }}>
            <div style={{ fontSize: "10px", color: C.dim, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Agent Earnings Today</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginBottom: "12px" }}>
              <span style={{ fontSize: "34px", fontWeight: 800, color: C.text }}>{earnings.toFixed(2)}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.accent }}>PROS</span>
              <span style={{ fontSize: "11px", color: C.success, fontWeight: 600, marginLeft: "4px", animation: "pulse 2s infinite" }}>● live</span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[{ l: "Tasks Done", v: "2/6", c: C.accent }, { l: "Win Rate", v: "—", c: C.purple }, { l: "Total", v: "1.7 PROS", c: C.orange }].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 2px", background: `${C.bg}90`, borderRadius: "8px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: "8px", color: C.dim, marginTop: "1px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div style={{ marginBottom: "14px", animation: ready ? "fadeUp .5s ease .3s both" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>Agent Tasks</span>
              <span style={{ fontSize: "10px", color: C.dim }}>Auto-running</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {TASKS.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px", background: t.status === "lock" ? `${C.surface}80` : C.surface,
                  borderRadius: "12px", border: `1px solid ${t.status === "done" ? C.accent + "15" : t.status === "run" ? C.orange + "15" : C.border}`,
                  opacity: t.status === "lock" ? 0.45 : 1,
                  animation: ready ? `taskIn .35s ease ${0.35 + i * 0.07}s both` : "none",
                }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px",
                    background: t.status === "done" ? C.accentMuted : t.status === "run" ? C.orangeMuted || 'rgba(245,158,11,0.12)' : C.bgPanel,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
                  }}>
                    {t.status === "run" ? <div style={{ width: "15px", height: "15px", border: `2px solid ${C.orange}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> : t.status === "lock" ? "🔒" : t.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: t.status === "lock" ? C.muted : C.text }}>{t.name}</div>
                    {t.time && <div style={{ fontSize: "9px", color: C.dim, marginTop: "1px" }}>{t.time}</div>}
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: 600,
                    color: t.status === "done" ? C.accent : t.status === "run" ? C.orange : C.muted,
                  }}>{t.reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level up */}
          <div style={{
            background: `linear-gradient(135deg,${C.purpleMuted},${C.accentMuted})`,
            borderRadius: "14px", padding: "16px", border: `1px solid ${C.purple}20`,
            animation: ready ? "fadeUp .5s ease .7s both" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "15px" }}>⬆️</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: C.text }}>Level Up Your Agent</span>
              </div>
              <span style={{ fontSize: "10px", color: C.purple, fontWeight: 600 }}>1/3 friends</span>
            </div>
            <div style={{ height: "5px", background: C.bgPanel, borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ height: "100%", width: "33%", background: `linear-gradient(90deg,${C.purple},${C.accent})`, borderRadius: "3px" }} />
            </div>
            <div style={{ fontSize: "10px", color: C.dim, lineHeight: 1.5, marginBottom: "10px" }}>
              Invite <span style={{ color: C.purple, fontWeight: 600 }}>2 more friends</span> to unlock Lv.2: <span style={{ color: C.accent, fontWeight: 600 }}>Auto-Stake</span>
            </div>
            <button style={{
              width: "100%", padding: "11px",
              background: `linear-gradient(135deg,${C.purple},${C.accent})`,
              border: "none", borderRadius: "10px",
              color: "#fff", fontSize: "12px", fontWeight: 700,
              fontFamily: FONT, cursor: "pointer",
            }}>👥 Invite Friends & Level Up</button>
          </div>

          {/* Bottom nav */}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "18px", padding: "12px 0 4px", borderTop: `1px solid ${C.border}` }}>
            {[
              { icon: "🏠", label: "Home", active: false },
              { icon: "🤖", label: "Agent", active: true },
              { icon: "📊", label: "Earn", active: false },
              { icon: "👤", label: "Profile", active: false },
            ].map((tab, i) => (
              <div key={i} style={{ textAlign: "center", opacity: tab.active ? 1 : 0.35 }}>
                <div style={{ fontSize: "18px", marginBottom: "3px" }}>{tab.icon}</div>
                <div style={{ fontSize: "8px", color: tab.active ? C.accent : C.dim, fontWeight: tab.active ? 700 : 500 }}>{tab.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
