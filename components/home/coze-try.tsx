"use client";
import { useState } from "react";
import { CozeAPI, COZE_CN_BASE_URL, RoleType } from "@coze/api";
import Button from "../common/Button";

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: COZE_CN_BASE_URL,
  allowPersonalAccessTokenInBrowser: true,
});

export interface WorkSpace {
  id: string;
  name: string;
  icon_url: string;
  role_type: string;
  workspace_type: string;
}

export default function CozeTryButton() {
  const [conversationID, setConversationID] = useState("");
  const [chatID, setChatID] = useState("");
  const [result, setResult] = useState(""); // 用于显示操作结果



  async function createConversation() {
    try {
      const createConversationResponse = await client.conversations.create({});
      setConversationID(createConversationResponse.id);
      setResult(`Created conversation: ${createConversationResponse.id}`);
    } catch (error) {
      setResult(`Error creating conversation: ${error}`);
    }
  }

  async function searchConversation() {
    try {
      const retrieveConversationResponse = await client.conversations.retrieve(
        conversationID
      );
      setResult(
        `Retrieved conversation: ${JSON.stringify(
          retrieveConversationResponse,
          null,
          2
        )}`
      );
    } catch (error) {
      setResult(`Error retrieving conversation: ${error}`);
    }
  }

  async function createChat() {
    try {
      const chatRes = await client.chat.create({
        conversation_id: conversationID,
        bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID as string,
        user_id: "123456",
        additional_messages: [
          {
            role: RoleType.User,
            content: "请你给我介绍一下你自己",
            content_type: "text",
          },
        ],
      });
      setChatID(chatRes.id);
      setResult(`Created chat: ${JSON.stringify(chatRes, null, 2)}`);
    } catch (error) {
      setResult(`Error creating chat: ${error}`);
    }
  }

  async function searchChat() {
    try {
      const chatDetails = await client.chat.retrieve(conversationID, chatID);
      let resultMessage = `Chat details: ${JSON.stringify(
        chatDetails,
        null,
        2
      )}`;

      if (chatDetails.status === "completed") {
        const messages = await client.chat.messages.list(
          conversationID,
          chatID
        );
        resultMessage += `\n\nChat messages: ${JSON.stringify(
          messages,
          null,
          2
        )}`;
      } else {
        resultMessage += "\n\nChat is not completed yet";
      }

      setResult(resultMessage);
    } catch (error) {
      setResult(`Error searching chat: ${error}`);
    }
  }

  function showToken() {
    const res = `COZE_API_TOKEN: ${process.env.NEXT_PUBLIC_COZE_API_TOKEN}\n COZE_BOT_ID: ${process.env.NEXT_PUBLIC_COZE_BOT_ID}`;
    setResult(res);
  }

  return (
    <div>
      <div>
        <Button onClick={createConversation}>createConversation</Button>
        <Button onClick={searchConversation}>searchConversation</Button>
        <Button onClick={createChat}>createChat</Button>
        <Button onClick={searchChat}>searchChat</Button>
        <Button onClick={showToken}>showToken</Button>
      </div>
      <div>
        <h3>Conversation ID: {conversationID}</h3>
        <h3>Chat ID: {chatID}</h3>
      </div>
      <div>
        <h3>Result:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
}
