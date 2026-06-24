import React from "react";
import { GitFork } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 dark:bg-[#0c1324]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GitFork className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-gray-900 dark:text-white transition-colors">
            Graph Analyzer
          </span>
        </div>
      </div>
    </header>
  );
}
