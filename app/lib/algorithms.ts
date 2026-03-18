export interface Algorithm {
  id: string;
  name: string;
  category: string;
  alg: string;
  altAlg?: string;
  probability?: string;
}

// ─── OLL (57 cases) ────────────────────────────────────────────────────────
export const OLL_ALGORITHMS: Algorithm[] = [
  // DOT cases
  { id: "OLL-1",  name: "OLL 1",  category: "Dot", alg: "R U2 R2 F R F' U2 R' F R F'" },
  { id: "OLL-2",  name: "OLL 2",  category: "Dot", alg: "F R U R' U' F' f R U R' U' f'" },
  { id: "OLL-3",  name: "OLL 3",  category: "Dot", alg: "f R U R' U' f' U' F R U R' U' F'" },
  { id: "OLL-4",  name: "OLL 4",  category: "Dot", alg: "f R U R' U' f' U F R U R' U' F'" },

  // LINE cases
  { id: "OLL-5",  name: "OLL 5",  category: "Line", alg: "r' U2 R U R' U r" },
  { id: "OLL-6",  name: "OLL 6",  category: "Line", alg: "r U2 R' U' R U' r'" },
  { id: "OLL-7",  name: "OLL 7",  category: "Line", alg: "r U R' U R U2 r'" },
  { id: "OLL-8",  name: "OLL 8",  category: "Line", alg: "r' U' R U' R' U2 r" },
  { id: "OLL-9",  name: "OLL 9",  category: "Line", alg: "R U R' U' R' F R2 U R' U' F'" },
  { id: "OLL-10", name: "OLL 10", category: "Line", alg: "R U R' U R' F R F' R U2 R'" },
  { id: "OLL-11", name: "OLL 11", category: "Line", alg: "r' R2 U R' U R U2 R' U M'" },
  { id: "OLL-12", name: "OLL 12", category: "Line", alg: "M' R' U' R U' R' U2 R U' M" },

  // CROSS cases (cross already done, orient corners)
  { id: "OLL-13", name: "OLL 13", category: "Cross", alg: "F U R U' R2 F' R U R U' R'" },
  { id: "OLL-14", name: "OLL 14", category: "Cross", alg: "R' F R U R' F' R F U' F'" },
  { id: "OLL-15", name: "OLL 15", category: "Cross", alg: "r' U' r R' U' R U r' U r" },
  { id: "OLL-16", name: "OLL 16", category: "Cross", alg: "r U r' R U R' U' r U' r'" },
  { id: "OLL-17", name: "OLL 17", category: "Cross", alg: "F R' F' R2 r' U R U' R' U' M'" },
  { id: "OLL-18", name: "OLL 18", category: "Cross", alg: "r U R' U R U2 r2 U' R U' R' U2 r" },
  { id: "OLL-19", name: "OLL 19", category: "Cross", alg: "r' R U R U R' U' r R2 F R F'" },
  { id: "OLL-20", name: "OLL 20", category: "Cross", alg: "r U R' U' r' F R F' M U R U' R'" },

  // T-SHAPE
  { id: "OLL-21", name: "OLL 21 (Headlights)", category: "T-Shape", alg: "R U2 R' U' R U R' U' R U' R'" },
  { id: "OLL-22", name: "OLL 22 (Pi)",         category: "T-Shape", alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { id: "OLL-23", name: "OLL 23 (Sune)",        category: "T-Shape", alg: "R U R' U R U2 R'" },
  { id: "OLL-24", name: "OLL 24 (Anti-Sune)",   category: "T-Shape", alg: "R U2 R' U' R U' R'" },
  { id: "OLL-25", name: "OLL 25",               category: "T-Shape", alg: "x' R U' R' D R U R' D' x" },
  { id: "OLL-26", name: "OLL 26 (Double Sune)", category: "T-Shape", alg: "R U2 R' U' R U' R' U' R U' R'" },
  { id: "OLL-27", name: "OLL 27",               category: "T-Shape", alg: "R U R' U R U2 R' U R U R'" },

  // SQUARE cases
  { id: "OLL-28", name: "OLL 28", category: "Square", alg: "r U R' U' r' R U R U' R'" },
  { id: "OLL-29", name: "OLL 29", category: "Square", alg: "R U R' U' R U' R' F' U' F R U R'" },
  { id: "OLL-30", name: "OLL 30", category: "Square", alg: "F R' F R2 U' R' U' R U R' F2" },
  { id: "OLL-31", name: "OLL 31", category: "Square", alg: "R' U' F U R U' R' F' R" },
  { id: "OLL-32", name: "OLL 32", category: "Square", alg: "L U F' U' L' U L F L'" },
  { id: "OLL-33", name: "OLL 33 (T)", category: "Square", alg: "R U R' U' R' F R F'" },
  { id: "OLL-34", name: "OLL 34", category: "Square", alg: "R U R2 U' R' F R U R U' F'" },
  { id: "OLL-35", name: "OLL 35 (Fish)", category: "Square", alg: "R U2 R2 F R F' R U2 R'" },
  { id: "OLL-36", name: "OLL 36", category: "Square", alg: "R' U' R U' R' U R U l U' R' U x" },
  { id: "OLL-37", name: "OLL 37 (Fish)", category: "Square", alg: "F R' F' R U R U' R'" },

  // SMALL L cases
  { id: "OLL-38", name: "OLL 38", category: "Small L", alg: "R U R' U R U' R' U' R' F R F'" },
  { id: "OLL-39", name: "OLL 39", category: "Small L", alg: "L F' L' U' L U F U' L'" },
  { id: "OLL-40", name: "OLL 40", category: "Small L", alg: "R' F R U R' U' F' U R" },
  { id: "OLL-41", name: "OLL 41", category: "Small L", alg: "R U R' U R U2 R' F R U R' U' F'" },
  { id: "OLL-42", name: "OLL 42", category: "Small L", alg: "R' U' R U' R' U2 R F R U R' U' F'" },
  { id: "OLL-43", name: "OLL 43 (P)", category: "Small L", alg: "R' U' F' U F R" },
  { id: "OLL-44", name: "OLL 44 (P)", category: "Small L", alg: "F U R U' R' F'" },
  { id: "OLL-45", name: "OLL 45 (T)", category: "Small L", alg: "F R U R' U' F'" },
  { id: "OLL-46", name: "OLL 46", category: "Small L", alg: "R' U' R' F R F' U R" },
  { id: "OLL-47", name: "OLL 47", category: "Small L", alg: "F' L' U' L U L' U' L U F" },
  { id: "OLL-48", name: "OLL 48", category: "Small L", alg: "F R U R' U' R U R' U' F'" },
  { id: "OLL-49", name: "OLL 49", category: "Small L", alg: "r U' r2 U r2 U r2 U' r" },
  { id: "OLL-50", name: "OLL 50", category: "Small L", alg: "r' U r2 U' r2 U' r2 U r'" },
  { id: "OLL-51", name: "OLL 51 (Sword)", category: "Small L", alg: "f R U R' U' R U R' U' f'" },
  { id: "OLL-52", name: "OLL 52", category: "Small L", alg: "R U R' U R U' B U' B' R'" },
  { id: "OLL-53", name: "OLL 53", category: "Small L", alg: "l' U2 L U L' U l" },
  { id: "OLL-54", name: "OLL 54", category: "Small L", alg: "r U2 R' U' R U' r'" },
  { id: "OLL-55", name: "OLL 55", category: "Small L", alg: "R U2 R2 U' R U' R' U2 F R F'" },
  { id: "OLL-56", name: "OLL 56 (Aligned)", category: "Small L", alg: "F R U R' U' R F' r U R' U' r'" },
  { id: "OLL-57", name: "OLL 57 (H)", category: "Small L", alg: "R U R' U' M' U R U' r'" },
];

// ─── PLL (21 cases) ────────────────────────────────────────────────────────
export const PLL_ALGORITHMS: Algorithm[] = [
  // EDGE PERMUTATION
  { id: "PLL-Ua", name: "Ua Perm", category: "Edge", alg: "M2 U M U2 M' U M2", probability: "1/18" },
  { id: "PLL-Ub", name: "Ub Perm", category: "Edge", alg: "M2 U' M U2 M' U' M2", probability: "1/18" },
  { id: "PLL-H",  name: "H Perm",  category: "Edge", alg: "M2 U M2 U2 M2 U M2", probability: "1/72" },
  { id: "PLL-Z",  name: "Z Perm",  category: "Edge", alg: "M' U M2 U M2 U M' U2 M2", probability: "1/36" },

  // CORNER PERMUTATION
  { id: "PLL-Aa", name: "Aa Perm", category: "Corner", alg: "x R' U R' D2 R U' R' D2 R2 x'", probability: "1/18" },
  { id: "PLL-Ab", name: "Ab Perm", category: "Corner", alg: "x R2 D2 R U R' D2 R U' R x'", probability: "1/18" },
  { id: "PLL-E",  name: "E Perm",  category: "Corner", alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x", probability: "1/36" },

  // ADJ CORNER + ADJ EDGE
  { id: "PLL-T",  name: "T Perm",  category: "Adj+Adj", alg: "R U R' U' R' F R2 U' R' U' R U R' F'", probability: "1/18" },
  { id: "PLL-F",  name: "F Perm",  category: "Adj+Adj", alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", probability: "1/18" },
  { id: "PLL-Jb", name: "Jb Perm", category: "Adj+Adj", alg: "R U R' F' R U R' U' R' F R2 U' R' U'", probability: "1/18" },
  { id: "PLL-Ja", name: "Ja Perm", category: "Adj+Adj", alg: "x R2 F R F' R U2 r' U r U2 x'", probability: "1/18" },
  { id: "PLL-Ra", name: "Ra Perm", category: "Adj+Adj", alg: "R U' R' U' R U R D R' U' R D' R' U2 R' U'", probability: "1/18" },
  { id: "PLL-Rb", name: "Rb Perm", category: "Adj+Adj", alg: "R' U2 R U2 R' F R U R' U' R' F' R2 U'", probability: "1/18" },

  // OPP CORNER + ADJ EDGE
  { id: "PLL-V",  name: "V Perm",  category: "Opp+Adj", alg: "R' U R' U' y R' F' R2 U' R' U R' F R F", probability: "1/18" },
  { id: "PLL-Y",  name: "Y Perm",  category: "Opp+Adj", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", probability: "1/18" },
  { id: "PLL-Na", name: "Na Perm", category: "Opp+Adj", alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", probability: "1/72" },
  { id: "PLL-Nb", name: "Nb Perm", category: "Opp+Adj", alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R", probability: "1/72" },

  // G PERMS
  { id: "PLL-Ga", name: "Ga Perm", category: "G-Perm", alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'", probability: "1/18" },
  { id: "PLL-Gb", name: "Gb Perm", category: "G-Perm", alg: "R' U' R U D' R2 U R' U R U' R U' R2 D", probability: "1/18" },
  { id: "PLL-Gc", name: "Gc Perm", category: "G-Perm", alg: "R2 U' R U' R U R' U R2 U D' R U' R' D", probability: "1/18" },
  { id: "PLL-Gd", name: "Gd Perm", category: "G-Perm", alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'", probability: "1/18" },
];

export const OLL_CATEGORIES = [...new Set(OLL_ALGORITHMS.map(a => a.category))];
export const PLL_CATEGORIES = [...new Set(PLL_ALGORITHMS.map(a => a.category))];
