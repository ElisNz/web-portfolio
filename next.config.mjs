/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
