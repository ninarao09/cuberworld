import { useState, useEffect } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/tutorials.cfop";
import { OLL_ALGORITHMS, PLL_ALGORITHMS, OLL_CATEGORIES, PLL_CATEGORIES } from "../lib/algorithms";
import { getSupabaseServerClient } from "../lib/supabase.server";

export function meta() {
  return [{ title: "CFOP Method | CuberWorld" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = getSupabaseServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    let learnedAlgorithms: string[] = [];
    if (user) {
      const { data } = await supabase
        .from("algorithm_progress")
        .select("algorithm_id")
        .eq("user_id", user.id)
        .eq("learned", true);
      learnedAlgorithms = data?.map((r: any) => r.algorithm_id) ?? [];
    }

    return { user: user ? { id: user.id } : null, learnedAlgorithms };
  } catch {
    return { user: null, learnedAlgorithms: [] };
  }
}

function AlgorithmCard({ algo, isLearned, onToggle, userId }: {
  algo: { id: string; name: string; alg: string; altAlg?: string };
  isLearned: boolean;
  onToggle: (id: string) => void;
  userId: string | null;
}) {
  const fetcher = useFetcher();

  const handleToggle = () => {
    if (!userId) return;
    onToggle(algo.id);
    fetcher.submit(
      { algorithmId: algo.id, learned: String(!isLearned) },
      { method: "post", action: "/api/progress" }
    );
  };

  return (
    <div className={`algo-card${isLearned ? " learned" : ""}`} onClick={userId ? handleToggle : undefined}>
      <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        {algo.id}
      </div>
      <div className="font-retro" style={{ fontSize: "1.1rem", color: "var(--cyan)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
        {algo.alg}
      </div>
      {algo.altAlg && (
        <div className="font-retro" style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
          alt: {algo.altAlg}
        </div>
      )}
      {!userId && (
        <div className="font-pixel" style={{ fontSize: "0.35rem", color: "var(--border)", marginTop: "0.5rem" }}>
          LOGIN TO TRACK
        </div>
      )}
    </div>
  );
}

export default function CFOPPage() {
  const { user, learnedAlgorithms: initialLearned } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<"overview" | "f2l" | "oll" | "pll">("overview");
  const [ollCategory, setOllCategory] = useState<string>("All");
  const [pllCategory, setPllCategory] = useState<string>("All");
  const [learned, setLearned] = useState<Set<string>>(new Set(initialLearned));

  useEffect(() => {
    setLearned(new Set(initialLearned));
  }, [initialLearned]);

  const toggleLearned = (id: string) => {
    setLearned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredOll = ollCategory === "All" ? OLL_ALGORITHMS : OLL_ALGORITHMS.filter(a => a.category === ollCategory);
  const filteredPll = pllCategory === "All" ? PLL_ALGORITHMS : PLL_ALGORITHMS.filter(a => a.category === pllCategory);

  const ollProgress = OLL_ALGORITHMS.filter(a => learned.has(a.id)).length;
  const pllProgress = PLL_ALGORITHMS.filter(a => learned.has(a.id)).length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link to="/tutorials" className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", textDecoration: "none" }}>
          ← TUTORIALS
        </Link>
        <h1 style={{ fontSize: "1.2rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
          CFOP <span className="neon-green">METHOD</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)" }}>
          Cross → First Two Layers → Orient Last Layer → Permute Last Layer
        </p>
      </div>

      {/* Progress (if logged in) */}
      {user && (
        <div className="retro-box" style={{ marginBottom: "2rem", borderColor: "var(--green)" }}>
          <div className="font-pixel" style={{ fontSize: "0.5rem", marginBottom: "1rem" }}>YOUR PROGRESS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)" }}>OLL</span>
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--green)" }}>{ollProgress}/57</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(ollProgress / 57) * 100}%` }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)" }}>PLL</span>
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--cyan)" }}>{pllProgress}/21</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(pllProgress / 21) * 100}%`, background: "linear-gradient(90deg, var(--cyan), var(--magenta))" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0", borderBottom: "1px solid var(--border)" }}>
        {(["overview", "f2l", "oll", "pll"] as const).map(tab => (
          <button key={tab} className={`tab-retro${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="retro-box" style={{ borderTop: "none" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <h2 style={{ fontSize: "0.7rem", marginBottom: "1.5rem" }}>WHAT IS CFOP?</h2>
            <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              CFOP (also known as the Fridrich Method) is the most popular speedcubing method, used by most top competitors.
              The name stands for Cross, F2L (First Two Layers), OLL (Orient Last Layer), and PLL (Permute Last Layer).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { step: "1. CROSS", color: "var(--green)", desc: "Solve the 4 edge pieces on the bottom layer to form a cross. Should be done intuitively without algorithms." },
                { step: "2. F2L", color: "var(--cyan)", desc: "Simultaneously insert the 4 corner-edge pairs into the first two layers. ~40 intuitive cases." },
                { step: "3. OLL", color: "var(--yellow)", desc: "Orient all 9 pieces on the top face so they all show yellow. 57 algorithms." },
                { step: "4. PLL", color: "var(--magenta)", desc: "Permute the last layer pieces to their correct positions. 21 algorithms." },
              ].map(item => (
                <div key={item.step} style={{ borderLeft: `3px solid ${item.color}`, paddingLeft: "1rem" }}>
                  <div className="font-pixel" style={{ fontSize: "0.5rem", color: item.color, marginBottom: "0.5rem" }}>{item.step}</div>
                  <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1rem" }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="retro-box-cyan" style={{ padding: "1rem" }}>
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--cyan)", marginBottom: "0.75rem" }}>LEARNING ROADMAP</div>
              <div className="font-retro" style={{ color: "var(--text-dim)" }}>
                <strong style={{ color: "var(--green)" }}>Beginner:</strong> Learn Cross + intuitive F2L + 2-look OLL (9 algs) + 2-look PLL (6 algs)<br />
                <strong style={{ color: "var(--cyan)" }}>Intermediate:</strong> Full OLL (57 algs) + full PLL (21 algs) + F2L efficiency<br />
                <strong style={{ color: "var(--magenta)" }}>Advanced:</strong> Cross planning, F2L lookahead, CFOP optimization, sub-15s
              </div>
            </div>
          </div>
        )}

        {/* F2L TAB */}
        {activeTab === "f2l" && (
          <div>
            <h2 style={{ fontSize: "0.7rem", marginBottom: "1.5rem" }}>FIRST TWO LAYERS (F2L)</h2>
            <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "1.5rem" }}>
              F2L involves inserting corner-edge pairs into the four slots simultaneously. It is mostly intuitive
              but there are ~41 recognized cases. Focus on understanding rather than memorizing.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  title: "BASIC CONCEPT",
                  content: "Look for a corner and its matching edge. Pair them up above the slot, then insert together. The key is to never break finished pairs.",
                },
                {
                  title: "WHITE STICKER POSITIONS",
                  content: "When the white sticker is on top: R U R' or L' U' L. When white faces front: F U F' U' or similar. When white is hidden: more complex cases.",
                },
                {
                  title: "LOOKAHEAD",
                  content: "The key to fast F2L is lookahead — finding the next pair while inserting the current one. Practice slow and smooth, then build speed.",
                },
                {
                  title: "KEY ALGORITHMS",
                  content: `Insert right slot: R U' R' | Insert left slot: L' U L | White on top: F' U F | Pair connected: R U R'`,
                },
              ].map(item => (
                <div key={item.title} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                  <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--cyan)", marginBottom: "0.5rem" }}>
                    {item.title}
                  </div>
                  <p className="font-retro" style={{ color: "var(--text-dim)" }}>{item.content}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem" }} className="alert-retro">
              <span className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--green)" }}>
                TIP: Practice each F2L case on a solved cube until it's automatic. Then practice with a scrambled cube.
              </span>
            </div>
          </div>
        )}

        {/* OLL TAB */}
        {activeTab === "oll" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "0.7rem", margin: 0 }}>
                OLL ALGORITHMS
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginLeft: "1rem" }}>
                  ({learned.size > 0 ? `${ollProgress}/57 LEARNED` : "57 CASES"})
                </span>
              </h2>
              {!user && (
                <Link to="/login" className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--yellow)" }}>
                  LOGIN TO TRACK PROGRESS
                </Link>
              )}
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {["All", ...OLL_CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setOllCategory(cat)}
                  className="font-pixel"
                  style={{
                    fontSize: "0.4rem", padding: "0.3rem 0.6rem",
                    background: ollCategory === cat ? "rgba(0,255,65,0.15)" : "transparent",
                    border: `1px solid ${ollCategory === cat ? "var(--green)" : "var(--border)"}`,
                    color: ollCategory === cat ? "var(--green)" : "var(--text-dim)",
                    cursor: "pointer",
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {filteredOll.map(algo => (
                <AlgorithmCard
                  key={algo.id}
                  algo={algo}
                  isLearned={learned.has(algo.id)}
                  onToggle={toggleLearned}
                  userId={user?.id ?? null}
                />
              ))}
            </div>

            {user && (
              <div className="font-retro" style={{ marginTop: "1rem", color: "var(--text-dim)", fontSize: "0.9rem" }}>
                Click any algorithm card to mark it as learned. Progress is saved automatically.
              </div>
            )}
          </div>
        )}

        {/* PLL TAB */}
        {activeTab === "pll" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "0.7rem", margin: 0 }}>
                PLL ALGORITHMS
                <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginLeft: "1rem" }}>
                  ({pllProgress}/21 LEARNED)
                </span>
              </h2>
              {!user && (
                <Link to="/login" className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--yellow)" }}>
                  LOGIN TO TRACK PROGRESS
                </Link>
              )}
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {["All", ...PLL_CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setPllCategory(cat)}
                  className="font-pixel"
                  style={{
                    fontSize: "0.4rem", padding: "0.3rem 0.6rem",
                    background: pllCategory === cat ? "rgba(0,255,255,0.15)" : "transparent",
                    border: `1px solid ${pllCategory === cat ? "var(--cyan)" : "var(--border)"}`,
                    color: pllCategory === cat ? "var(--cyan)" : "var(--text-dim)",
                    cursor: "pointer",
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
              {filteredPll.map(algo => (
                <div key={algo.id} className={`algo-card${learned.has(algo.id) ? " learned" : ""}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)" }}>{algo.id}</span>
                    {algo.probability && (
                      <span className="font-pixel" style={{ fontSize: "0.35rem", color: "var(--border)" }}>{algo.probability}</span>
                    )}
                  </div>
                  <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--magenta)", marginBottom: "0.5rem" }}>{algo.name}</div>
                  <div className="font-retro" style={{ fontSize: "1rem", color: "var(--cyan)", marginBottom: "0.5rem" }}>{algo.alg}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <span className="font-pixel" style={{ fontSize: "0.35rem", color: "var(--border)" }}>{algo.category}</span>
                    {user && (
                      <button
                        className="font-pixel"
                        style={{
                          fontSize: "0.35rem", padding: "0.2rem 0.5rem",
                          background: learned.has(algo.id) ? "rgba(0,255,65,0.15)" : "transparent",
                          border: `1px solid ${learned.has(algo.id) ? "var(--green)" : "var(--border)"}`,
                          color: learned.has(algo.id) ? "var(--green)" : "var(--text-dim)",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleLearned(algo.id)}
                      >
                        {learned.has(algo.id) ? "✓ LEARNED" : "MARK LEARNED"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
