import type { NextConfig } from "next";


// 告訴這個 Supabase Storage 的圖片來源是可信任的，可以讓 <Image /> 安全載入並優化
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gsrfecvfepjoeznazjms.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
