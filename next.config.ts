import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Coolify/Docker: copy `public` + `.next/standalone` per Next docs; see Dockerfile
  output: "standalone",
  images: {
    // Image optimizer fetches `/api/upload/file/...` via loopback/internal IP on self-hosted hosts;
    // Coolify often needs this or images break while Vercel is fine.
    dangerouslyAllowLocalIP: process.env.IMAGE_OPTIMIZER_ALLOW_LOCAL_IP !== "false",
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js', // This tells Turbopack to treat the SVG as a JavaScript module
      },
    },
  },
  webpack(config, { isServer }) {
    // This is an example for adding options to @svgr/webpack if needed
    // For basic usage, the turbopack rule might suffice.
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // Example option: make SVGs icon-friendly
            icon: true,
          },
        },
      ],
      // Ensure this rule is not applied when Turbopack is handling it
      // You might need to adjust based on your specific setup
      issuer: {
        and: [/\.(js|ts|md)x?$/], // Apply only when imported from JS/TS/MDX
      },
    });
    return config;
  },
};

export default nextConfig;

