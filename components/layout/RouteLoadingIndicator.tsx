"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";

export default function RouteLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset loading state when route changes
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Listen for browser navigation events
    // 刷新頁面也可以有spinner
    const handleStart = () => setLoading(true);
    window.addEventListener("beforeunload", handleStart);

    // Intercept link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      // !anchor.target指不是 _blank（新分頁）
      if (anchor && anchor.href && !anchor.target) {
        const url = new URL(anchor.href);
        const currentUrl = new URL(window.location.href);

        // Only show loading if navigating to a different page
        if (
          url.pathname !== currentUrl.pathname ||
          url.search !== currentUrl.search
        ) {
          setLoading(true);
        }
      }
    };

    // 第三個option為true意思是，我要在捕獲階段就收到這個 click 事件，避免被其他事件處理器阻止傳遞
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  if (!loading) return null;

  return <Spinner />;
}
