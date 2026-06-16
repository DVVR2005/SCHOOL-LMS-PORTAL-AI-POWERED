/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix Turbopack workspace root inference issues.
  // __dirname is not available in ES module scope.
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },

}

export default nextConfig

