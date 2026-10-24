export { cn } from "cn"

{/**
    -- Retrieving URL's hostname from the embedded website 
    */}
export function getHostname(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}