export interface Chat {
  id: string;
  title: string;
  updateTime: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  chatId: string;
}

export interface MessageRequestBody {
  Allmessage: ChatMessage[];
}
