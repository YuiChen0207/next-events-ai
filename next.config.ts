import type { NextConfig } from "next";

// 告訴這個 Supabase Storage 的圖片來源是可信任的，可以讓 <Image /> 安全載入並優化
// 防止 <Image /> 被用來載入惡意圖片或跨站攻擊（CORS / SSR）
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gsrfecvfepjoeznazjms.supabase.co", // 只允許這個 Supabase Storage 網域
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 定義 響應式圖片的寬度斷點
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 這是 小尺寸圖片（icon / avatar / thumbnails） 的候選寬度
    formats: ["image/webp"], // Next.js 會自動將來源圖片轉成 WebP 格式，減少檔案大小
    qualities: [100, 90, 75], // Next.js 會根據裝置尺寸生成不同 quality 的圖片
  },
};

export default nextConfig;
