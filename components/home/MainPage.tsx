"use client";
import YourAsk from "./YourAsk";
import AIReply from "./AIReply";
import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
// import { ActionType } from "@/reducers/AppReducer";
// import { ChatMessage } from "../../types/chat";

interface MainPageProps {
  avatarURL: string;
}

export default function MainPage({ avatarURL }: MainPageProps) {
  const {
    state: { messageList, streamingId, selectedChat },
    dispatch,
  } = useContext(AppContext);

  async function getDate(chatId: string) {
    const response = await fetch(`/api/message/list?chatId=${chatId}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return;
    }
    const { data } = await response.json();
    dispatch({
      type: ActionType.UPDATE,
      field: "messageList",
      value: data.list,
    });
  }

  useEffect(() => {
    if (selectedChat) {
      getDate(selectedChat.id);
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: "messageList",
        value: [],
      });
    }
  }, [selectedChat]);

  return (
    <div className="MainPage">
      {messageList.map((item) => (
        <div className="eachDialog" key={item.id}>
          {item.role == "user" ? (
            <YourAsk message={item} avatarURL={avatarURL} />
          ) : (
            <AIReply message={item} need={streamingId === item.id} />
          )}
        </div>
      ))}
    </div>
  );
}
