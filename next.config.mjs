/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  // H6 Sprint 1 Gün 13 — @studio/shared workspace ESM transpile
  transpilePackages: ['@studio/shared'],
  webpack: (config) => {
    // ESM `.js` import'ları shared'daki `.ts` kaynak dosyalarına çözsün
    // (shared paketi .ts source'u direkt sunuyor, build yok).
    config.resolve = config.resolve ?? {};
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts'],
    };
    return config;
  },
};
export default nextConfig;
