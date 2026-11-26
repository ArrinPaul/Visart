import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminDashboardStats, getSystemHealthMetrics, getPerformanceAnalytics } from "@/lib/supabase/admin";

// Requires an admin session.
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
