import { useEffect, useContext, useState } from "react";
import { Chat } from "../../types/chat";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { PiChatBold } from "react-icons/pi";
import Button from "../common/Button";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
import { EventBusContext } from "../EventBusContext";
type ChatItemProps = {
  chat: Chat;
  isSelected: boolean;
};

export default function ChatItem({ chat, isSelected }: ChatItemProps) {
  const [modified, setModified] = useState(false);
  const [isdelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const { dispatch } = useContext(AppContext);
  const { publish } = useContext(EventBusContext);

  useEffect(() => {
    setModified(false);
    setIsDelete(false);
  }, [isSelected]);

  async function updateChat() {
    const response = await fetch("/api/chat/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: chat.id, title }),
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchChatList");
      dispatch({ type: ActionType.UPDATE, field: "selectedChat", value: null });
    }
  }

  async function deleteChat() {
    const response = await fetch(`/api/chat/delete?id=${chat.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchChatList");
    }
  }

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
        <input
          className="chatItemInput"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
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
                    if (modified) {
                      console.log("updateChat");
                      updateChat();
                    } else if (isdelete) {
                      console.log("deleteChat");
                      deleteChat();
                    }
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
