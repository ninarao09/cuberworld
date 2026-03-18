import { useState } from "react";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Blindfolded 3x3 | CuberWorld" }];
}

const LETTERING = {
  edges: {
    label: "EDGES",
    pieces: [
      { pos: "UB", letter: "A" }, { pos: "UL", letter: "B" }, { pos: "UR", letter: "C" }, { pos: "UF", letter: "D" },
      { pos: "LU", letter: "E" }, { pos: "LF", letter: "F" }, { pos: "LD", letter: "G" }, { pos: "LB", letter: "H" },
      { pos: "FU", letter: "I" }, { pos: "FL", letter: "J" }, { pos: "FD", letter: "K" }, { pos: "FR", letter: "L" },
      { pos: "RU", letter: "M" }, { pos: "RF", letter: "N" }, { pos: "RD", letter: "O" }, { pos: "RB", letter: "P" },
      { pos: "BU", letter: "Q" }, { pos: "BR", letter: "R" }, { pos: "BD", letter: "S" }, { pos: "BL", letter: "T" },
      { pos: "DF", letter: "U" }, { pos: "DL", letter: "V" }, { pos: "DB", letter: "W" }, { pos: "DR", letter: "X" },
    ],
  },
  corners: {
    label: "CORNERS",
    pieces: [
      { pos: "UBL", letter: "A" }, { pos: "UBR", letter: "B" }, { pos: "UFR", letter: "C" }, { pos: "UFL", letter: "D" },
      { pos: "LUB", letter: "E" }, { pos: "LUF", letter: "F" }, { pos: "LDF", letter: "G" }, { pos: "LDB", letter: "H" },
      { pos: "FUL", letter: "I" }, { pos: "FUR", letter: "J" }, { pos: "FDR", letter: "K" }, { pos: "FDL", letter: "L" },
      { pos: "RUF", letter: "M" }, { pos: "RUB", letter: "N" }, { pos: "RDB", letter: "O" }, { pos: "RDF", letter: "P" },
      { pos: "BUR", letter: "Q" }, { pos: "BUL", letter: "R" }, { pos: "BDL", letter: "S" }, { pos: "BDR", letter: "T" },
      { pos: "DFL", letter: "U" }, { pos: "DFR", letter: "V" }, { pos: "DBR", letter: "W" }, { pos: "DBL", letter: "X" },
    ],
  },
};

const sections = [
  {
    id: "intro",
    title: "INTRODUCTION",
    color: "var(--magenta)",
    content: [
      {
        heading: "WHAT IS BLINDFOLDED SOLVING?",
        body: "BLD (Blindfolded) solving means memorizing the entire state of the cube, then putting on a blindfold and solving it purely from memory. Official WCA events include 3BLD, 4BLD, 5BLD, and Multi-BLD.",
      },
      {
        heading: "THE METHOD WE USE: OLD POCHMANN + M2",
        body: "Old Pochmann uses a simple setup-execute-undo cycle. M2 is an efficient method for edges. Together they form the most beginner-friendly BLD method. Once learned, you can advance to 3-style for speed.",
      },
      {
        heading: "AVERAGE TIMES",
        body: "Beginners: 5-15 minutes | Intermediate: 1-3 minutes | Advanced (3-style): 20-40 seconds | World Record: ~12 seconds",
      },
    ],
  },
  {
    id: "lettering",
    title: "LETTERING SCHEME",
    color: "var(--cyan)",
    content: [
      {
        heading: "WHY WE NEED LETTERS",
        body: "Every edge and corner position has a letter. When memorizing, you chain these letters together into words/images. This is called 'memo' (memorization).",
      },
      {
        heading: "SPEFFZ SCHEME (MOST COMMON)",
        body: "The Speffz lettering scheme assigns A-X to all 24 edge stickers and 24 corner stickers. The buffer (starting position) is typically UF for edges and UFR for corners.",
      },
      {
        heading: "MEMO TECHNIQUE: IMAGES",
        body: "Convert letter pairs into images. AB = 'Apple Banana' → picture an apple eating a banana. Chain these images together in a memory palace (method of loci).",
      },
    ],
  },
  {
    id: "edges",
    title: "EDGES: M2 METHOD",
    color: "var(--green)",
    content: [
      {
        heading: "HOW M2 WORKS",
        body: "M2 method cycles edges through the buffer (UF position) using M2 moves + setup moves. For each target in your memo, you do: setup → M2 → undo setup.",
      },
      {
        heading: "THE CORE ALGORITHM",
        body: "M2 (two middle-slice moves). When a target is at a 'fixed' position like UB (A), you do M2 directly. For other positions, you use setup moves to bring them to UB, do M2, then undo.",
      },
      {
        heading: "SPECIAL CASES",
        body: "If a piece is already in the buffer (UF), skip it. If a piece is already solved (in its home position), it's a 'floating piece' — skip it in memo. Handle parity at the end if your letter count is odd.",
      },
    ],
  },
  {
    id: "corners",
    title: "CORNERS: OLD POCHMANN",
    color: "var(--yellow)",
    content: [
      {
        heading: "HOW OLD POCHMANN WORKS",
        body: "Old Pochmann uses the T-Perm to cycle three corners. The buffer is UFR. For each target: setup → T-Perm → undo setup. This 3-cycles the buffer, target, and a fixed position (UBL = A).",
      },
      {
        heading: "THE T-PERM",
        body: "R U R' U' R' F R2 U' R' U' R U R' F' — this is your core algorithm for Old Pochmann corners. It cycles UFR → UBL → A's position.",
      },
      {
        heading: "RECOGNIZING SETUP MOVES",
        body: "For each letter in your corner memo, you need the setup moves to bring that sticker to a non-buffer, non-A position. Learn setups for all 22 non-buffer corner stickers.",
      },
    ],
  },
  {
    id: "parity",
    title: "PARITY",
    color: "var(--red)",
    content: [
      {
        heading: "WHAT IS PARITY?",
        body: "If you have an odd number of edge targets AND an odd number of corner targets, you have parity. This means a single edge swap remains at the end that cannot be solved with normal algorithms.",
      },
      {
        heading: "EDGE PARITY ALGORITHM",
        body: "R' U2 R U2 R' F2 R U2 R U2 R' F' — This 3-cycle + twist algorithm fixes the single-edge-swap parity case in M2.",
      },
      {
        heading: "WHEN TO APPLY",
        body: "Apply parity after all edges and corners are placed. You'll know you have parity if two edges appear swapped at the end.",
      },
    ],
  },
  {
    id: "practice",
    title: "PRACTICE GUIDE",
    color: "var(--text-dim)",
    content: [
      {
        heading: "STEP 1: LEARN THE LETTERING",
        body: "Memorize the Speffz scheme for edges and corners. Quiz yourself until you can instantly name the letter for any sticker position.",
      },
      {
        heading: "STEP 2: PRACTICE M2 SIGHTED",
        body: "Do M2 solves while looking at the cube. Write down your letter pairs, execute them, check the result. Do this until the execution is automatic.",
      },
      {
        heading: "STEP 3: ADD MEMORIZATION",
        body: "Start timing your memo separately. Use a timer: memo time + execution time. Aim for memo under 60 seconds before going blindfolded.",
      },
      {
        heading: "STEP 4: FIRST BLINDFOLDED ATTEMPT",
        body: "Set a timer. Memorize. Put on the blindfold. Execute. Check. Don't get discouraged — even experienced solvers DNF (Did Not Finish) often.",
      },
    ],
  },
];

