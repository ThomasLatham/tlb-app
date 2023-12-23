import React from "react";

interface Props {
  onClick?: () => void;
  children?: string;
  type?: "button" | "submit" | "reset";
}

const ButtonBasic: React.FC<Props> = ({ onClick, children, type }) => {
  type = type ?? "button";

  return (
    <button
      onClick={onClick}
      type={type}
      className="
        transition-colors duration-200
        dark:bg-primary-dark dark:outline-side-dark dark:text-trim-dark
        hover:dark:outline-secondary-dark
        hover:dark:bg-primary-dark hover:bg-primary-light
        active:outline-2 outline
        font-medium outline-[1.5px] mt-2 rounded-lg w-full sm:w-auto px-5 py-2.5 text-sm text-center"
    >
      {children}
    </button>
  );
};

export default ButtonBasic;
