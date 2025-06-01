/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "wolfdruck.s3.eu-central-1.amazonaws.com",
            pathname: "/logos/**",
          },
        ],
      },

};

export default nextConfig;
