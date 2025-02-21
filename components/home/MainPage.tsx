"use client";
import YourAsk from "./YourAsk";
import AIReply from "./AIReply";
import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
import { CozeAPI } from "@coze/api";
// import { ActionType } from "@/reducers/AppReducer";
// import { ConversationMessage } from "../../types/Conversation";

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: process.env.NEXT_PUBLIC_COZE_API_BASE_URL as string,
  allowPersonalAccessTokenInBrowser: true,
});

interface MainPageProps {
  avatarURL: string;
}

export default function MainPage({ avatarURL }: MainPageProps) {
  const {
    state: { messageList, streamingId, selectedConversation },
    dispatch,
  } = useContext(AppContext);

  async function getDate(ConversationId: string) {
    const response = await client.get.getMessages(ConversationId);
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
    if (selectedConversation) {
      getDate(selectedConversation.id);
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: "messageList",
        value: [],
      });
    }
  }, [selectedConversation]);

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
