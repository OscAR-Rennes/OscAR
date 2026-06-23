export function translateDifficultyName(name) {
  const normalized = String(name ?? "").trim().toLowerCase();

  switch (normalized) {
    case "easy":
      return "Facile";
    case "medium":
      return "Moyenne";
    case "hard":
      return "Difficile";
    default:
      return name ?? "—";
  }
}