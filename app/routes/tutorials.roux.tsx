import { useState } from "react";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Roux Method | CuberWorld" }];
}

const CMLL_ALGORITHMS = [
  { id: "CMLL-1",  name: "U (Sune)",       alg: "R U R' U R U2 R'" },
  { id: "CMLL-2",  name: "U (Anti-Sune)",  alg: "R U2 R' U' R U' R'" },
  { id: "CMLL-3",  name: "U (double)",     alg: "R U2 R' U' R U R' U' R U' R'" },
  { id: "CMLL-4",  name: "U (pi)",         alg: "F R U R' U' R U R' U' F'" },
  { id: "CMLL-5",  name: "T (oriented)",   alg: "R U R' U' R' F R F'" },
  { id: "CMLL-6",  name: "S (right)",      alg: "R' F R U R U' R2 F' R2 U' R'" },
  { id: "CMLL-7",  name: "S (left)",       alg: "F R' F' R U R U' R'" },
  { id: "CMLL-8",  name: "AS (right)",     alg: "R U2 R2 F R F' R U' R' U R U2 R'" },
  { id: "CMLL-9",  name: "L (front)",      alg: "F R U' R' U' R U R' F'" },
  { id: "CMLL-10", name: "L (back)",       alg: "R U R' U R U' R' U R U2 R'" },
  { id: "CMLL-11", name: "Pi (front)",     alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { id: "CMLL-12", name: "Pi (back)",      alg: "R' U' R U' R' U2 R" },
  { id: "CMLL-13", name: "H (all corners)",alg: "R U R' U R U' R' U R U2 R' U2" },
];

const steps = [
  {
    id: "fb",
    title: "STEP 1: FIRST BLOCK",
    color: "var(--green)",
    desc: "Build a 1×2×3 block on the left side of the cube. This block consists of a bottom-left corner, the left edge, and the front-left edge. This step is completely intuitive.",
    tips: [
      "Work with the cube held so your left face is the block side",
      "Place the center first (it never moves), then build around it",
      "Try to plan the first block during inspection",
      "Aim for 8-12 moves on average",
    ],
    alg: null,
  },
  {
    id: "sb",
    title: "STEP 2: SECOND BLOCK",
    color: "var(--cyan)",
    desc: "Build the second 1×2×3 block on the right side. Two pieces need to be inserted: the front-right edge and the bottom-right corner. Use the free U layer moves.",
    tips: [
      "The left block must stay solved while building the right",
      "Use M and U moves freely — they don't affect the left block",
      "Insert the corner and edge as a pair when possible",
      "Common insert: U R U' R' (right pair) or U' L' U L (left pair)",
    ],
    alg: null,
  },
  {
    id: "cmll",
    title: "STEP 3: CMLL",
    color: "var(--yellow)",
    desc: "Orient and permute the corners of the U layer. CMLL stands for Corners of the Last Layer — edges are ignored. There are 42 CMLL cases (using the no-misoriented-corners version).",
    tips: [
      "Only the 4 top corners are affected",
      "M-slice edges are completely ignored in this step",
      "Recognition is based on the colors of the U-face and side stickers",
      "Learn in sets: U, T, S, AS, L, Pi, H",
    ],
    alg: null,
  },
  {
    id: "lse",
    title: "STEP 4: LSE (LAST SIX EDGES)",
    color: "var(--magenta)",
    desc: "Solve the remaining 6 edges using only M and U moves. Split into: EO (edge orientation), then UL/UR placement, then 4c (4-cycle to permute).",
    tips: [
      "All moves are M, M', M2, U, U', U2 — very ergonomic",
      "EO: orient all 6 edges using M and U moves",
      "ULUR: place the UL and UR edges correctly",
      "4c: solve the remaining 4 edges with M2 U2 / M' U2 patterns",
    ],
    alg: null,
  },
];

export default function RouxPage() {
  const [activeStep, setActiveStep] = useState<string>("fb");
  const [showCmll, setShowCmll] = useState(false);

  const currentStep = steps.find(s => s.id === activeStep)!;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link to="/tutorials" className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", textDecoration: "none" }}>
          ← TUTORIALS
        </Link>
        <h1 style={{ fontSize: "1.2rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
          ROUX <span className="neon-cyan">METHOD</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)" }}>
          First Block → Second Block → CMLL → LSE
        </p>
      </div>

      {/* Overview */}
      <div className="retro-box-cyan" style={{ marginBottom: "2rem" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--cyan)", marginBottom: "0.75rem" }}>ABOUT ROUX</div>
        <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "0.75rem" }}>
          Invented by Gilles Roux, this method uses block-building instead of layer-by-layer solving.
          It typically requires only ~45 moves compared to CFOP's ~55, making it efficient for advanced solvers.
        </p>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <span className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--green)" }}>✓ ~45 MOVES AVG</span>
          <span className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--green)" }}>✓ LOW ALGO COUNT</span>
          <span className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--green)" }}>✓ INTUITIVE F2B</span>
          <span className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--green)" }}>✓ M/U ONLY LSE</span>
        </div>
      </div>

      {/* Step navigation */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        {steps.map(step => (
          <button
            key={step.id}
            className={`tab-retro${activeStep === step.id ? " active" : ""}`}
            onClick={() => setActiveStep(step.id)}
          >
            {step.id.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="retro-box" style={{ borderTop: "none" }}>
        <div style={{ borderLeft: `4px solid ${currentStep.color}`, paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.7rem", color: currentStep.color, marginBottom: "0.75rem" }}>{currentStep.title}</h2>
          <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1.1rem" }}>{currentStep.desc}</p>
        </div>

        <h3 style={{ fontSize: "0.55rem", color: "var(--text-dim)", marginBottom: "1rem" }}>KEY TIPS</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {currentStep.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span className="font-pixel" style={{ fontSize: "0.5rem", color: currentStep.color, flexShrink: 0 }}>0{i + 1}</span>
              <span className="font-retro" style={{ color: "var(--text-dim)" }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* CMLL section */}
        {activeStep === "cmll" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.55rem", color: "var(--yellow)", margin: 0 }}>CMLL ALGORITHMS</h3>
              <button
                className="btn-retro btn-retro-yellow"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.45rem" }}
                onClick={() => setShowCmll(!showCmll)}
              >
                {showCmll ? "HIDE" : "SHOW ALL"}
              </button>
            </div>

            {showCmll && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                {CMLL_ALGORITHMS.map(algo => (
                  <div key={algo.id} className="algo-card">
                    <div className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--text-dim)", marginBottom: "0.4rem" }}>{algo.id}</div>
                    <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--yellow)", marginBottom: "0.5rem" }}>{algo.name}</div>
                    <div className="font-retro" style={{ color: "var(--cyan)", fontSize: "1rem" }}>{algo.alg}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LSE common patterns */}
        {activeStep === "lse" && (
          <div>
            <h3 style={{ fontSize: "0.55rem", color: "var(--magenta)", marginBottom: "1rem" }}>COMMON LSE PATTERNS</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {[
                { name: "EO - Both wrong",      alg: "M U2 M'" },
                { name: "EO - Four wrong",       alg: "M U M U M U2 M' U' M' U' M'" },
                { name: "4c - All placed",       alg: "M2 U2 M2 U2" },
                { name: "4c - Skip",             alg: "(skip)" },
                { name: "UL/UR - Opposite",      alg: "M2 U2 M2" },
                { name: "UL/UR - Adjacent",      alg: "M2 U M2 U'" },
              ].map(item => (
                <div key={item.name} className="algo-card">
                  <div className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--text-dim)", marginBottom: "0.4rem" }}>{item.name}</div>
                  <div className="font-retro" style={{ color: "var(--cyan)", fontSize: "1.1rem" }}>{item.alg}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resources */}
      <div className="retro-box" style={{ marginTop: "1.5rem", borderColor: "var(--text-dim)" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginBottom: "1rem" }}>RECOMMENDED RESOURCES</div>
        <div className="font-retro" style={{ color: "var(--text-dim)" }}>
          <p>• Kian Mansour's YouTube channel — top Roux competitor tutorials</p>
          <p>• The Roux Method by Gilles Roux (original source)</p>
          <p>• SpeedSolving.com wiki — full CMLL recognition guide</p>
          <p>• Practice F2B on a 3x3 with the right block pre-solved</p>
        </div>
      </div>
    </div>
  );
}
