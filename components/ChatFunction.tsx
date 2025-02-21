"use client";
import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { AppContext } from "./AppContext";
import { ActionType } from "@/reducers/AppReducer";
import { Chat, ChatRequestBody } from "@/types/Conversation";
import { EventBusContext } from "./EventBusContext";

interface ChatFunctionContextType {
  send: (chatText: string) => void;
  resend: () => void;
  stopsend: () => void;
}

export const ChatFunctionContext = createContext<ChatFunctionContextType>(
  null!
);

export function ChatFunctionProvider({ children }: { children: ReactNode }) {
  // const streamingRef = useRef<AsyncIterableIterator<any> | null>(null);
  const stopRef = useRef(false);
  const conversationIdRef = useRef("");
  const { publish } = useContext(EventBusContext);
  const {
    state: { chatList, selectedConversation },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    if (conversationIdRef.current === selectedConversation?.id) {
      return;
    }
    conversationIdRef.current = selectedConversation?.id ?? "";
    stopRef.current = true;
  }, [selectedConversation]);

  const stopsend = () => {
    stopRef.current = true;
  };

  async function createOrUpdateChat(chat: Chat) {
    try {
      const response = await fetch("/api/chat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat),
      });

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const { data } = await response.json();

      console.log("newdata:", data);
      if (!conversationIdRef.current) {
        conversationIdRef.current = data.chat.conversationId;
        dispatch({
          type: ActionType.UPDATE,
          field: "selectedConversation",
          value: { id: conversationIdRef.current },
        });
        publish("fetchconversationList");
      }
      return data.chat;
    } catch (error) {
      console.error("Error in createOrUpdateChat:", error);
    }
  }

  async function deleteChat(id: string) {
    const response = await fetch(`/api/chat/delete?id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    return code === 0;
  }

  const doSend = useCallback(
    async (chat: Chat[]) => {
      stopRef.current = false;
      const body: ChatRequestBody = { chats: chat };
      const controller = new AbortController();
      // setChatText("");
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log("response", response);
        console.log(response.statusText);
        return;
      }
      if (!response.body) {
        console.log("body error");
        return;
      }

      const resChat: Chat = await createOrUpdateChat({
        id: "",
        role: "assistant",
        text: "",
        conversationId: conversationIdRef.current,
      });
      dispatch({ type: ActionType.ADD_CHAT, chat: resChat });
      dispatch({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: resChat.id,
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false; //是否读取完的标志
      let content = "";
      while (!done) {
        if (stopRef.current) {
          controller.abort();
          break;
        }
        const result = await reader.read();
        done = result.done;
        const chunk = decoder.decode(result.value);
        content += chunk;
        console.log(chunk);
        dispatch({
          type: ActionType.UPDATE_CHAT,
          chat: { ...resChat, text: content },
        });
      }
      await createOrUpdateChat({ ...resChat, text: content });
      dispatch({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: "",
      });
      // setChatText("");
    },
    [dispatch, stopRef]
  );

  const send = useCallback(
    async (chatText: string) => {
      const chat: Chat = await createOrUpdateChat({
        id: "",
        role: "user",
        text: chatText,
        conversationId: conversationIdRef.current,
      });
      const chats: Chat[] = [...chatList, chat];
      dispatch({ type: ActionType.ADD_CHAT, chat });
      doSend(chats);
    },
    [chatList, dispatch, doSend]
  );

  const resend = useCallback(async () => {
    const chats: Chat[] = [...chatList];
    const result = await deleteChat(chatList[chatList.length - 1].id);
    if (!result) {
      console.log("delete chat error");
      return;
    }
    dispatch({
      type: ActionType.REMOVE_CHAT,
      chat: chatList[chatList.length - 1],
    });
    chats.splice(chats.length - 1, 1);
    doSend(chats);
  }, [chatList, dispatch, doSend]);

  return (
    <>
      <ChatFunctionContext.Provider value={{ send, resend, stopsend }}>
        {children}
      </ChatFunctionContext.Provider>
    </>
  );
}
