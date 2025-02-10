import { ReactNode, memo } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}
function Markdown({ children }: MarkdownProps) {
  return <ReactMarkdown>
    {children}
  </ReactMarkdown>;
}


export default memo(Markdown)
