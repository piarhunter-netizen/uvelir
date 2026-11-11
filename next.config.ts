import type { NextConfig } from "next";

// Демо собирается в статические файлы и открывается из подпапки /testsite
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/testsite",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
