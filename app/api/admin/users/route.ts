import { NextRequest, NextResponse } from "next/server";
import {
  getArtisansList,
  updateArtisanStatus,
  getCustomerLeads,
  addCustomerLead,
} from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";

    const [artisans, customers] = await Promise.all([
      getArtisansList(),
      getCustomerLeads(),
    ]);

    if (type === "artisans") {
      return NextResponse.json({ success: true, artisans });
    }
    if (type === "customers") {
      return NextResponse.json({ success: true, customers });
    }

    return NextResponse.json({
      success: true,
      artisans,
      customers,
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { artisanId, status } = body;

    if (!artisanId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing artisanId or status" },
        { status: 400 }
      );
    }

    const updated = await updateArtisanStatus(artisanId, status);
    return NextResponse.json({ success: true, artisan: updated });
  } catch (error) {
    console.error("Admin update artisan error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update artisan" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLead = await addCustomerLead(body);
    return NextResponse.json({ success: true, customer: newLead });
  } catch (error) {
    console.error("Admin add customer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add customer" },
      { status: 500 }
    );
  }
}
