/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: 'null-loader',
    });

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@acme/ui', 'tesseract.js'],
  },
};

export default nextConfig;
