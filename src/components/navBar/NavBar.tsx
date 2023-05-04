import React, { useState, useRef } from "react";
import Link from "next/link";

import { NAV_OPTIONS } from "@/constants";

import ThemeSwitch from "../themeSwitch";
import { useAppSelector } from "../../redux/hooks";
import { userPreferences } from "../../ducks";
import { useOutsideClickAwareness } from "../../utils/hooks";
import Logo from "../../../public/myImages/logo.svg";
import tailwindConfig from "../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const NavBar: React.FC = () => {
  const [showNav, setShowNav] = useState(false);
  const sideBarRef = useRef(null);
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);

  const toggleNavItems = () => {
    setShowNav(!showNav);
  };

  const sideBarOutsideClick = useOutsideClickAwareness(sideBarRef);

  if (sideBarOutsideClick && showNav) {
    setShowNav(false);
  }

  return (
    <nav className="flex border-b-2 border-secondary-light dark:border-b-3 dark:border-b-secondary-dark items-center justify-between flex-wrap bg-primary-light dark:bg-primary-dark p-2">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <Link href={"/"}>
          <Logo
            width="96"
            height="54"
            className="mt-0.5 ml-2 fill-secondary-light dark:fill-secondary-dark hover:fill-trim-light dark:hover:fill-trim-dark"
          />
        </Link>
      </div>
      <div className="ml-auto pr-4">
        <ThemeSwitch />
      </div>
      <section ref={sideBarRef} className="MOBILE-MENU flex md:hidden overflow-hidden">
        <div className="block">
          <div className="HAMBURGER-ICON space-y-1.5 pr-2 group" onClick={toggleNavItems}>
            <span className="block h-0.5 w-6 group-hover:bg-trim-light bg-secondary-light dark:group-hover:bg-trim-dark dark:bg-secondary-dark"></span>
            <span className="block h-0.5 w-6 group-hover:bg-trim-light bg-secondary-light dark:group-hover:bg-trim-dark dark:bg-secondary-dark"></span>
            <span className="block h-0.5 w-6 group-hover:bg-trim-light bg-secondary-light dark:group-hover:bg-trim-dark dark:bg-secondary-dark"></span>
          </div>
        </div>
        <div className={`menuNav ${showNav ? "show" : "hide"}`}>
          <div className="absolute top-0 right-0 pr-3 pt-4" onClick={() => setShowNav(false)}>
            <svg
              className="h-8 w-8 text-secondary-light hover:text-trim-light dark:text-secondary-dark dark:hover:text-trim-dark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <ul className="NAVIGATION-MOBILE-OPEN flex flex-col items-center">
            {NAV_OPTIONS.map((option, idx) => {
              return (
                <li
                  key={idx}
                  className={
                    "text-secondary-light hover:text-trim-light dark:text-secondary-dark dark:hover:text-trim-dark mt-5"
                  }
                  onClick={toggleNavItems}
                >
                  <Link href={option[1]}>{option[0]}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <div className="hidden md:flex md:items-center md:justify-self-end">
        <div className="text-sm md:flex-shrink">
          {NAV_OPTIONS.map((option, idx) => {
            return (
              <Link
                key={idx}
                href={option[1]}
                className="block mt-4 md:inline-block md:mt-0 text-secondary-light hover:text-trim-light dark:text-secondary-dark dark:hover:text-trim-dark mr-4"
              >
                {option[0]}
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
      .menuNav {
        border-left: solid ${
          useDarkMode ? colors["secondary-dark"] : colors["secondary-light"]
        }; 3px;
        top: 0;
        left: calc(100vw - 200px);
        background: ${useDarkMode ? colors["side-dark"] : colors["side-light"]};
        z-index: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .hide {
        transition: 
          visibility 0s ease 0.4s,
          opacity 0s ease 0.4s,
          height 0s ease 0.4s,
          width 0s ease 0.4s,
          transform 0.4s ease;
        transform: translateX(200px);
        visibility: hidden;
        position: fixed;
        height: 0;
        opacity: 0;
        width: 0;
      }
      .show {
        transition: transform ease 0.4s;
        opacity: 1;
        position: fixed;
        width: 200px;
        height: 100vh;
      }
    `}</style>
    </nav>
  );
};

export default NavBar;
