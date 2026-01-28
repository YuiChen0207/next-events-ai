"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyToastOnSuccess() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      toast.success("Payment successful! Your booking is confirmed.", {
        duration: 5000,
      });
    }
  }, [searchParams]);

  return null;
}
