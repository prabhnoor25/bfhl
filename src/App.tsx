import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SummaryCard from "./components/SummaryCard";
import GraphInput from "./components/GraphInput";
import HierarchyTree from "./components/HierarchyTree";
import TableCard from "./components/TableCard";
import JsonViewer from "./components/JsonViewer";
import { BfhlResponse, BfhlSummary } from "./types";
import { BookOpen, AlertCircle, Sparkles, Check } from "lucide-react";

const INITIAL_EDGES_DEMO =
`A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;

export default function App() {
  const [inputText, setInputText] = useState(INITIAL_EDGES_DEMO);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<BfhlResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);

  // Helper to add temporary notifications
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Run initial analysis automatically
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const dataLines = inputText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const response = await fetch("bajaj-bfhl-app.onrender.com/api/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataLines }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `API request failed with status ${response.status}`);
      }

      const result: BfhlResponse = await response.json();
      setApiResponse(result);
      addToast("Graph structure analyzed successfully!", "success");
    }
    catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to contact the backend service.");
      addToast(err.message || "Failed to analyze graph structure.", "error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    addToast("Inputs cleared.", "info");
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0c1324] text-gray-800 dark:text-gray-100 min-h-screen font-sans transition-colors duration-300">
      <Navbar/>

      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold tracking-wide animate-slide-in pointer-events-auto transition-all ${
                t.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-700 dark:text-emerald-400"
                  : t.type === "error"
                  ? "bg-rose-500/15 border-rose-500/25 text-rose-700 dark:text-rose-400"
                  : "bg-indigo-500/15 border-indigo-500/25 text-indigo-700 dark:text-[#c0c1ff]"
              }`}
            >
              {t.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              <span>{t.message}</span>
            </div>
          ))}
        </div>

        <section className="text-center md:text-left py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-sans font-bold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-white mb-3">
              Analyze Graph{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 dark:from-[#c0c1ff] dark:to-secondary bg-clip-text text-transparent">
                Structures Instantly
              </span>
            </h1>
            <p className="font-sans text-gray-500 dark:text-gray-400 text-base max-w-2xl leading-relaxed">
              Detect complex cycle paths, build independent tree hierarchies, and validate node structures with our high-density, enterprise-grade modeling engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white dark:text-[#1000a9] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Now
            </button>
            <a
              href="#documentation"
              className="px-6 py-3 bg-white hover:bg-gray-50 dark:bg-[#23293c]/50 dark:hover:bg-[#23293c] border border-gray-200 dark:border-white/5 text-gray-700 dark:text-white font-bold text-sm rounded-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Documentation
            </a>
          </div>
        </section>

        {errorMsg && (
          <div className="p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-200/40 dark:border-rose-500/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-800 dark:text-rose-400 text-sm">
                Analysis Processing Failure
              </h4>
              <p className="text-xs text-rose-600/85 dark:text-rose-400/80 mt-1">
                {errorMsg}
              </p>
            </div>
          </div>
        )}

        {apiResponse && (
          <SummaryCard
            summary={apiResponse.summary}
            invalidCount={apiResponse.invalid_entries.length}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 h-full">
            <GraphInput
              value={inputText}
              onChange={setInputText}
              onSubmit={handleAnalyze}
              onClear={handleClear}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-7 h-full">
            <HierarchyTree
              hierarchies={apiResponse ? apiResponse.hierarchies : []}
            />
          </div>
        </div>

        {apiResponse && (
          <TableCard
            invalidEntries={apiResponse.invalid_entries}
            duplicateEdges={apiResponse.duplicate_edges}
            rawInput={inputText}
          />
        )}

        <JsonViewer json={apiResponse} />

        <section
          id="documentation"
          className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm transition-all duration-300 flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-4">
            <BookOpen className="w-5 h-5 text-indigo-500 dark:text-[#c0c1ff]" />
            <h2 className="font-sans font-bold text-gray-900 dark:text-white text-lg">
              Technical Documentation & Submission Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-6">
            <div>
              <h3 className="font-sans font-bold text-sm text-gray-900 dark:text-white mb-2">
                1. Assignment Identification Credentials
              </h3>
              <ul className="space-y-1 text-gray-500 dark:text-gray-400 font-mono">
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">USER ID:</strong>{" "}
                  prabhnoorsingh_25102005
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">EMAIL:</strong>{" "}
                  prabhnoor2493.be23@chitkara.edu.in
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">ROLL NO:</strong>{" "}
                  2310992493
                </li>
              </ul>

              <h3 className="font-sans font-bold text-sm text-gray-900 dark:text-white mt-6 mb-2">
                2. API Service Interface Specifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Exposes the complete backend API conforming strictly to Round 1 rules:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-500 dark:text-gray-400">
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">POST /api/bfhl:</strong>{" "}
                  Processes edgelist payloads. Supports raw CORS validation from foreign clients.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">GET /api/health:</strong>{" "}
                  Standard health monitoring heartbeat check.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-sans font-bold text-sm text-gray-900 dark:text-white mb-2">
                3. Advanced Graph Algorithm Policies
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <strong>First-Encounter Duplicates:</strong> Keeps first occurrence of an edge. Subsequent exact duplicate edges are captured once in `duplicate_edges` array.
                </li>
                <li>
                  <strong>Multi-Parent Discard (Diamond Rule):</strong> Directed nodes support at most one parent. Subsequent parents for a child are silently discarded to guarantee perfect, cycle-free trees on valid roots.
                </li>
                <li>
                  <strong>Self-Loops & Format:</strong> Validated via strict regex `/^[A-Z]-&gt;[A-Z]$/`. Discards self-loops (e.g. `A-&gt;A`), spaces (trimmed first), or non-uppercase characters.
                </li>
                <li>
                  <strong>Pure Cycles:</strong> Groups with no node of in-degree 0 are classified as cycles, assigning the lexicographically smallest node as root and clearing the depth metrics.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1324] transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto text-xs text-gray-400 dark:text-gray-500 font-mono">
          <div className="mb-4 md:mb-0">
            © 2026 Hierarchy Graph Analyzer. Made With ❤️ By Prabhnoor Singh.
          </div>
        </div>
      </footer>
    </div>
  );
}
