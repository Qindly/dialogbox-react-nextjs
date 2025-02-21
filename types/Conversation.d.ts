//定义chat
export interface Conversation {
  id: string;
  title: string;
  updateTime: number;
}

//定义chat中每个的聊天消息
export interface Chat {
  id: string;
  role: "user" | "assistant";
  text: string;
  conversationId: string;
}

//定义chat中每个的聊天消息的请求体
export interface ChatRequestBody {
  chats: Chat[];
}
