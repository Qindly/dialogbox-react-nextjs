import { Chat } from "../../types/chat";
const order = ["今天", "昨天", "前天", "一周内", "一个月内", "一个月外"];
export function getChatByGroup(chatList: Chat[]) {
  const groupMap = new Map<string, Chat[]>();
  chatList.forEach((item) => {
    const now = new Date();
    const updateDate = new Date(item.updateTime);
    let key = "未知时间";
    const diffDay = Math.floor(
      (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDay < 1) {
      key = "今天";
    } else if (diffDay < 2) {
      key = "昨天";
    } else if (diffDay < 3) {
      key = "前天";
    } else if (diffDay < 7) {
      key = "一周内";
    } else if (diffDay < 31) {
      key = "一个月内";
    } else {
      key = "一个月外";
    }
    if (groupMap.has(key)) {
      groupMap.get(key)?.push(item);
    } else {
      groupMap.set(key, [item]);
    }
  });
  groupMap.forEach((item) => {
    item.sort((a, b) => {
      return a.updateTime - b.updateTime;
    });
  });
  const groupList = Array.from(groupMap).sort((a, b) => {
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  return groupList;
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("time is up");
    }, time);
  });
}
