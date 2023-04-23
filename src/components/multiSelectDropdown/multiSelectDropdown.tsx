import React, { useRef, useState } from "react";

import { useOutsideClickAwareness } from "@/utils/hooks";

import tailwindConfig from "../../../tailwind.config";

interface Props {
  options: string[];
  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;
}

const colors = tailwindConfig.theme.colors;

const MultiSelectDropdown: React.FC<Props> = ({ options, selectedValues, setSelectedValues }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleOptionClick = (value: string) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const sideBarOutsideClick = useOutsideClickAwareness(optionsRef);
  if (sideBarOutsideClick && showOptions) {
    setShowOptions(false);
  }

  return (
    <div className="flex-col flex items-center px-4 pt-2 dark:text-trim-dark" ref={optionsRef}>
      <div className="flex flex-row items-center">
        <div className="grow"></div>
        <button
          className={`
            items-start flex
            dark:bg-primary-dark 
            font-medium rounded-lg text-sm 
            px-4 py-2.5 
            border-[1.5px] ${
              showOptions ? "dark:border-secondary-dark" : "dark:border-side-dark"
            } dark:hover:border-secondary-dark `}
          type="button"
          onClick={toggleOptions}
        >
          Filter by tag
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div className="grow"></div>
      </div>

      {/* Dropdown menu */}
      <div className="flex flex-row items-center">
        <div
          className={`z-10 mt-2 dark:border-side-dark dark:border-2 rounded-lg ${
            showOptions ? "visible" : "invisible"
          }`}
        >
          <ul className="space-y-2 text-sm py-1" aria-labelledby="dropdownDefault">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  readOnly
                  className="w-4 h-4 rounded text-primary-600 dark:accent-side-dark ml-2"
                />

                <label className="mx-2 text-sm font-medium">{option}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
