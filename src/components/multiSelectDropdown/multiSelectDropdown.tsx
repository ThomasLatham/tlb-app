import React, { useRef, useState } from "react";

import { useOutsideClickAwareness } from "@/utils/hooks";

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  setSelectedValues,
}) => {
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
    <div className="flex items-center justify-center p-4" ref={optionsRef}>
      <button
        className="
            dark:text-trim-dark 
            dark:bg-side-dark 
            dark:hover:bg-primary- 
            focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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

      {/* Dropdown menu */}
      <div
        id="dropdown"
        className={`z-10 w-56 p-3 bg-white rounded-lg shadow ${showOptions ? "block" : "hidden"}`}
      >
        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Tag</h6>
        <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                readOnly
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />

              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
