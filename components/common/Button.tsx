import { ReactNode } from "react";
import { IconType } from "react-icons";
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  children?: ReactNode;
  icon?: IconType;
  disabled?: boolean;
} & ComponentPropsWithoutRef<"button">;

export default function Button({
  children,
  icon: Icon,
  className = "",
  onClick = () => {},
  disabled = false,
}: ButtonProps) {
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    } else {
      onClick(event);
    }
  };
  return (
    <button
      onClick={handleOnClick}
      className={`button ${className} ${disabled ? "disabled" : ""}`}
    >
      {Icon && <Icon className="icon" />}
      {children}
    </button>
  );
}
