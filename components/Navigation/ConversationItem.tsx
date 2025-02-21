import { useEffect, useContext, useState } from "react";
import { Conversation } from "../../types/Conversation";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { PiChatBold } from "react-icons/pi";
import Button from "../common/Button";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
import { EventBusContext } from "../EventBusContext";
type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
};

export default function ConversationItem({
  conversation,
  isSelected,
}: ConversationItemProps) {
  const [modified, setModified] = useState(false);
  const [isdelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const { dispatch } = useContext(AppContext);
  const { publish } = useContext(EventBusContext);

  useEffect(() => {
    setModified(false);
    setIsDelete(false);
  }, [isSelected]);

  async function updateConversation() {
    const response = await fetch("/api/conversation/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: conversation.id, title }),
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchConversationList");
      dispatch({
        type: ActionType.UPDATE,
        field: "selectedConversation",
        value: null,
      });
    }
  }

  async function deleteConversation() {
    const response = await fetch(
      `/api/conversation/delete?id=${conversation.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchConversationList");
    }
  }

  return (
    <li
      key={conversation.id}
      className={`chatLi   ${
        isSelected ? "selectedChatText" : ""
      }`}
      onClick={() => {
        dispatch({
          type: ActionType.UPDATE,
          field: "selectedConversation",
          value: conversation,
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
        <div className="chatText">{conversation.title}</div>
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
                      console.log("updateConversation");
                      updateConversation();
                    } else if (isdelete) {
                      console.log("deleteConversation");
                      deleteConversation();
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
