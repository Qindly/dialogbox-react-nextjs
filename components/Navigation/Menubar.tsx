import Button from "../common/Button";
import { useContext } from "react";
import { HiPlus } from "react-icons/hi";
import { LuPanelLeft } from "react-icons/lu";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";
export default function Menubar() {
  const {dispatch } = useContext(AppContext);
  function handleClick() {
    dispatch({
      type: ActionType.UPDATE,
      field: "displayNavigation",
      value: false,
    });
  }
  function createNewChat(){
    dispatch({
      type: ActionType.UPDATE,
      field: "selectedConversation",
      value: null
    });
  }
  return (
    <div className="menubar">
      <Button className="newDialog" icon={HiPlus}  onClick={createNewChat}>
        新建对话
      </Button>
      <Button
        onClick={handleClick}
        className="isShow"
        icon={LuPanelLeft}
      ></Button>
    </div>
  );
}
