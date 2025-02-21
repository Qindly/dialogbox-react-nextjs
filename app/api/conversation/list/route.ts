import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("page");
  const page = param ? parseInt(param) : 1;
  const list = await prisma.conversation.findMany({
    skip: (page - 1) * 15,
    take: 15,
    orderBy: {
      updateTime: "desc",
    },
  });
  const count = await prisma.conversation.count();
  const hasMore = count > page * 15;
  return NextResponse.json({ code: 0, data: { list,hasMore } });
}
