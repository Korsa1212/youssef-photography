import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Kept on because this machine (and some hosts) hand back NAT64 IPv6
    // addresses for *.supabase.co, which the SSRF guard reads as private.
    // Exposure is minimal: remotePatterns below already restricts
    // optimization to the two hostnames we actually use.
    dangerouslyAllowLocalIP: true,
    // Next 16 only serves qualities listed here. Every `quality` prop used in
    // the app must be one of these numbers.
    qualities: [55, 65, 70, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Cloudflare R2 public bucket holding the wedding film. Only needed
        // if a poster frame is ever served through next/image.
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
