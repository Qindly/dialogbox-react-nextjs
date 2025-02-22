"use client";
import YourAsk from "./YourAsk";
import AIReply from "./AIReply";
import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";

interface MainPageProps {
  avatarURL: string;
}

export default function MainPage({ avatarURL }: MainPageProps) {
  const {
    state: { chatList, streamingId, selectedConversation },
    dispatch,
  } = useContext(AppContext);

  async function getDate(ConversationId: string) {
    const response = await fetch(
      `/api/chat/list?conversationId=${ConversationId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      console.log(response);
      return;
    }
    console.log("response:",response);
    const { data } = await response.json();
    dispatch({
      type: ActionType.UPDATE,
      field: "chatList",
      value: data.list,
    });
  }

  useEffect(() => {
    if (selectedConversation) {
      getDate(selectedConversation.id);
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: "chatList",
        value: [],
      });
    }
  }, [selectedConversation]);

  return (
    <div className="MainPage">
      {chatList.map((item) => (
        <div className="eachDialog" key={item.id}>
          {item.role == "user" ? (
            <YourAsk chat={item} avatarURL={avatarURL} />
          ) : (
            <AIReply chat={item} need={streamingId === item.id} />
          )}
        </div>
      ))}
    </div>
  );
}
