import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* Worktree/monorepo: Root explizit setzen, sonst fällt Turbopack auf `src/app` zurück */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
