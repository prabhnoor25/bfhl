import React from "react";
import { Play, Trash2, Code2, HelpCircle } from "lucide-react";

interface GraphInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function GraphInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
}: GraphInputProps) {
  const lineCount = value.trim() ? value.split("\n").length : 0;

  const samples = [
    {
      label: "Full PDF Sample",
      data: `A->B
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
A->`,
      description: "Includes multiple independent trees, a cycle, duplicates, and invalid lines.",
    },
    {
      label: "Cycle Only",
      data: `B->C
C->D
D->B`,
      description: "A simple pure cycle where node B, C, D have in-degree 1. Assigns smallest node (B) as root.",
    },
    {
      label: "Multi-Parent / Diamond",
      data: `A->D
B->D
A->B`,
      description: "D has parent A and B. First parent encountered wins. Resolves cleanly to a tree rooted at A.",
    },
    {
      label: "Duplicate Edges",
      data: `A->B
A->B
A->B
B->C`,
      description: "Repeated edges are kept on first encounter and duplicates tracked cleanly.",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500 dark:text-[#c0c1ff]" />
          <h2 className="font-sans font-bold text-gray-900 dark:text-white text-base">
            Input Graph (Edgelist)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#070d1f] px-2 py-1 rounded-lg font-semibold">
            {lineCount} LINES
          </span>
          <span className="font-mono text-[10px] tracking-wider text-indigo-600 dark:text-[#c0c1ff] bg-indigo-50 dark:bg-[#151b2d] px-2 py-1 rounded-lg font-semibold">
            EDGELIST
          </span>
        </div>
      </div>

      <div className="flex-grow relative group min-h-[300px] flex flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full flex-grow bg-gray-50 dark:bg-[#070d1f] text-gray-800 dark:text-white font-mono text-sm p-4 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none placeholder:text-gray-400 dark:placeholder:text-outline/30 outline-none transition-all duration-300"
          placeholder={`A->B\nA->C\nB->D\nC->D\nD->A`}
          id="edgelist-textarea"
        />
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Load Demo Presets
        </div>
        <div className="grid grid-cols-2 gap-2">
          {samples.map((sample, index) => (
            <button
              key={index}
              onClick={() => onChange(sample.data)}
              className="text-left p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#23293c]/50 dark:hover:bg-[#23293c] rounded-xl border border-gray-100 dark:border-white/5 transition-colors group cursor-pointer"
              title={sample.description}
            >
              <div className="text-xs font-bold text-gray-700 dark:text-[#c0c1ff] group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                {sample.label}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {sample.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 dark:from-indigo-500 dark:to-[#c0c1ff] text-white dark:text-[#1000a9] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          id="analyze-submit-btn"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          {isLoading ? "Analyzing..." : "Analyze Graph"}
        </button>
        <button
          onClick={onClear}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl border border-gray-200 dark:border-white/10 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          id="clear-input-btn"
          title="Clear Input"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
