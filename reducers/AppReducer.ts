import { Chat, Conversation } from "@/types/Conversation";

//state为整个app的状态
export type State = {
  displayNavigation: boolean;
  chatList: Chat[];
  streamingId: string;
  selectedConversation?: Conversation;
};

export enum ActionType {
  UPDATE = "UPDATE",
  ADD_CHAT = "ADD_CHAT",
  UPDATE_CHAT = "UPDATE_CHAT",
  REMOVE_CHAT = "REMOVE_CHAT",
}

//对于message的专门定义的action类型
type ChatAction = {
  type:
    | ActionType.ADD_CHAT
    | ActionType.UPDATE_CHAT
    | ActionType.REMOVE_CHAT;
  chat: Chat;
};

//泛用型的update
type UpdateAction = {
  type: ActionType.UPDATE;
  field: string;
  value: unknown;
};

export type Action = UpdateAction | ChatAction;

export const initState: State = {
  displayNavigation: true,
  chatList: [],
  streamingId: "",
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE:
      return {
        ...state,
        [action.field]: action.value,
      };
    case ActionType.ADD_CHAT:
      return {
        ...state,
        chatList: [...state.chatList, action.chat],
      };
    case ActionType.UPDATE_CHAT: {
      const chatList = state.chatList.map((chat) => {
        if (chat.id === action.chat.id) {
          return action.chat;
        } else {
          return chat;
        }
      });
      return {
        ...state,
        chatList,
      };
    }
    case ActionType.REMOVE_CHAT: {
      const chatList = state.chatList.filter(
        (chat) => chat.id !== action.chat.id
      );
      return {
        ...state,
        chatList,
      };
    }
    default:
      throw new Error();
  }
}
