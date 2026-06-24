# Graph Analyzer — Chitkara Full Stack Engineering Challenge

An  **Hierarchy Graph Analyzer** designed for developers. This application parses directed edge relations, resolves complex hierarchies, identifies cyclic dependencies, handles diamond cases, filters duplicates, and renders beautiful interactive visual trees.

Built as a full-stack Node.js + React (Vite) single-deployment application matching the design language of **Kinetic Precision**.

---

## 🚀 Live Credentials
- **User ID:** `prabhnoorsingh_25102005`
- **College Email:** `prabhnoor2493.be23@chitkara.edu.in`
- **College Roll Number:** `2310992493`

---

## 🛠️ Technology Stack
- **Frontend Core:** React 19 + TypeScript
- **Bundling & Tooling:** Vite 6 + esbuild + tsx
- **Backend Service:** Express 4 (fully supporting CORS & dynamic parsing)
- **Styling Architecture:** Tailwind CSS v4 (incorporating glassmorphism & slate-themed technical styling)
- **Iconographies:** Lucide React

---

## 💡 Advanced Graph Processing & Algorithmic Rules

The backend parses the edgelist strings using a highly robust, mathematical cycle-resolution engine that strictly enforces:

1. **Input Trimming & Validation:** Whitespace is trimmed before parsing. Input must strictly match `/^[A-Z]->[A-Z]$/` without self-loops (e.g. `A->A` is filtered to `invalid_entries`).
2. **Duplicate Edge Handling (First Edge Wins):** If an edge appears multiple times (e.g., `["A->B", "A->B"]`), only the first instance is kept for graph construction. Subsequent matches are logged in the `duplicate_edges` table and response array.
3. **Single-Parent Discard (Multi-parent Diamond Rule):** In a directed hierarchy, each node can have at most one parent. If a child node has more than one incoming parent edge (e.g., `A->D` and `B->D`), the first-encountered edge wins. Subsequent parent relationships for that child are silently discarded.
4. **Independent Hierarchy Decomposition:** The resolved graph is parsed into undirected connected components. For each component:
   - If there is **exactly 1 node with in-degree 0**, it is a valid directed tree. We build a recursive nested dictionary structure (`{ "A": { "B": { "D": {} } } }`) and calculate the maximum path depth.
   - If there are **0 nodes with in-degree 0**, the component contains a cycle. The component is classified as a cyclic group with `has_cycle: true` and an empty `tree: {}`, with the root assigned to the lexicographically smallest node.
5. **Tie-Breaker Rule:** For the summary's `largest_tree_root`, if two valid trees have the same depth, the lexicographically smaller root wins.

---

## 📡 API Reference Specifications

### `POST /api/bfhl`
Processes the incoming edge data and returns structured insights.

#### Request Body
```json
{
  "data": [
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ]
}
```

#### Response Payload (Conforms to JSON Scheme)
```json
{
  "user_id": "prabhnoorsingh_25102005",
  "email_id": "prabhnoor2493.be23@chitkara.edu.in",
  "college_roll_number": "2310992493",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": { "E": { "F": {} } } } },
      "depth": 4
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    },
    {
      "root": "P",
      "tree": { "P": { "Q": { "R": {} } } },
      "depth": 3
    },
    {
      "root": "G",
      "tree": { "G": { "H": {}, "I": {} } },
      "depth": 2
    }
  ],
  "invalid_entries": ["hello", "1->2", "A->"],
  "duplicate_edges": ["G->H"],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## 💻 Running the Application

### 1. Installation
Install core project packages:
```bash
npm install
```

### 2. Development Execution
Boot up the full-stack server locally (runs on port 3000):
```bash
npm run dev
```