export default function BlindSolvePage() {
  const [activeSection, setActiveSection] = useState("intro");

  const section = sections.find(s => s.id === activeSection)!;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link to="/tutorials" className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", textDecoration: "none" }}>
          ← TUTORIALS
        </Link>
        <h1 style={{ fontSize: "1.2rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
          <span className="neon-magenta">BLINDFOLDED</span> SOLVING
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)" }}>
          Memorize the cube. Solve it blind. Impress everyone.
        </p>
      </div>

      {/* Warning box */}
      <div className="alert-retro alert-warning" style={{ marginBottom: "2rem" }}>
        <span className="font-pixel" style={{ fontSize: "0.45rem" }}>
          ⚠ ADVANCED — Recommend mastering CFOP or Roux first before learning BLD
        </span>
      </div>

      {/* Section nav */}
      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "0", borderBottom: "1px solid var(--border)" }}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`tab-retro${activeSection === s.id ? " active" : ""}`}
            onClick={() => setActiveSection(s.id)}
            style={{ borderColor: activeSection === s.id ? s.color : undefined, color: activeSection === s.id ? s.color : undefined }}
          >
            {s.id.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="retro-box" style={{ borderTop: "none", borderColor: section.color }}>
        <h2 style={{ fontSize: "0.7rem", color: section.color, marginBottom: "2rem" }}>{section.title}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {section.content.map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${section.color}`, paddingLeft: "1.5rem" }}>
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: section.color, marginBottom: "0.75rem" }}>
                {item.heading}
              </div>
              <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1.1rem" }}>{item.body}</p>

              {/* Show T-Perm algorithm inline */}
              {item.heading === "THE T-PERM" && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div className="font-retro" style={{ color: "var(--cyan)", fontFamily: "'Press Start 2P', monospace", fontSize: "0.7rem" }}>
                    R U R' U' R' F R2 U' R' U' R U R' F'
                  </div>
                </div>
              )}
              {item.heading === "EDGE PARITY ALGORITHM" && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div className="font-retro" style={{ color: "var(--red)", fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}>
                    R' U2 R U2 R' F2 R U2 R U2 R' F'
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lettering table for lettering section */}
        {activeSection === "lettering" && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "0.55rem", color: "var(--cyan)", marginBottom: "1.5rem" }}>SPEFFZ EDGE LETTERING (FIRST STICKER)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.5rem", marginBottom: "2rem" }}>
              {LETTERING.edges.pieces.map(p => (
                <div key={p.letter} style={{
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  padding: "0.5rem", textAlign: "center"
                }}>
                  <div className="font-pixel" style={{ fontSize: "0.7rem", color: "var(--cyan)" }}>{p.letter}</div>
                  <div className="font-retro" style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>{p.pos}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: "0.55rem", color: "var(--yellow)", marginBottom: "1.5rem" }}>SPEFFZ CORNER LETTERING (FIRST STICKER)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "0.5rem" }}>
              {LETTERING.corners.pieces.slice(0, 12).map(p => (
                <div key={p.letter} style={{
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  padding: "0.5rem", textAlign: "center"
                }}>
                  <div className="font-pixel" style={{ fontSize: "0.7rem", color: "var(--yellow)" }}>{p.letter}</div>
                  <div className="font-retro" style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>{p.pos}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
