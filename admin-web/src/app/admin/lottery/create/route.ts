import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { uploadLotteryImage } from "@/lib/cloudinary";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  let filePath: string | null = null;

  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("luckyflow_admin");

    if (!adminCookie || adminCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const ticketPrice = Number(formData.get("ticketPrice"));
    const receiverPhone = String(formData.get("receiverPhone") || "");
    const drawDateValue = String(formData.get("drawDate") || "");
    const closingDateValue = String(formData.get("closingDate") || "");
    const file = formData.get("image");

    if (!title || !description || !ticketPrice || !receiverPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Lottery image is required" },
        { status: 400 }
      );
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload PNG, JPG, or WEBP image only." },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.lotteryItem.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = "/tmp";
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    filePath = path.join(uploadsDir, `${Date.now()}-${slug}.${ext}`);

    await fs.writeFile(filePath, buffer);

    const imageUrl = await uploadLotteryImage(filePath, slug);

    await fs.unlink(filePath).catch(() => {});

    const lotteryItem = await prisma.lotteryItem.create({
      data: {
        slug,
        title,
        description,
        imageUrl,
        ticketPrice,
        receiverPhone,
        drawDate: drawDateValue ? new Date(drawDateValue) : null,
        closingDate: closingDateValue ? new Date(closingDateValue) : null,
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      lotteryItem,
    });
  } catch (error) {
    console.error("CREATE_LOTTERY_ERROR:", error);

    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    return NextResponse.json(
      { error: "Failed to create lottery item" },
      { status: 500 }
    );
  }
}