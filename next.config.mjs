/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com", // optional (remove if not needed)
      },
    ],
  },
};

export default nextConfig;
