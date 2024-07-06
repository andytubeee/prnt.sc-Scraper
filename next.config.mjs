/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;
