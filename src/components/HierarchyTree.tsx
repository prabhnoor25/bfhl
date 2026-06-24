import React, { useState } from "react";
import { Network, RefreshCw, FolderTree, ChevronRight, ChevronDown, CheckCircle, HelpCircle } from "lucide-react";
import { HierarchyObject } from "../types";

interface HierarchyTreeProps {
  hierarchies: HierarchyObject[];
}

interface VisualTreeNodeProps {
  key?: string;
  nodeName: string;
  childrenObj: Record<string, any>;
  isLast?: boolean;
  depth?: number;
}

function VisualTreeNode({
  nodeName,
  childrenObj,
  isLast = true,
  depth = 1,
}: VisualTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const childKeys = Object.keys(childrenObj).sort();
  const hasChildren = childKeys.length > 0;

  return (
    <div className="font-mono text-sm leading-6 selection:bg-indigo-500/20">
      <div className="flex items-center gap-2 group py-1 select-none">
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-[#c0c1ff] transition-all"
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <div className="w-5.5 h-5.5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 dark:bg-[#c0c1ff]/30" />
          </div>
        )}

        <span
          className={`px-2.5 py-0.5 rounded-lg border font-semibold text-xs tracking-wide transition-all ${
            hasChildren
              ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-[#c0c1ff]"
              : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
          }`}
        >
          {nodeName}
        </span>

        {hasChildren && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            ({childKeys.length} {childKeys.length === 1 ? "child" : "children"})
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="pl-6 border-l border-gray-200 dark:border-white/10 ml-3.5 mt-0.5 space-y-1">
          {childKeys.map((key, index) => (
            <VisualTreeNode
              key={key}
              nodeName={key}
              childrenObj={childrenObj[key]}
              isLast={index === childKeys.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function countTreeNodes(treeObj: Record<string, any>): number {
  let count = 1;
  const rootKey = Object.keys(treeObj)[0];
  if (!rootKey) return 0;
  
  const traverse = (sub: Record<string, any>) => {
    for (const key in sub) {
      count++;
      traverse(sub[key]);
    }
  };
  traverse(treeObj[rootKey]);
  return count;
}

export default function HierarchyTree({ hierarchies }: HierarchyTreeProps) {
  const [activeTab, setActiveTab] = useState<"trees" | "cycles">("trees");

  const trees = hierarchies.filter((h) => !h.has_cycle);
  const cycles = hierarchies.filter((h) => h.has_cycle);

  return (
    <div className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-white/10 mb-6">
        <button
          onClick={() => setActiveTab("trees")}
          className={`pb-4 -mb-[2px] px-2 font-sans font-bold text-sm tracking-tight transition-all relative cursor-pointer ${
            activeTab === "trees"
              ? "text-indigo-600 dark:text-[#c0c1ff]"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          Valid Trees ({trees.length})
          {activeTab === "trees" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 dark:bg-[#c0c1ff] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("cycles")}
          className={`pb-4 -mb-[2px] px-2 font-sans font-bold text-sm tracking-tight transition-all relative cursor-pointer ${
            activeTab === "cycles"
              ? "text-indigo-600 dark:text-[#c0c1ff]"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          Cycles Detected ({cycles.length})
          {activeTab === "cycles" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 dark:bg-[#c0c1ff] rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[600px] pr-2 space-y-4">
        {activeTab === "trees" ? (
          trees.length > 0 ? (
            trees.map((treeItem, index) => {
              const rootKey = treeItem.root;
              const innerTree = treeItem.tree[rootKey] || {};
              const totalNodes = countTreeNodes(treeItem.tree);
              const totalEdges = totalNodes - 1;

              return (
                <div
                  key={index}
                  className="p-5 bg-gray-50 dark:bg-[#151b2d]/50 hover:bg-gray-100 dark:hover:bg-[#191f31] rounded-2xl border border-gray-100 dark:border-white/5 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-[#c0c1ff] group-hover:scale-105 transition-all">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">
                          Root Node: {rootKey}
                        </h4>
                        <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-4">
                          <span>Nodes: {totalNodes}</span>
                          <span>Edges: {totalEdges}</span>
                          <span>Depth: {treeItem.depth}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="bg-emerald-50 dark:bg-secondary/10 text-emerald-700 dark:text-secondary text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-secondary/20">
                        STABLE
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#070d1f] rounded-xl border border-gray-200/50 dark:border-white/5">
                    <VisualTreeNode nodeName={rootKey} childrenObj={innerTree} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Network className="w-12 h-12 text-gray-300 dark:text-gray-600 stroke-1 mb-3" />
              <h3 className="font-sans font-bold text-gray-700 dark:text-gray-400 text-sm">
                No valid trees detected
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mt-1">
                Enter your edge list in the input card and click "Analyze Graph" to construct structural trees.
              </p>
            </div>
          )
        ) : cycles.length > 0 ? (
          cycles.map((cycleItem, index) => (
            <div
              key={index}
              className="p-5 bg-rose-50/30 dark:bg-rose-500/5 rounded-2xl border border-rose-200/40 dark:border-rose-500/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center text-rose-500">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">
                    Cyclic Group Root: {cycleItem.root}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    No valid unique root. Lexicographically smallest assigned as root.
                  </p>
                </div>
              </div>
              <div>
                <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/25">
                  CYCLIC
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 stroke-1 mb-3" />
            <h3 className="font-sans font-bold text-gray-700 dark:text-gray-400 text-sm">
              No cycles detected
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mt-1">
              Your graph contains no cyclic dependencies. All structures resolve cleanly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
