import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;
  await prisma.conversation.upsert({
    create: data,
    update: data,
    where: {
      id,
    },
  });
  return NextResponse.json({ code: 0 });
}
