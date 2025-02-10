"use client";
import Button from "../common/Button";
import { LuPanelLeft } from "react-icons/lu";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { ActionType } from "@/reducers/AppReducer";

interface HeaderProps {
  avatarURL: string;
}

export default function Header({ avatarURL }: HeaderProps) {
  const { state, dispatch } = useContext(AppContext);
  function handleClick() {
    dispatch({
      type: ActionType.UPDATE,
      field: "displayNavigation",
      value: true,
    });
  }
  return (
    <div className="Header">
      {!state.displayNavigation && (
        <Button
          onClick={handleClick}
          className="MainButton"
          icon={LuPanelLeft}
        ></Button>
      )}
      <div className="headerText">第一篇章</div>
      <img className="avatar" src={avatarURL} />
    </div>
  );
}
