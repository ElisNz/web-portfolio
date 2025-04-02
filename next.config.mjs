/** @type {import('next').NextConfig} */
const nextConfig = {
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
