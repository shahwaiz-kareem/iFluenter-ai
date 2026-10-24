/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/:path*`,
      },
    ];
  },
  output: "standalone",

  images: {
    remotePatterns: [
      {
        hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_HOST).hostname,
      },
      {
        protocol: "https",
        hostname: "cdn.ifluenter.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
