"use client";

import type { LanguageOption } from "@/src/lib/authority-localization";

type LanguageToggleProps = {
  value: LanguageOption;
  onChange: (nextValue: LanguageOption) => void;
};

export default function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-line/80 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={value === "en"}
        aria-label="Switch language to English"
        className={`interactive-button rounded-lg px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
          value === "en"
            ? "bg-brandBase font-medium text-slate-800"
            : "text-muted hover:text-slate-700"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("es")}
        aria-pressed={value === "es"}
        aria-label="Switch language to Spanish"
        className={`interactive-button rounded-lg px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
          value === "es"
            ? "bg-brandBase font-medium text-slate-800"
            : "text-muted hover:text-slate-700"
        }`}
      >
        ES
      </button>
    </div>
  );
}
