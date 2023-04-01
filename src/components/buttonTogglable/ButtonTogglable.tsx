import React, { useState } from "react";

interface Props {
  text: string;
  onClick: () => void;
}

const ButtonTogglable: React.FC<Props> = ({ text, onClick }) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const onClickInternal = () => {
    onClick();
    setIsToggled(!isToggled);
  };

  return (
    <button
      onClick={onClickInternal}
      className={`
        transition-colors duration-200
        ${
          isToggled
            ? "dark:outline-secondary-dark dark:bg-primary-dark bg-primary-light"
            : "dark:outline-side-dark dark:bg-primary-dark bg-back-light"
        }
        dark:text-trim-dark dark:bg-primary-dark hover:dark:outline-secondary-dark
        hover:dark:bg-primary-dark hover:bg-primary-light
        active:outline-2
        outline font-medium outline-[1.5px] mt-2 rounded-lg w-full sm:w-auto px-5 py-2.5 text-sm text-center`}
    >
      {text}
    </button>
  );
};

export default ButtonTogglable;
