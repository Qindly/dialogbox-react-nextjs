import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CozeAPI, COZE_CN_BASE_URL, RoleType } from "@coze/api";

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: COZE_CN_BASE_URL,
  allowPersonalAccessTokenInBrowser: true,
});

function getAIResponse(result: string): string {
  const data = JSON.parse(result);
  if (data["Chat messages"]) {
    const answerMessage = data["Chat messages"].find(
      (message) => message.type === "answer"
    );
    if (answerMessage) {
      return answerMessage.content;
    }
  }
  return "No answer found in the response.";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, conversationId, ...data } = body;
  if (!data.conversationId) {
    const conversation = await prisma.conversation.create({
      data: {
        title: "新对话",
      },
    });
    data.conversationId = conversation.id;
  } else {
    await prisma.chat.update({
      data: {
        updateTime: new Date(),
      },
      where: {
        id: data.conversationId,
      },
    });
  }

  const chatRes = await client.chat.create({
    conversation_id: data.conversationID,
    bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID as string,
    user_id: "123456",
    additional_messages: [
      {
        role: data.role as RoleType,
        content: data.text,
        content_type: "text",
      },
    ],
  });
  const chatId = chatRes.id;
  const chatDetails = await client.chat.retrieve(conversationId, chatId);
  let result = `Chat details: ${JSON.stringify(chatDetails, null, 2)}`;

  if (chatDetails.status === "completed") {
    const messages = await client.chat.messages.list(conversationId, chatId);
    result += `\n\nChat messages: ${JSON.stringify(messages, null, 2)}`;
  } else {
    result += "\n\nChat is not completed yet";
  }
  console.log("chatRes", chatRes);
  const aiReply = getAIResponse(result);
  const chat = await prisma.chat.upsert({
    create: data,
    update: data,
    where: {
      id,
    },
  });
  return NextResponse.json({ code: 0, data: { chat, aiReply } });
}
