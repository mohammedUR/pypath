import type { NextConfig } from "next";

/**
 * Security headers (R-ARC-09):
 * - default-src 'self'            — the app loads zero third-party origins
 *                                   (Pyodide is vendored at /vendor/pyodide,
 *                                   sha256-pinned; links to external books are
 *                                   navigation anchors, never subresources).
 * - script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ['unsafe-eval' dev-only]
 *   · 'unsafe-inline': Next.js standalone injects inline bootstrap/flight
 *     scripts; no nonce infrastructure on a single-route static shell.
 *   · 'wasm-unsafe-eval': the Pyodide worker compiles WebAssembly.
 *   · 'unsafe-eval' is appended in DEVELOPMENT only: React's dev tooling
 *     (react-server-dom-turbopack) needs eval() to reconstruct callstacks.
 *     React never uses eval() in production, so the shipped CSP stays
 *     eval-free — the production header is byte-identical to the old one.
 *   · No eval in app code; user Python runs inside the worker sandbox only.
 * - connect-src 'self'            — progress never leaves the device.
 * - worker-src 'self'             — the classic pyodide worker.
 * - frame-ancestors 'none'        — no clickjacking surface.
 */
// Dev-only relaxation (see R-ARC-09 note above): React dev mode requires
// eval(); production keeps the strict eval-free CSP.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
