import type { NextConfig } from "next";

// Демо собирается в статические файлы и открывается из подпапки.
// Локально /testsite, на GitHub Pages — /uvelir (задаётся через BASE_PATH).
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "/testsite",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
