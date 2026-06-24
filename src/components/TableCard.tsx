import React from "react";
import { AlertCircle, Layers } from "lucide-react";

interface TableCardProps {
  invalidEntries: string[];
  duplicateEdges: string[];
  rawInput: string;
}

function getInvalidReason(entry: string): string {
  const trimmed = entry.trim();
  if (trimmed === "") return "Empty string";
  if (trimmed === "hello") return "Not a node format";
  if (trimmed === "1->2") return "Not uppercase letters";
  if (trimmed === "AB->C") return "Multi-character parent";
  if (trimmed === "A-B") return "Wrong separator";
  if (trimmed === "A->") return "Missing child node";
  if (trimmed.startsWith("->")) return "Missing parent node";
  
  // Self loops
  const match = trimmed.match(/^([A-Z])->([A-Z])$/);
  if (match && match[1] === match[2]) {
    return "Self-loop — treated as invalid";
  }

  return "Invalid format";
}

export default function TableCard({
  invalidEntries,
  duplicateEdges,
  rawInput,
}: TableCardProps) {
  const edgeOccurrencesMap = new Map<string, number>();
  const lines = rawInput.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) {
      edgeOccurrencesMap.set(trimmed, (edgeOccurrencesMap.get(trimmed) || 0) + 1);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <h3 className="font-sans font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 animate-bounce" style={{ animationDuration: '3s' }} />
          Invalid Entries
        </h3>
        
        <div className="flex-grow overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-gray-50 dark:bg-[#23293c] text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-white/5">
              <tr>
                <th className="px-4 py-3 font-semibold tracking-wide">Entry</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {invalidEntries.length > 0 ? (
                invalidEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-800 dark:text-white font-semibold break-all">
                      {entry === "" ? <span className="text-gray-400 italic">Empty String</span> : entry}
                    </td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-rose-500" />
                      {getInvalidReason(entry)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 italic">
                    No invalid entries in current dataset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <h3 className="font-sans font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          Duplicate Edges
        </h3>
        
        <div className="flex-grow overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-gray-50 dark:bg-[#23293c] text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-white/5">
              <tr>
                <th className="px-4 py-3 font-semibold tracking-wide">Edge</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Total Occurrences</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {duplicateEdges.length > 0 ? (
                duplicateEdges.map((edge, idx) => {
                  const occurrences = edgeOccurrencesMap.get(edge) || 2;
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-800 dark:text-white font-semibold">
                        {edge}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-bold mr-1.5 font-mono">
                          {occurrences}
                        </span>
                        times in input
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 italic">
                    No duplicate edges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
