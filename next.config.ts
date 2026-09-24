import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Project media lives in the public `portfolio-media` Supabase Storage bucket.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // @react-pdf/renderer ships native-ish deps (fontkit, yoga); keep it out of the server bundle.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
