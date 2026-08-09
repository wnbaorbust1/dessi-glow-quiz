import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project so Turbopack doesn't get
  // confused by an unrelated package-lock.json in a parent directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
