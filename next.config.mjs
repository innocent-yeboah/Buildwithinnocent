/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled until verified stable with React 19 + client-heavy homepage (avoids rare compiler/runtime quirks).
  reactCompiler: false,
  images: {
    qualities: [75, 88],
  },
};

export default nextConfig;
