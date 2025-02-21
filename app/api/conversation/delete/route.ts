import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ code: -1 });
  }
  const deleteChat = prisma.chat.deleteMany({
    where: {
      conversationId: id,
    },
  });
  const deleteConversation = prisma.conversation.delete({
    where: {
      id,
    },
  });
  await prisma.$transaction([deleteChat, deleteConversation]);
  return NextResponse.json({ code: 0 });
}
