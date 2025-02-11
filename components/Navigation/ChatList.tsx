import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Chat } from "../../types/chat";
import { getChatByGroup } from "../common/util";
import ChatItem from "./ChatItem";
import { EventBusContext } from "../EventBusContext";
import { AppContext } from "../AppContext";
export default function ChatList() {
  const [chatList, setChatList] = React.useState<Chat[]>([]);

  const {
    state: { selectedChat },
  } = useContext(AppContext);
  const { subscribe, unsubscribe } = useContext(EventBusContext);

  const pageRef = useRef(1);
  const loadMoreRef = useRef(null);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(false);

  const groupList = useMemo(() => {
    return getChatByGroup(chatList);
  }, [chatList]);

  async function getDate(reset = false) {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    if (reset) {
      pageRef.current = 1;
    } else {
      pageRef.current++;
    }
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: "GET",
    });
    if (!response.ok) {
      loadingRef.current = false;
      console.log(response);
      return;
    }

    const { data } = await response.json();
    hasMoreRef.current = data.hasMore;
    console.log("pageRef", pageRef.current);
    if (pageRef.current === 1 || reset) {
      console.log("first");
      setChatList(data.list);
    } else {
      setChatList((list) => list.concat(data.list));
    }
    loadingRef.current = false;
  }

  useEffect(() => {
    getDate(true);
  }, []);

  useEffect(() => {
    const callback = () => {
      pageRef.current = 1;
      getDate(true);
    };
    subscribe("fetchChatList", callback);
    return () => unsubscribe("fetchChatList", callback);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const div = loadMoreRef.current;
    if (div) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          getDate();
        }
      });
      observer.observe(div);
    }
    return () => {
      if (observer && div) {
        observer.unobserve(div);
      }
    };
  }, []);

  return (
    <div className="chatList">
      {groupList.map(([date, list]) => {
        return (
          <div key={date} className="dateList">
            <div className="dateTime">{date}</div>
            <ul>
              {list.map((chat) => {
                const isSelected = chat.id === selectedChat?.id;
                return (
                  <ChatItem key={chat.id} chat={chat} isSelected={isSelected} />
                );
              })}
            </ul>                </div>
        );
      })}
      <div ref={loadMoreRef}> &nbsp;more</div>
    </div>
  );
}
