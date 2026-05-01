import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function buildCandidateUrls(originalUrl: string) {
  const urls = new Set<string>();

  urls.add(originalUrl);

  urls.add(originalUrl.replace("/image/upload/fl_attachment/", "/image/upload/"));
  urls.add(originalUrl.replace("/image/upload/fl_inline/", "/image/upload/"));
  urls.add(originalUrl.replace("/image/upload/", "/raw/upload/"));
  urls.add(originalUrl.replace("/image/upload/fl_attachment/", "/raw/upload/"));
  urls.add(originalUrl.replace("/image/upload/fl_inline/", "/raw/upload/"));

  return Array.from(urls);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("luckyflow_admin");

    if (!adminCookie || adminCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId } = await params;

    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
      select: {
        proofImageUrl: true,
        referenceCode: true,
      },
    });

    if (!entry?.proofImageUrl) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    const candidateUrls = buildCandidateUrls(entry.proofImageUrl);

    let proofRes: Response | null = null;

    for (const url of candidateUrls) {
      const res = await fetch(url);

      if (res.ok) {
        proofRes = res;
        break;
      }
    }

    if (!proofRes) {
      console.error("PROOF_FETCH_FAILED:", candidateUrls);

      return NextResponse.json(
        { error: "Could not load proof from storage" },
        { status: 500 }
      );
    }

    const buffer = await proofRes.arrayBuffer();
    const isPdf = entry.proofImageUrl.toLowerCase().includes(".pdf");

    return new Response(buffer, {
      headers: {
        "Content-Type": isPdf ? "application/pdf" : "image/jpeg",
        "Content-Disposition": `inline; filename="${entry.referenceCode}.${
          isPdf ? "pdf" : "jpg"
        }"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("VIEW_PROOF_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to view proof" },
      { status: 500 }
    );
  }
}