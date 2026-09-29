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
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
