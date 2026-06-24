import React, { useState } from "react";
import { Code, Copy, Check, Terminal } from "lucide-react";

interface JsonViewerProps {
  json: any;
}

export default function JsonViewer({ json }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!json) return;
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#191f31]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-500 dark:text-[#c0c1ff]" />
          Raw Analysis Output (JSON)
        </h3>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 text-xs font-semibold cursor-pointer ${
            copied
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-[#23293c] dark:hover:bg-[#2e3447] text-gray-700 dark:text-white border-gray-200 dark:border-white/10"
          }`}
          title="Copy full JSON response"
          id="copy-json-btn"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-[#070d1f] rounded-2xl p-5 border border-gray-200 dark:border-white/10 max-h-72 overflow-y-auto relative shadow-inner">
        <div className="absolute top-3 right-4 flex gap-1.5 opacity-40 select-none pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>

        <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-5">
          <code>
            {json ? JSON.stringify(json, null, 2) : `{\n  "status": "awaiting_input",\n  "message": "Enter edge lines and click Analyze Graph to compute output."\n}`}
          </code>
        </pre>
      </div>
    </div>
  );
}
