import { Link } from "react-router";

export function meta() {
  return [{ title: "Tutorials | CuberWorld" }];
}

const methods = [
  {
    slug: "cfop",
    name: "CFOP METHOD",
    tagline: "The World's Most Popular Speedcubing Method",
    color: "var(--green)",
    difficulty: "INTERMEDIATE",
    steps: ["CROSS", "F2L", "OLL", "PLL"],
    desc: "CFOP (Fridrich Method) is used by nearly all top speedcubers. Learn Cross, First Two Layers, Orient Last Layer, and Permute Last Layer. Includes all 57 OLL and 21 PLL algorithms with progress tracking.",
    features: ["57 OLL Algorithms", "21 PLL Algorithms", "Progress Tracking", "F2L Techniques"],
  },
  {
    slug: "roux",
    name: "ROUX METHOD",
    tagline: "Low Movecount Block Building",
    color: "var(--cyan)",
    difficulty: "INTERMEDIATE",
    steps: ["FIRST BLOCK", "SECOND BLOCK", "CMLL", "LSE"],
    desc: "The Roux method uses block building for an efficient, low-movecount solve. Preferred by cubers who want fewer moves and more intuitive solving. Used by WR holders like Kian Mansour.",
    features: ["Intuitive F2L", "CMLL Algorithms", "M-Slice Last 6 Edges", "Low Movecount"],
  },
  {
    slug: "blindfolded",
    name: "BLINDFOLDED",
    tagline: "Memorize. Execute. Impress.",
    color: "var(--magenta)",
    difficulty: "ADVANCED",
    steps: ["MEMORIZE", "EXECUTE EDGES", "EXECUTE CORNERS", "PARITY"],
    desc: "Solve the cube while blindfolded using systematic memorization and Old Pochmann/M2 methods. One of the most impressive feats in speedcubing. Beginner-friendly approach covered step by step.",
    features: ["Old Pochmann Method", "M2 Edges", "Lettering Schemes", "Parity Cases"],
  },
];

export default function TutorialsIndex() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.3em", marginBottom: "0.75rem" }}>
          &gt;&gt; TUTORIAL DATABASE
        </div>
        <h1 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
          SOLVING <span className="neon-green">METHODS</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1.2rem" }}>
          Choose your path to speedcubing mastery.
        </p>
      </div>

      {/* Method cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {methods.map((method, i) => (
          <div key={method.slug} className="retro-box" style={{ borderColor: method.color, display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "start" }}>
            <div>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "0.8rem", color: method.color, margin: 0 }}>{method.name}</h2>
                <span className="font-pixel" style={{
                  fontSize: "0.4rem", padding: "0.2rem 0.5rem",
                  border: `1px solid ${method.color}`, color: method.color
                }}>
                  {method.difficulty}
                </span>
              </div>

              <p className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginBottom: "1rem", fontFamily: "inherit" }}>
                {method.tagline}
              </p>

              {/* Steps */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {method.steps.map((step, si) => (
                  <span key={step}>
                    <span className="move-chip">{step}</span>
                    {si < method.steps.length - 1 && (
                      <span className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--border)", margin: "0 0.2rem" }}>→</span>
                    )}
                  </span>
                ))}
              </div>

              <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.25rem" }}>
                {method.desc}
              </p>

              {/* Features */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {method.features.map(f => (
                  <span key={f} className="font-retro" style={{ color: method.color, fontSize: "0.95rem" }}>
                    ✓ {f}
                  </span>
                ))}
              </div>

              <Link to={`/tutorials/${method.slug}`} className={`btn-retro ${method.color === 'var(--cyan)' ? 'btn-retro-cyan' : method.color === 'var(--magenta)' ? 'btn-retro-magenta' : ''}`}>
                START {method.name} →
              </Link>
            </div>

            {/* Number */}
            <div className="font-pixel" style={{
              fontSize: "4rem", color: method.color, opacity: 0.08,
              lineHeight: 1, userSelect: "none", minWidth: "80px", textAlign: "right"
            }}>
              0{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
