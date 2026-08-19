import { NextResponse } from "next/server";
import { getAdminDashboardStats, getSystemHealthMetrics, getPerformanceAnalytics } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const [stats, health, performance] = await Promise.all([
      getAdminDashboardStats(),
      getSystemHealthMetrics(),
      getPerformanceAnalytics(),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      health,
      performance,
    });
  } catch (error) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
