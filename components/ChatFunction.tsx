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
import { Chat, MessageRequestBody } from "@/types/Conversation";
import { EventBusContext } from "./EventBusContext";
import { CozeAPI, COZE_CN_BASE_URL, RoleType } from "@coze/api";

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: COZE_CN_BASE_URL,
  allowPersonalAccessTokenInBrowser: true,
});

interface ChatFunctionContextType {
  send: (messageText: string) => void;
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
    state: { messageList, selectedConversation },
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

  async function createOrUpdateMessage(message: Chat) {
    try {
      const response = await fetch("/api/message/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const { data } = await response.json();

      console.log("newdata:", data);
      if (!conversationIdRef.current) {
        conversationIdRef.current = data.message.conversationId;
        dispatch({
          type: ActionType.UPDATE,
          field: "selectedConversation",
          value: { id: conversationIdRef.current },
        });
        publish("fetchconversationList");
      }
      return data.message;
    } catch (error) {
      console.error("Error in createOrUpdateMessage:", error);
    }
  }

  async function deleteMessage(id: string) {
    const response = await fetch(`/api/message/delete?id=${id}`, {
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
    async (messages: Chat[]) => {
      stopRef.current = false;
      const body: MessageRequestBody = { Allmessage: messages };
      const controller = new AbortController();
      // setMessageText("");
      const response = await fetch("/api/chat", {
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

      const resMessage: Chat = await createOrUpdateMessage({
        id: "",
        role: "assistant",
        text: "",
        conversationId: conversationIdRef.current,
      });
      dispatch({ type: ActionType.ADD_MESSAGE, message: resMessage });
      dispatch({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: resMessage.id,
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
          type: ActionType.UPDATE_MESSAGE,
          message: { ...resMessage, text: content },
        });
      }
      await createOrUpdateMessage({ ...resMessage, text: content });
      dispatch({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: "",
      });
      // setMessageText("");
    },
    [dispatch, stopRef]
  );

  const send = useCallback(
    async (messageText: string) => {
      const message: Chat = await createOrUpdateMessage({
        id: "1",
        role: "user",
        text: messageText,
        conversationId: conversationIdRef.current,
      });
      const messages: Chat[] = [...messageList, message];
      dispatch({ type: ActionType.ADD_MESSAGE, message });
      doSend(messages);
    },
    [messageList, dispatch, doSend]
  );

  const resend = useCallback(async () => {
    const messages: Chat[] = [...messageList];
    const result = await deleteMessage(messageList[messageList.length - 1].id);
    if (!result) {
      console.log("delete message error");
      return;
    }
    dispatch({
      type: ActionType.REMOVE_MESSAGE,
      message: messageList[messageList.length - 1],
    });
    messages.splice(messages.length - 1, 1);
    doSend(messages);
  }, [messageList, dispatch, doSend]);

  return (
    <>
      <ChatFunctionContext.Provider value={{ send, resend, stopsend }}>
        {children}
      </ChatFunctionContext.Provider>
    </>
  );
}
