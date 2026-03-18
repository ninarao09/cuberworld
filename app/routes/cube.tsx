import { useEffect, useRef, useState, useCallback } from "react";

export function meta() {
  return [{ title: "Virtual 3D Cube | CuberWorld" }];
}

// ─── Cube Logic ──────────────────────────────────────────────────────────────

type Color = "W" | "Y" | "G" | "B" | "R" | "O";
type FaceKey = "U" | "D" | "F" | "B" | "R" | "L";

interface CubeState {
  U: Color[][]; // white
  D: Color[][]; // yellow
  F: Color[][]; // green
  B: Color[][]; // blue
  R: Color[][]; // red
  L: Color[][]; // orange
}

const COLOR_MAP: Record<Color, number> = {
  W: 0xffffff, Y: 0xffdd00, G: 0x00cc44,
  B: 0x0055ff, R: 0xee1111, O: 0xff8800,
};


function initCube(): CubeState {
  const face = (c: Color): Color[][] => Array.from({ length: 3 }, () => Array(3).fill(c));
  return { U: face("W"), D: face("Y"), F: face("G"), B: face("B"), R: face("R"), L: face("O") };
}

function rotateFaceCW(face: Color[][]): Color[][] {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

function applyMove(state: CubeState, move: string): CubeState {
  const s = JSON.parse(JSON.stringify(state)) as CubeState;
  const isPrime = move.endsWith("'");
  const isDouble = move.endsWith("2");
  const base = move.replace(/[' 2]/g, "") as FaceKey;

  const doMove = (st: CubeState, face: FaceKey): CubeState => {
    const t = JSON.parse(JSON.stringify(st)) as CubeState;
    switch (face) {
      case "U": {
        t.U = rotateFaceCW(st.U);
        const row = (f: FaceKey) => [st[f][0][0], st[f][0][1], st[f][0][2]];
        t.F[0] = row("R"); t.L[0] = row("F"); t.B[0] = row("L"); t.R[0] = row("B");
        return t;
      }
      case "D": {
        t.D = rotateFaceCW(st.D);
        const row = (f: FaceKey) => [st[f][2][0], st[f][2][1], st[f][2][2]];
        t.B[2] = row("R"); t.R[2] = row("F"); t.F[2] = row("L"); t.L[2] = row("B");
        return t;
      }
      case "F": {
        t.F = rotateFaceCW(st.F);
        const [UL, UM, UR] = [st.U[2][0], st.U[2][1], st.U[2][2]];
        const [RL0, RL1, RL2] = [st.R[0][0], st.R[1][0], st.R[2][0]];
        t.U[2][0] = st.L[0][2]; t.U[2][1] = st.L[1][2]; t.U[2][2] = st.L[2][2];
        t.R[0][0] = UL; t.R[1][0] = UM; t.R[2][0] = UR;
        t.D[0][0] = RL2; t.D[0][1] = RL1; t.D[0][2] = RL0;
        t.L[0][2] = st.D[0][2]; t.L[1][2] = st.D[0][1]; t.L[2][2] = st.D[0][0];
        return t;
      }
      case "B": {
        t.B = rotateFaceCW(st.B);
        const [UL, UM, UR] = [st.U[0][0], st.U[0][1], st.U[0][2]];
        t.U[0][0] = st.R[0][2]; t.U[0][1] = st.R[1][2]; t.U[0][2] = st.R[2][2];
        t.L[0][0] = UR; t.L[1][0] = UM; t.L[2][0] = UL;
        t.D[2][0] = st.L[0][0]; t.D[2][1] = st.L[1][0]; t.D[2][2] = st.L[2][0];
        t.R[0][2] = st.D[2][2]; t.R[1][2] = st.D[2][1]; t.R[2][2] = st.D[2][0];
        return t;
      }
      case "R": {
        t.R = rotateFaceCW(st.R);
        for (let i = 0; i < 3; i++) {
          const uOld = st.U[i][2];
          const fOld = st.F[i][2];
          const dOld = st.D[i][2];
          const bOld = st.B[2 - i][0];
          t.U[i][2] = fOld;
          t.F[i][2] = dOld;
          t.D[i][2] = bOld;
          t.B[2 - i][0] = uOld;
        }
        return t;
      }
      case "L": {
        t.L = rotateFaceCW(st.L);
        for (let i = 0; i < 3; i++) {
          const uOld = st.U[i][0];
          const fOld = st.F[i][0];
          const dOld = st.D[i][0];
          const bOld = st.B[2 - i][2];
          t.U[i][0] = bOld;
          t.F[i][0] = uOld;
          t.D[i][0] = fOld;
          t.B[2 - i][2] = dOld;
        }
        return t;
      }
      default:
        return t;
    }
  };

  let result = s;
  const times = isDouble ? 2 : 1;
  const face = base as FaceKey;
  for (let i = 0; i < times; i++) {
    result = isPrime ? doMove(doMove(doMove(result, face), face), face) : doMove(result, face);
  }
  return result;
}

const MOVES = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"];

function generateScramble(length = 20): string {
  const scramble: string[] = [];
  let lastFace = "";
  for (let i = 0; i < length; i++) {
    let move: string;
    do {
      move = MOVES[Math.floor(Math.random() * MOVES.length)];
    } while (move[0] === lastFace);
    lastFace = move[0];
    scramble.push(move);
  }
  return scramble.join(" ");
}

// ─── Move computation from drag ─────────────────────────────────────────────

function computeMove(
  THREE: any, camera: any,
  faceIndex: number, cubiePos: any,
  dx: number, dy: number
): string | null {
  // BoxGeometry material order: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
  const faceNormals = [
    [1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],
  ];
  if (faceIndex < 0 || faceIndex >= 6) return null;
  const [nx,ny,nz] = faceNormals[faceIndex];
  const faceNormal = new THREE.Vector3(nx,ny,nz);

  // Screen drag → world space using camera axes
  const camRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const camUp    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
  const drag = new THREE.Vector3()
    .addScaledVector(camRight, dx)
    .addScaledVector(camUp, -dy); // screen Y inverted

  // Project onto face plane
  drag.addScaledVector(faceNormal, -drag.dot(faceNormal));
  if (drag.length() < 0.001) return null;
  drag.normalize();

  // Rotation axis = face_normal × drag (right-hand rule)
  const rotAxis = new THREE.Vector3().crossVectors(faceNormal, drag).normalize();

  // Find closest world axis
  const candidates = [
    new THREE.Vector3(1,0,0), new THREE.Vector3(-1,0,0),
    new THREE.Vector3(0,1,0), new THREE.Vector3(0,-1,0),
    new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,-1),
  ];
  let best = candidates[0], bestDot = rotAxis.dot(candidates[0]);
  for (const c of candidates) { const d = rotAxis.dot(c); if (d > bestDot) { bestDot = d; best = c; } }

  const px = Math.round(cubiePos.x);
  const py = Math.round(cubiePos.y);
  const pz = Math.round(cubiePos.z);

  // +Y: U/D',  -Y: U'/D
  // +X: R/L',  -X: R'/L
  // +Z: F'/B,  -Z: F/B'
  if (best.y > 0.5)  return py === 1 ? "U'" : py === -1 ? "D"  : null;
  if (best.y < -0.5) return py === 1 ? "U"  : py === -1 ? "D'" : null;
  if (best.x > 0.5)  return px === 1 ? "R"  : px === -1 ? "L'" : null;
  if (best.x < -0.5) return px === 1 ? "R'" : px === -1 ? "L"  : null;
  if (best.z > 0.5)  return pz === 1 ? "F'" : pz === -1 ? "B"  : null;
  if (best.z < -0.5) return pz === 1 ? "F"  : pz === -1 ? "B'" : null;
  return null;
}

// ─── 3D Cube Component ──────────────────────────────────────────────────────

function ThreeCube({ cubeState, onMove }: { cubeState: CubeState; onMove: (m: string) => void }) {
  const mountRef     = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<any>(null);
  const stateRef     = useRef(cubeState);   // always current state
  const onMoveRef    = useRef(onMove);

  // Keep refs in sync
  useEffect(() => { onMoveRef.current = onMove; }, [onMove]);

  // Rebuild cube visuals whenever state changes
  useEffect(() => {
    stateRef.current = cubeState;
    if (!sceneRef.current) return;
    const { scene, THREE } = sceneRef.current;
    scene.children
      .filter((c: any) => c.userData?.isCubie)
      .forEach((c: any) => scene.remove(c));
    buildCube(scene, THREE, cubeState);
  }, [cubeState]);

  useEffect(() => {
    if (!mountRef.current) return;
    let animId: number;
    let mounted = true;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (!mounted || !mountRef.current) return;

      const width  = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight || 480;

      const scene  = new THREE.Scene();
      scene.background = new THREE.Color(0x060f06);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(4, 4, 5);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 4;
      controls.maxDistance = 12;

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);
      const grid = new THREE.GridHelper(20, 20, 0x002200, 0x001100);
      grid.position.y = -2.5;
      scene.add(grid);

      sceneRef.current = { scene, camera, renderer, controls, THREE };

      // Build with latest state (use ref in case scramble was pressed during load)
      buildCube(scene, THREE, stateRef.current);

      // ── Mouse drag for face rotation ──────────────────────────────────────
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let dragStart: { x: number; y: number } | null = null;
      let hitFaceIndex = -1;
      let hitCubiePos: any = null;

      renderer.domElement.addEventListener("mousedown", (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.set(
          ((e.clientX - rect.left) / rect.width)  * 2 - 1,
         -((e.clientY - rect.top)  / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const cubies = scene.children.filter((c: any) => c.userData?.isCubie);
        const hits = raycaster.intersectObjects(cubies, false);
        if (hits.length > 0) {
          hitFaceIndex = hits[0].face?.materialIndex ?? -1;
          hitCubiePos  = hits[0].object.position.clone();
          dragStart    = { x: e.clientX, y: e.clientY };
          controls.enabled = false;
        }
      });

      renderer.domElement.addEventListener("mouseup", (e: MouseEvent) => {
        if (dragStart && hitFaceIndex >= 0 && hitCubiePos) {
          const dx = e.clientX - dragStart.x;
          const dy = e.clientY - dragStart.y;
          if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
            const move = computeMove(THREE, camera, hitFaceIndex, hitCubiePos, dx, dy);
            if (move) onMoveRef.current(move);
          }
        }
        dragStart = null; hitFaceIndex = -1; hitCubiePos = null;
        controls.enabled = true;
      });

      renderer.domElement.addEventListener("mouseleave", () => {
        dragStart = null; hitFaceIndex = -1; hitCubiePos = null;
        controls.enabled = true;
      });
      // ─────────────────────────────────────────────────────────────────────

      const animate = () => {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // store cleanup
      (sceneRef.current as any)._cleanup = () => {
        window.removeEventListener("resize", onResize);
      };
    })();

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      if (sceneRef.current) {
        (sceneRef.current as any)._cleanup?.();
        sceneRef.current.renderer.dispose();
        if (mountRef.current?.contains(sceneRef.current.renderer.domElement)) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current = null;
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "480px", cursor: "grab" }} />;
}

function buildCube(scene: any, THREE: any, state: CubeState) {
  const GAP = 0.05;
  const SIZE = 1;

  // Face-to-position mapping: which cubies belong to which face
  // Cubie positions: [x, y, z] ∈ {-1, 0, 1}
  // Face sticker colors indexed by [row][col] looking at the face straight on

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // skip core

        const geometry = new THREE.BoxGeometry(SIZE - GAP, SIZE - GAP, SIZE - GAP);
        const materials = [
          // right (+x), left (-x), top (+y), bottom (-y), front (+z), back (-z)
          getFaceMaterial(THREE, x, y, z, "R", state),
          getFaceMaterial(THREE, x, y, z, "L", state),
          getFaceMaterial(THREE, x, y, z, "U", state),
          getFaceMaterial(THREE, x, y, z, "D", state),
          getFaceMaterial(THREE, x, y, z, "F", state),
          getFaceMaterial(THREE, x, y, z, "B", state),
        ];

        const cubie = new THREE.Mesh(geometry, materials);
        cubie.position.set(x, y, z);
        cubie.userData = { isCubie: true };
        scene.add(cubie);
      }
    }
  }
}

