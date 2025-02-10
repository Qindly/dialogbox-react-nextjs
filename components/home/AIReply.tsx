"use client";
import { MdContentCopy, MdRefresh } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useContext } from "react";
import { AppContext } from "@/components/AppContext";
import { ChatMessage } from "../../types/chat";
import { ActionType } from "@/reducers/AppReducer";
import { ChatFunctionContext } from "@/components/ChatFunction";
// import Markdown from "../common/Markdown";
interface AIReplyProps {
  message: ChatMessage;
  need: boolean;
}
export default function AIReply({ message, need }: AIReplyProps) {
  const {
    state: { messageList },
    dispatch,
  } = useContext(AppContext);
  const { resend } = useContext(ChatFunctionContext);
  function handleRetry() {
    resend();
  }
  function handleRemove() {
    dispatch({ type: ActionType.REMOVE_MESSAGE, message: message });
  }
  return (
    <>
      <div className="reply">
        <div className="replyText">
          {`${message.text}${need && "!"}`}
          {/* <Markdown>{text}</Markdown> */}
        </div>
        <div className="replyFunction">
          <div className="earchReplyFunction">
            <MdContentCopy className="replyFunctionImg" />
            <div>copy</div>
          </div>
          {messageList[messageList.length - 1].id === message.id && (
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
