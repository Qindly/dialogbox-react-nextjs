import React from "react";
import MainPage from "./MainPage";
import Header from "./Header";
import Footer from "./Footer";
import "./MyMain.css";
import { ChatFunctionProvider } from "@/components/ChatFunction";
import CozeTryButton from "@/components/home/coze-try";
const touxiang1 =
  "https://tse4-mm.cn.bing.net/th/id/OIP-C.tSG2_srZO8w4T0PaZNStkgAAAA?rs=1&pid=ImgDetMain";
export default function MyMain() {
  return (
    <main className="myMain">
      <CozeTryButton />
      <ChatFunctionProvider>
        <Header avatarURL={touxiang1} />
        <MainPage avatarURL={touxiang1} />
        <Footer />
      </ChatFunctionProvider>
    </main>
  );
}
