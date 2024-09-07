/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Disables ESLint during builds, allowing the build process to continue even with ESLint errors
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignores TypeScript errors during the build process, bypassing type checks
      ignoreBuildErrors: true,
    },
    // You can add other configuration options here if needed
  };
  
  export default nextConfig;
  