// Map cubie position to face sticker color
// Verified mappings consistent with move logic:
//   U(y=1):  U[z+1][x+1]       D(y=-1): D[1-z][x+1]
//   F(z=1):  F[1-y][x+1]       B(z=-1): B[1-y][1-x]
//   R(x=1):  R[1-y][z+1]       L(x=-1): L[1-y][z+1]
// All indices guaranteed in [0,2] for x,y,z ∈ {-1,0,1}
function getFaceMaterial(THREE: any, x: number, y: number, z: number, face: FaceKey, state: CubeState) {
  let color = 0x111111; // black (interior)

  if (face === "R" && x === 1)  color = COLOR_MAP[state.R[1 - y][z + 1]];
  if (face === "L" && x === -1) color = COLOR_MAP[state.L[1 - y][z + 1]];
  if (face === "U" && y === 1)  color = COLOR_MAP[state.U[z + 1][x + 1]];
  if (face === "D" && y === -1) color = COLOR_MAP[state.D[1 - z][x + 1]];
  if (face === "F" && z === 1)  color = COLOR_MAP[state.F[1 - y][x + 1]];
  if (face === "B" && z === -1) color = COLOR_MAP[state.B[1 - y][1 - x]];

  return new THREE.MeshLambertMaterial({ color });
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CubePage() {
  const [cubeState, setCubeState] = useState<CubeState>(initCube);
  const [scramble, setScramble] = useState("");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const doMove = useCallback((move: string) => {
    setCubeState(prev => applyMove(prev, move));
    setMoveHistory(prev => [...prev.slice(-29), move]);
  }, []);

  const handleScramble = () => {
    const sc = generateScramble();
    setScramble(sc);
    let state = initCube();
    sc.split(" ").forEach(m => { state = applyMove(state, m); });
    setCubeState(state);
    setMoveHistory(sc.split(" "));
  };

  const handleReset = () => {
    setCubeState(initCube());
    setMoveHistory([]);
    setScramble("");
  };

  const MOVE_GROUPS = [
    { label: "U", moves: ["U", "U'", "U2"] },
    { label: "D", moves: ["D", "D'", "D2"] },
    { label: "R", moves: ["R", "R'", "R2"] },
    { label: "L", moves: ["L", "L'", "L2"] },
    { label: "F", moves: ["F", "F'", "F2"] },
    { label: "B", moves: ["B", "B'", "B2"] },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          VIRTUAL <span className="neon-cyan">3D CUBE</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)" }}>
          Drag to rotate view · Click moves below to turn faces · Scramble to practice
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
        {/* Cube viewport */}
        <div>
          <div className="retro-box-cyan" style={{ padding: "0", overflow: "hidden" }}>
            {isClient ? (
              <ThreeCube cubeState={cubeState} onMove={doMove} />
            ) : (
              <div style={{ height: "480px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner" />
              </div>
            )}
          </div>

          {/* Move buttons */}
          <div style={{ marginTop: "1rem" }}>
            <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginBottom: "0.75rem" }}>
              FACE MOVES
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {MOVE_GROUPS.map(group => (
                <div key={group.label} style={{ display: "flex", gap: "0.25rem", background: "var(--bg2)", padding: "0.5rem", border: "1px solid var(--border)" }}>
                  <span className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", alignSelf: "center", minWidth: "16px" }}>{group.label}</span>
                  {group.moves.map(m => (
                    <button
                      key={m}
                      onClick={() => doMove(m)}
                      className="font-pixel"
                      style={{
                        fontSize: "0.5rem", padding: "0.3rem 0.5rem",
                        background: "transparent", border: "1px solid var(--border)",
                        color: "var(--cyan)", cursor: "pointer",
                        transition: "all 0.1s",
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.borderColor = "var(--cyan)";
                        (e.target as HTMLButtonElement).style.background = "rgba(0,255,255,0.1)";
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
                        (e.target as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Controls */}
          <div className="retro-box">
            <div className="font-pixel" style={{ fontSize: "0.5rem", marginBottom: "1rem" }}>CONTROLS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button className="btn-retro btn-retro-cyan" onClick={handleScramble} style={{ width: "100%" }}>
                ⚡ SCRAMBLE
              </button>
              <button className="btn-retro" onClick={handleReset} style={{ width: "100%" }}>
                ↺ RESET
              </button>
            </div>
          </div>

          {/* Scramble */}
          {scramble && (
            <div className="retro-box" style={{ borderColor: "var(--yellow)" }}>
              <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--yellow)", marginBottom: "0.75rem" }}>SCRAMBLE</div>
              <div className="font-retro" style={{ fontSize: "0.9rem", color: "var(--cyan)", wordBreak: "break-all", lineHeight: 1.8 }}>
                {scramble.split(" ").map((m, i) => (
                  <span key={i} className="move-chip" style={{ marginBottom: "0.25rem" }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Move history */}
          <div className="retro-box">
            <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginBottom: "0.75rem" }}>
              MOVE HISTORY
              {moveHistory.length > 0 && (
                <span style={{ marginLeft: "0.5rem", color: "var(--border)" }}>({moveHistory.length})</span>
              )}
            </div>
            {moveHistory.length === 0 ? (
              <div className="font-retro" style={{ color: "var(--border)" }}>No moves yet</div>
            ) : (
              <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {moveHistory.map((m, i) => (
                  <span key={i} className="move-chip" style={{ fontSize: "0.5rem" }}>{m}</span>
                ))}
              </div>
            )}
          </div>

          {/* Cube net preview */}
          <div className="retro-box">
            <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginBottom: "0.75rem" }}>CUBE NET</div>
            <CubeNet state={cubeState} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2D net of the cube
function CubeNet({ state }: { state: CubeState }) {
  const SIZE = 14;
  const GAP = 1;
  const CELL = SIZE + GAP;

  const faceLayout: { face: FaceKey; row: number; col: number }[] = [
    { face: "U", row: 0, col: 3 },
    { face: "L", row: 3, col: 0 },
    { face: "F", row: 3, col: 3 },
    { face: "R", row: 3, col: 6 },
    { face: "B", row: 3, col: 9 },
    { face: "D", row: 6, col: 3 },
  ];

  return (
    <div style={{ position: "relative", height: `${9 * CELL}px`, width: `${12 * CELL}px` }}>
      {faceLayout.map(({ face, row, col }) =>
        state[face].map((rowArr, r) =>
          rowArr.map((color, c) => {
            const x = (col + c) * CELL;
            const y = (row + r) * CELL;
            const colorHex = "#" + COLOR_MAP[color].toString(16).padStart(6, "0");
            return (
              <div
                key={`${face}${r}${c}`}
                style={{
                  position: "absolute",
                  left: x, top: y,
                  width: SIZE, height: SIZE,
                  background: colorHex,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
              />
            );
          })
        )
      )}
    </div>
  );
}
