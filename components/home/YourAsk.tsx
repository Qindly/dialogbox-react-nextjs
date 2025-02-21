import { Chat} from "../../types/Conversation";
interface YouraskProps {
  chat: Chat;
  avatarURL: string;
}

export default function YourAsk({ chat, avatarURL }: YouraskProps) {
  return (
    <>
      <div className="ask">
        <div className="askText">{chat.text}</div>
        <img className="AskAvatar" src={avatarURL} />
      </div>
    </>
  );
}
