import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;
  if (!data.conversationId) {
    const conversation = await prisma.conversation.create({
      data: {
        title: "新对话",
      },
    });
    data.conversationId = conversation.id;
  } 
  // else {
  //   await prisma.chat.update({
  //     data: {
  //       updateTime: new Date(),
  //     },
  //     where: {
  //       id: data.conversationId,
  //     },
  //   });
  // }
  const chat = await prisma.chat.upsert({
    create: data,
    update: data,
    where: {
      id,
    },
  });
  return NextResponse.json({ code: 0, data: { chat } });
}
