import React from "react";
import Link from "next/link";

import { NAV_OPTIONS } from "@/constants";
import { userPreferences } from "@/ducks";
import { useAppSelector } from "@/redux/hooks";

import GitHubLogoWhite from "../../../public/otherImages/github-mark-white.svg";
import GitHubLogoDark from "../../../public/otherImages/github-mark.svg";

const Footer: React.FC = () => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);

  return (
    <footer>
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center dark:text-trim-dark text-secondary-light">
          © 2025 Thomas Latham. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center text-sm font-medium dark:text-trim-dark text-secondary-light mt-1 md:mt-0">
          {NAV_OPTIONS.map((option, idx) => {
            return (
              <li
                key={idx}
                className="mr-4 hover:dark:text-secondary-dark hover:text-primary-light md:mr-6"
              >
                <Link href={option[1]}>{option[0]}</Link>
              </li>
            );
          })}
          <li>
            <Link href="https://github.com/ThomasLatham">
              {useDarkMode ? (
                <GitHubLogoWhite viewBox="0 0 100 100" height="25" width="22" />
              ) : (
                <GitHubLogoDark viewBox="0 0 100 100" height="25" width="22" />
              )}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
