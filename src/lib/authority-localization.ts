export type LanguageOption = "en" | "es";

const toSpanishReplacements: Array<[RegExp, string]> = [
  [/^Minister for /i, "Ministro de "],
  [/^Minister of /i, "Ministro de "],
  [/^Permanent Secretary$/i, "Secretario Permanente"],
  [/^Deputy Minister of /i, "Viceministro de "],
  [/^Deputy Minister$/i, "Viceministro"],
  [/^Secretary of State for /i, "Secretario de Estado para "],
  [/^Director of /i, "Director de "],
  [/^General Coordinator for /i, "Coordinador General de "],
  [/^Agricultural Advisor$/i, "Asesor Agrícola"],
  [/^Professional$/i, "Profesional"],
  [/^Ambassador, Permanent Representative$/i, "Embajador, Representante Permanente"],
  [/^Sustainable Food Systems Regional Policy Advisor$/i, "Asesor Regional de Políticas de Sistemas Alimentarios Sostenibles"],
  [/^Ministre de /i, "Ministro de "],
];

const toEnglishReplacements: Array<[RegExp, string]> = [
  [/^Ministra? de /i, "Minister of "],
  [/^Ministra? del /i, "Minister of "],
  [/^Viceministra? de /i, "Deputy Minister of "],
  [/^Viceministra?$/i, "Deputy Minister"],
  [/^Subsecretaria? de /i, "Deputy Secretary for "],
  [/^Subsecretaria?$/i, "Deputy Secretary"],
  [/^Secretario de Estado en los Despachos de /i, "Secretary of State for "],
  [/^Directora? de /i, "Director of "],
  [/^Coordinador General de /i, "General Coordinator for "],
  [/^Licenciada$/i, "Professional"],
  [/^Ministre de /i, "Minister of "],
];

function applyReplacements(input: string, rules: Array<[RegExp, string]>) {
  let output = input;
  for (const [pattern, replacement] of rules) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

export function localizePosition(position: string, language: LanguageOption): string {
  if (!position) return position;
  if (language === "es") return applyReplacements(position, toSpanishReplacements);
  return applyReplacements(position, toEnglishReplacements);
}

