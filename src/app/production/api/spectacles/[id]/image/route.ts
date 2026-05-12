import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spectacle = await prisma.spectacle.findUnique({
    where: { id: Number(id) },
    select: { image: true, imageMimeType: true },
  });

  if (!spectacle?.image) {
    return NextResponse.json({ error: "No image" }, { status: 404 });
  }

  return new NextResponse(spectacle.image, {
    headers: {
      "Content-Type": spectacle.imageMimeType || "image/jpeg",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await prisma.spectacle.update({
    where: { id: Number(id) },
    data: { image: buffer, imageMimeType: file.type, imageUpdatedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
