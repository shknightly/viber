const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@geist-ui/core'],
  },
  transpilePackages: [
    '@viber/agent-core',
    '@viber/agent-llm',
    '@viber/types',
    '@viber/ui',
    '@viber/codemirror',
  ],
};

export default nextConfig;
