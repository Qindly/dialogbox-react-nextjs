"use client";
import TextareaAutoSize from "react-textarea-autosize";
import Button from "../common/Button";
import { MdCameraAlt, MdLink } from "react-icons/md";
import { useContext, useState } from "react";
import { ChatFunctionContext } from "@/components/ChatFunction";
import { AppContext } from "../AppContext";


export default function Footer() {
  const [messageText, setMessageText] = useState("");

  const { send, stopsend } = useContext(ChatFunctionContext);
  const {
    state: { streamingId },
  } = useContext(AppContext);


  return (
    <div className="footer">
      <TextareaAutoSize
        className="askInput"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="请输入你的问题..."
      />
      <div className="askFunction">
        <MdCameraAlt className="askFunctionImg" />
        <MdLink className="askFunctionImg" />
        <Button
          className="send"
          onClick={() => {
            if (streamingId === "") {
              send(messageText);
            } else {
              stopsend();
            }
            setMessageText("");
          }}
          disabled={messageText.trim() === "" && streamingId === ""}
        >
          {streamingId === "" ? "send" : "stop"}
        </Button>
      </div>
    </div>
  );
}
