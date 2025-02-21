import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { Conversation } from "../../types/Conversation";
import { getConversationByGroup } from "../common/util";
import ConversationItem from "./ConversationItem";
import { EventBusContext } from "../EventBusContext";
import { AppContext } from "../AppContext";
import { CozeAPI } from "@coze/api";
//在chatlist中，里面的每个chat是怎么渲染的，首先是定义一个chatList,这个用于存在chatlist页面时的数据
//然后是定义一个groupList,这个用于存在chatlist页面时的数据
//而chatlist里面的数据，是通过getData()函数来获取的
//在data里面，就有个通过fetch来获取数据，从而获取到list

const client = new CozeAPI({
  token: process.env.NEXT_PUBLIC_COZE_API_TOKEN as string,
  baseURL: process.env.NEXT_PUBLIC_COZE_API_BASE_URL as string,
  allowPersonalAccessTokenInBrowser: true,
});

export default function ChatList() {
  const [ConversationList, setConversationList] = useState<Conversation[]>([]);

  const {
    state: { selectedConversation },
  } = useContext(AppContext);
  const { subscribe, unsubscribe } = useContext(EventBusContext);

  const pageRef = useRef(1);
  const loadMoreRef = useRef(null);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(false);

  const groupList = useMemo(() => {
    return getConversationByGroup(ConversationList);
  }, [ConversationList]);

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
    // const response = await client.conversations.messages.retrieve("1111");
    // if (!response.ok) {
    //   loadingRef.current = false;
    //   console.log(response);
    //   return;
    // }

    //   const { data } = await response.json();
    //   hasMoreRef.current = data.hasMore;
    //   console.log("pageRef", pageRef.current);
    //   if (pageRef.current === 1 || reset) {
    //     console.log("first");
    //     setConversationList(data.list);
    //   } else {
    //     setConversationList((list) => list.concat(data.list));
    //   }
    //   loadingRef.current = false;
  }

  useEffect(() => {
    getDate(true);
  }, []);

  useEffect(() => {
    const callback = () => {
      pageRef.current = 1;
      getDate(true);
    };
    subscribe("fetchConversationList", callback);
    return () => unsubscribe("fetchConversationList", callback);
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
              {list.map((conversation) => {
                const isSelected = conversation.id === selectedConversation?.id;
                return (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={isSelected}
                  />
                );
              })}
            </ul>{" "}
          </div>
        );
      })}
      <div ref={loadMoreRef}> &nbsp;more</div>
    </div>
  );
}
