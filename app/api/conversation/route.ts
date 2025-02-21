import { NextRequest } from "next/server";
import { sleep } from "@/components/common/util";
import { MessageRequestBody } from "@/types/Conversation";
import { CozeAPI } from "@coze/api";

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: process.env.NEXT_PUBLIC_COZE_API_BASE_URL as string,
  allowPersonalAccessTokenInBrowser: true,
});
export async function POST(request: NextRequest) {
  const { Allmessage } = (await request.json()) as MessageRequestBody;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const messageText=Allmessage[Allmessage.length-1].text;
      for (let i = 0; i < messageText.length; i++) {
        await sleep(100);
        controller.enqueue(encoder.encode(messageText[i]));
      }
      controller.close();
    },
  });
  return stream;
}
