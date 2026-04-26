import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  approvedEmailTemplate,
  rejectedEmailTemplate,
  sendEmail,
} from "@/lib/email";
import { cookies } from "next/headers";

const approveSchema = z.object({
  entryId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("luckyflow_admin");

    if (!adminCookie || adminCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = approveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { entryId, status } = parsed.data;

    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
      include: {
        lotteryItem: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.status === "APPROVED" || entry.status === "REJECTED") {
      return NextResponse.json(
        { error: "This entry has already been finalised." },
        { status: 400 }
      );
    }

    if (status === "APPROVED") {
      const existingApproved = await prisma.entry.findFirst({
        where: {
          referenceCode: entry.referenceCode,
          status: "APPROVED",
        },
      });

      if (existingApproved) {
        return NextResponse.json(
          { error: "This reference has already been approved." },
          { status: 400 }
        );
      }
    }

    let approvedParticipantId: string | null = null;

    if (status === "APPROVED") {
      const participant = await prisma.participant.create({
        data: {
          fullName: entry.applicantFullName,
          email: entry.applicantEmail,
          phone: entry.applicantPhone,
          address: entry.applicantAddress,
          nationality: entry.applicantNationality,
        },
      });

      approvedParticipantId = participant.id;

      await prisma.lotteryItem.update({
        where: { id: entry.lotteryItemId },
        data: {
          totalParticipants: {
            increment: 1,
          },
        },
      });
    }

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        status,
        approvedParticipantId,
      },
    });

    if (status === "APPROVED") {
      try {
        await sendEmail({
          to: entry.applicantEmail,
          subject: "Your lottery entry has been confirmed",
          html: approvedEmailTemplate({
            fullName: entry.applicantFullName,
            itemTitle: entry.lotteryItem.title,
            referenceCode: entry.referenceCode,
          }),
        });
      } catch (emailError) {
        console.error("APPROVAL_EMAIL_ERROR:", emailError);
      }
    }

    if (status === "REJECTED") {
      try {
        await sendEmail({
          to: entry.applicantEmail,
          subject: "Your lottery entry update",
          html: rejectedEmailTemplate({
            fullName: entry.applicantFullName,
            itemTitle: entry.lotteryItem.title,
            referenceCode: entry.referenceCode,
          }),
        });
      } catch (emailError) {
        console.error("REJECTION_EMAIL_ERROR:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      entry: updated,
      newStatus: updated.status,
    });
  } catch (error) {
    console.error("ADMIN_APPROVE_ERROR:", error);

    return NextResponse.json(
      { error: "Approval failed" },
      { status: 500 }
    );
  }
}