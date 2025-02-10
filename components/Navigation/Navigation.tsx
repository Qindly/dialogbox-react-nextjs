import { useContext } from "react";
import "./Navigation.css";
import Menubar from "./Menubar";
import { AppContext } from "../AppContext";
import ChatList from "./ChatList";
export default function Navigation() {
  const { state } = useContext(AppContext);
  return (
    <>
      {state.displayNavigation && (
        <nav className="navigation">
          <Menubar />
          <ChatList />
        </nav>
      )}
    </>
  );
}
