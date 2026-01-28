import { NextResponse } from "next/server";
import { verifyPaymentStatus } from "@/actions/payment";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Missing session_id" },
        { status: 400 },
      );
    }

    const result = await verifyPaymentStatus(sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in verify payment route:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
