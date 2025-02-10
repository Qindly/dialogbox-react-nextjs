import React, { useEffect, useContext } from "react";
import { Chat } from "../../types/chat";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { PiChatBold } from "react-icons/pi";
import Button from "../common/Button";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
type ChatItemProps = {
  chat: Chat;
  isSelected: boolean;
};

export default function ChatItem({ chat, isSelected }: ChatItemProps) {
  const [modified, setModified] = React.useState(false);
  const [isdelete, setIsDelete] = React.useState(false);
  const { dispatch } = useContext(AppContext);
  useEffect(() => {
    setModified(false);
    setIsDelete(false);
  }, [isSelected]);
  return (
    <li
      key={chat.id}
      className={`chatLi   ${isSelected ? "selectedChatText" : ""}`}
      onClick={() => {
        dispatch({
          type: ActionType.UPDATE,
          field: "selectedChat",
          value: chat,
        });
      }}
    >
      {modified ? (
        <AiOutlineEdit className="icon" />
      ) : isdelete ? (
        <MdDeleteOutline className="icon" />
      ) : (
        <PiChatBold className="icon" />
      )}
      {modified ? (
        <input className="chatItemInput" defaultValue={chat.title} />
      ) : (
        <div className="chatText">{chat.title}</div>
      )}
      {isSelected && (
        <>
          {modified || isdelete ? (
            <div className="chatItemTool">
              <Button>
                <MdCheck
                  className="icon"
                  onClick={() => {
                    setModified(false);
                    setIsDelete(false);
                  }}
                />
              </Button>
              <Button>
                <MdClose
                  className="icon"
                  onClick={() => {
                    setModified(false);
                    setIsDelete(false);
                  }}
                />
              </Button>
            </div>
          ) : (
            <div className="chatItemTool">
              <Button>
                <AiOutlineEdit
                  className="icon"
                  onClick={() => setModified(true)}
                />
              </Button>
              <Button>
                <MdDeleteOutline
                  className="icon"
                  onClick={() => setIsDelete(true)}
                />
              </Button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
