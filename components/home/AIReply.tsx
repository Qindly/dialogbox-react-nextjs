"use client";
import { MdContentCopy, MdRefresh } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useContext } from "react";
import { AppContext } from "@/components/AppContext";
import { Chat } from "../../types/Conversation";
import { ActionType } from "@/reducers/AppReducer";
import { ChatFunctionContext } from "@/components/ChatFunction";
// import Markdown from "../common/Markdown";
interface AIReplyProps {
  chat: Chat;
  need: boolean;
}
export default function AIReply({ chat, need }: AIReplyProps) {
  const {
    state: { chatList },
    dispatch,
  } = useContext(AppContext);
  const { resend } = useContext(ChatFunctionContext);
  function handleRetry() {
    resend();
  }
  function handleRemove() {
    dispatch({ type: ActionType.REMOVE_CHAT, chat: chat });
  }
  return (
    <>
      <div className="reply">
        <div className="replyText">
          {`${chat.text}${need && "!"}`}
          {/* <Markdown>{text}</Markdown> */}
        </div>
        <div className="replyFunction">
          <div className="earchReplyFunction">
            <MdContentCopy className="replyFunctionImg" />
            <div>copy</div>
          </div>
          {chatList[chatList.length - 1].id === chat.id && (
            <div onClick={handleRetry} className="earchReplyFunction">
              <MdRefresh className="replyFunctionImg" />
              <div>retry</div>
            </div>
          )}
          <div onClick={handleRemove} className="earchReplyFunction">
            <AiOutlineDelete className="replyFunctionImg" />
            <div>remove</div>
          </div>
        </div>
      </div>
    </>
  );
}
