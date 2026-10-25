// Perceptual brightness calculation
export function isDarkColor(hex: string): boolean {
  if (!hex || hex === "transparent") return false;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

export function getContrastTextColor(hex: string): string {
  return isDarkColor(hex) ? "#FFFFFF" : "#10201F";
}


// LocalStorage visitor UUID helper
export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  const STORAGE_KEY = "sanad_visitor_anon_id";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
