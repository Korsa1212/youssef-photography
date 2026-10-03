export const PORTFOLIO_CATEGORIES = [
  "Caftan & Tradition",
  "Mariage",
  "Portraits",
  "Drone",
  "Shooting",
  "Fiançailles",
  "Événements",
  "Autre",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export function getLocalizedCategory(category: string, locale: string): string {
  if (locale !== "en") return category;
  const lower = category.toLowerCase().trim();
  if (lower.includes("caftan")) return "Caftan & Tradition";
  if (lower.includes("portrait")) return "Portraits";
  if (lower.includes("drone")) return "Drone & Aerial";
  if (lower.includes("shoot")) return "Shooting";
  if (lower.includes("mariage") || lower.includes("wedding")) return "Weddings";
  if (lower.includes("fian")) return "Engagements";
  if (lower.includes("év") || lower.includes("ev")) return "Events";
  if (lower.includes("autre") || lower.includes("other")) return "Other";
  return category;
}
