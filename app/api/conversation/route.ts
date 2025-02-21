import { NextRequest } from "next/server";
// import { sleep } from "@/components/common/util";
import { MessageRequestBody } from "@/types/Conversation";
import {
  CozeAPI,
  COZE_COM_BASE_URL,
  RoleType,
  ContentType,
  ChatEventType,
} from "@coze/api";

const client = new CozeAPI({
  token: process.env.COZE_API_TOKEN as string,
  baseURL: COZE_COM_BASE_URL,
});

export async function POST(request: NextRequest) {
  // const { Allmessage } = (await request.json()) as MessageRequestBody;
  // const encoder = new TextEncoder();
  // const stream = new ReadableStream({
  //   // async start(controller) {
  //   //   const messageText=Allmessage[Allmessage.length-1].text;
  //   //   for (let i = 0; i < messageText.length; i++) {
  //   //     await sleep(100);
  //   //     controller.enqueue(encoder.encode(messageText[i]));
  //   //   }
  //   //   controller.close();
  //   // },
  // });
  // const messages = Allmessage.map((msg) => ({
  //   role: msg.role as RoleType,
  //   content: msg.text,
  //   content_type: "text" as ContentType,
  // }));
  // const stream = await client.chat.stream({
  //   bot_id: process.env.COZE_BOT_ID as string,
  //   additional_messages: messages,
  // });
  // const readableStream = new ReadableStream({
  //   async start(controller) {
  //     for await (const part of stream) {
  //       if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
  //         controller.enqueue(new TextEncoder().encode(part.data.content));
  //       }
  //     }
  //     controller.close();
  //   },
  // });
  // return new Response(readableStream);
}
