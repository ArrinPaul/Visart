import { NextResponse } from "next/server";
import { getAdminDashboardStats, getSystemHealthMetrics, getPerformanceAnalytics } from "@/lib/supabase/admin";

// No auth check (see docs/SECURITY.md). Note: several fields in the returned stats/health/
// performance objects are hardcoded or randomized rather than measured — see
// docs/TECHNICAL_DEBT.md (TD-005) and lib/supabase/admin.ts before treating this as live telemetry.
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
