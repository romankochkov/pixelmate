import type { NextConfig } from "next";
import TerserPlugin from "terser-webpack-plugin";

const nextConfig: NextConfig = {
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Удаляет все console.* (log, warn, error)
            },
          },
        }),
      ];
    }
    return config;
  },
};

export default nextConfig;