import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/supabase/admin";
import { uploadVideoBufferToR2, deleteVideoFromR2 } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (admin.status !== "ok") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    // Check file type: must be video or mp4/webm/mov
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mov|webm|m4v)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a valid video file (MP4, MOV, WebM)." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadVideoBufferToR2(
      buffer,
      file.name,
      file.type || "video/mp4"
    );

    return NextResponse.json({
      success: true,
      url: result.publicUrl,
      key: result.key,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (admin.status !== "ok") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const url = body.url;

    if (!url) {
      return NextResponse.json({ error: "Video URL required" }, { status: 400 });
    }

    await deleteVideoFromR2(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deletion failed" },
      { status: 500 }
    );
  }
}
