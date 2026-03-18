import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "CuberWorld — The Ultimate Speedcubing Hub" },
    { name: "description", content: "Learn CFOP, Roux, Blindfolded solving. Practice on a virtual 3D cube. Get AI-powered analysis of your solves." },
  ];
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "5rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <div className="font-pixel" style={{ fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "0.3em", marginBottom: "1rem" }}>
            &gt;&gt; WELCOME TO
          </div>

          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", lineHeight: 1.3, marginBottom: "1rem" }}>
            <span className="neon-green">CUBER</span>
            <span className="neon-cyan">WORLD</span>
          </h1>

          <div className="font-pixel" style={{ fontSize: "0.6rem", color: "var(--magenta)", letterSpacing: "0.2em", marginBottom: "2rem", textShadow: "0 0 10px var(--magenta)" }}>
            THE ULTIMATE SPEEDCUBING HUB
          </div>

          <p className="font-retro" style={{ fontSize: "1.3rem", color: "var(--text-dim)", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
            Master every method. Solve faster. Conquer the cube.
            Tutorials, virtual practice, and AI-powered coaching — all in one place.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/tutorials" className="btn-retro">
              ► START LEARNING
            </Link>
            <Link to="/cube" className="btn-retro btn-retro-cyan">
              ■ VIRTUAL CUBE
            </Link>
            <Link to="/pricing" className="btn-retro btn-retro-magenta">
              ★ AI ANALYZER
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg2)", padding: "1rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
          {[
            { label: "OLL CASES", value: "57" },
            { label: "PLL CASES", value: "21" },
            { label: "METHODS", value: "3" },
            { label: "FREE TRIAL", value: "7 DAYS" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div className="font-pixel neon-cyan" style={{ fontSize: "1rem" }}>{stat.value}</div>
              <div className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 2rem" }}>
        <h2 style={{ fontSize: "0.9rem", textAlign: "center", marginBottom: "3rem" }}>
          WHAT'S INSIDE
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* Card 1 */}
          <div className="retro-box" style={{ borderColor: "var(--green)" }}>
            <div className="font-pixel neon-green" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ fontSize: "0.65rem", marginBottom: "1rem", color: "var(--green)" }}>TUTORIALS</h3>
            <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.25rem" }}>
              Step-by-step guides for CFOP, Roux, and Blindfolded methods. Track your progress through all 57 OLL and 21 PLL algorithms.
            </p>
            <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1.2rem", marginBottom: "1.5rem" }}>
              <li>✓ Full CFOP method (F2L, OLL, PLL)</li>
              <li>✓ Roux method (blocks + CMLL)</li>
              <li>✓ Blindfolded (Old Pochmann + M2)</li>
              <li>✓ Algorithm progress tracking</li>
            </ul>
            <Link to="/tutorials" className="btn-retro" style={{ fontSize: "0.55rem" }}>
              EXPLORE →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="retro-box" style={{ borderColor: "var(--cyan)" }}>
            <div className="font-pixel neon-cyan" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>⬛</div>
            <h3 style={{ fontSize: "0.65rem", marginBottom: "1rem", color: "var(--cyan)" }}>VIRTUAL 3D CUBE</h3>
            <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.25rem" }}>
              Fully interactive 3D Rubik's cube rendered in your browser. Drag to rotate, click to make moves, and practice your algorithms.
            </p>
            <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1.2rem", marginBottom: "1.5rem" }}>
              <li>✓ Real-time 3D rendering</li>
              <li>✓ Drag face rotation controls</li>
              <li>✓ One-click scramble</li>
              <li>✓ Move history</li>
            </ul>
            <Link to="/cube" className="btn-retro btn-retro-cyan" style={{ fontSize: "0.55rem" }}>
              PRACTICE →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="retro-box" style={{ borderColor: "var(--magenta)" }}>
            <div className="font-pixel neon-magenta" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎥</div>
            <h3 style={{ fontSize: "0.65rem", marginBottom: "1rem", color: "var(--magenta)" }}>AI ANALYZER</h3>
            <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.25rem" }}>
              Record your solve and get instant AI-powered feedback. Identify inefficiencies, improve lookahead, and cut seconds off your time.
            </p>
            <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1.2rem", marginBottom: "1.5rem" }}>
              <li>✓ Webcam video recording</li>
              <li>✓ AI move analysis</li>
              <li>✓ Personalized tips</li>
              <li>✓ 7-day free trial</li>
            </ul>
            <Link to="/pricing" className="btn-retro btn-retro-magenta" style={{ fontSize: "0.55rem" }}>
              TRY FREE →
            </Link>
          </div>
        </div>
      </section>

      {/* Methods Overview */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "0.9rem", textAlign: "center", marginBottom: "3rem" }}>
            SOLVING METHODS
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                name: "CFOP",
                color: "var(--green)",
                tag: "MOST POPULAR",
                desc: "Cross → F2L → OLL → PLL. The most widely used speedcubing method. Suitable for sub-20s and world records.",
                link: "/tutorials/cfop",
              },
              {
                name: "ROUX",
                color: "var(--cyan)",
                tag: "LOW MOVECOUNT",
                desc: "Block building approach. Fewer moves, more intuitive. Used by top competitors like Kian Mansour.",
                link: "/tutorials/roux",
              },
              {
                name: "BLINDFOLDED",
                color: "var(--magenta)",
                tag: "MEMORY SKILL",
                desc: "Memorize the cube, then solve it without looking. Old Pochmann and M2 methods for beginners.",
                link: "/tutorials/blindfolded",
              },
            ].map(method => (
              <div key={method.name} style={{ borderLeft: `3px solid ${method.color}`, paddingLeft: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span className="font-pixel" style={{ fontSize: "0.7rem", color: method.color }}>{method.name}</span>
                  <span className="font-pixel" style={{ fontSize: "0.35rem", color: method.color, opacity: 0.7 }}>{method.tag}</span>
                </div>
                <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1rem" }}>{method.desc}</p>
                <Link to={method.link} style={{ color: method.color, textDecoration: "none", fontFamily: "'Press Start 2P', monospace", fontSize: "0.5rem" }}>
                  LEARN MORE →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          READY TO <span className="neon-cyan">LEVEL UP?</span>
        </h2>
        <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1.2rem", marginBottom: "2rem" }}>
          Create a free account and start tracking your progress today.
        </p>
        <Link to="/register" className="btn-retro btn-retro-cyan" style={{ fontSize: "0.7rem", padding: "1rem 2rem" }}>
          ► START FOR FREE
        </Link>
      </section>
    </div>
  );
}
