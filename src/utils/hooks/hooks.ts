import { useEffect, useState } from "react";

import { THEME_TYPES } from "../../constants";
import { HeadingWithNestedHeadings } from "../../interfaces";

const getNestedHeadings = (headingElements: HTMLElement[]): HeadingWithNestedHeadings[] => {
  const nestedHeadings: HeadingWithNestedHeadings[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H1") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H2" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });
  return nestedHeadings;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<HeadingWithNestedHeadings[]>([]);

  useEffect(() => {
    const headingElements: HTMLElement[] = Array.from(document.querySelectorAll("h1, h2"));

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

// for tailwind css, need the change the root
const useThemePreference = (useDarkMode: boolean) => {
  const { THEME_DARK, THEME_LIGHT } = THEME_TYPES;
  useEffect(() => {
    const root: HTMLElement = document.documentElement;
    root.classList.remove(useDarkMode ? THEME_LIGHT : THEME_DARK);
    root.classList.add(useDarkMode ? THEME_DARK : THEME_LIGHT);
  });
};

const useOutsideClickAwareness = (ref: any) => {
  const [isClicked, setIsClicked] = useState<boolean>();
  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsClicked(true);
      } else {
        setIsClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return isClicked;
};

export { useHeadingsData, useOutsideClickAwareness, useThemePreference };
