import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    localPatterns: [
      {
        pathname: "/production/api/spectacles/**",
      },
    ],
  },
};

export default nextConfig;
