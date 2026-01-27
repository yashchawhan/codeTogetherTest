/**
 * Exploratory notes + tiny helpers for evaluating OAuth refresh patterns across:
 * - Browser-based web apps (Authorization code + PKCE)
 * - Desktop apps (system browser + loopback / custom scheme + PKCE)
 */

type Platform = "web" | "desktop";

type Pattern = {
  id: string;
  platform: Platform;
  storage: "cookie" | "secureStore" | "local";
  rotate: boolean;
};

const patterns: Pattern[] = [
  { id: "web-cookie-rt", platform: "web", storage: "cookie", rotate: true },
  { id: "desktop-secure-rt", platform: "desktop", storage: "secureStore", rotate: true },
  { id: "web-local-rt", platform: "web", storage: "local", rotate: false },
];

function warnings(p: Pattern): string[] {
  const w: string[] = [];
  if (p.platform === "web" && p.storage === "local") w.push("XSS risk storing refresh token");
  if (p.platform === "web" && p.storage === "cookie") w.push("Need CSRF protection on refresh");
  if (!p.rotate) w.push("Prefer rotation + reuse detection");
  return w;
}

for (const p of patterns) {
  console.log(p.id, warnings(p));
}