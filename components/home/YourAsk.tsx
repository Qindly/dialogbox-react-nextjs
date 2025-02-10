import { ChatMessage } from "../../types/chat";
interface YouraskProps {
  message: ChatMessage;
  avatarURL: string;
}

export default function YourAsk({ message, avatarURL }: YouraskProps) {
  return (
    <>
      <div className="ask">
        <div className="askText">{message.text}</div>
        <img className="AskAvatar" src={avatarURL} />
      </div>
    </>
  );
}
