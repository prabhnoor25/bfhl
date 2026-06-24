import React from "react";
import { Network, RefreshCw, Crown, AlertOctagon } from "lucide-react";
import { BfhlSummary } from "../types";

interface SummaryCardProps {
  summary: BfhlSummary;
  invalidCount: number;
}

export default function SummaryCard({ summary, invalidCount }: SummaryCardProps) {
  const cards = [
    {
      title: "Total Trees",
      value: summary.total_trees,
      badge: summary.total_trees > 0 ? `+${summary.total_trees}` : "0",
      badgeColor: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20",
      icon: Network,
      color: "text-emerald-500 dark:text-emerald-400",
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Cycles Detected",
      value: summary.total_cycles,
      badge: summary.total_cycles > 0 ? "WARNING" : "NONE",
      badgeColor:
        summary.total_cycles > 0
          ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20"
          : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10",
      icon: RefreshCw,
      color: "text-amber-500 dark:text-amber-400",
      gradient: "from-amber-500/10 to-transparent",
    },
    {
      title: "Largest Root",
      value: summary.largest_tree_root || "N/A",
      badge: "MAX",
      badgeColor: "bg-indigo-500/10 text-indigo-500 dark:text-[#c0c1ff] border border-indigo-500/20",
      icon: Crown,
      color: "text-indigo-500 dark:text-[#c0c1ff]",
      gradient: "from-indigo-500/10 to-transparent",
    },
    {
      title: "Invalid Entries",
      value: invalidCount,
      badge: invalidCount > 0 ? "ERR" : "OK",
      badgeColor:
        invalidCount > 0
          ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 animate-pulse"
          : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10",
      icon: AlertOctagon,
      color: "text-rose-500 dark:text-rose-400",
      gradient: "from-rose-500/10 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.gradient} opacity-40 blur-xl pointer-events-none group-hover:scale-125 transition-all duration-500`} />

            <div className="flex justify-between items-start z-10">
              <div className={`p-2 bg-gray-50 dark:bg-[#23293c] rounded-xl border border-gray-200/50 dark:border-white/5 ${card.color}`}>
                <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-5 z-10">
              <div className="text-3xl font-bold font-sans tracking-tight text-gray-900 dark:text-white transition-colors">
                {card.value}
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans mt-1">
                {card.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
