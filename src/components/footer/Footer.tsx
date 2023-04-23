import React from "react";
import Link from "next/link";

import { NAV_OPTIONS } from "@/constants";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center dark:text-trim-dark text-secondary-light">
          © 2023 Tom Latham. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center text-sm font-medium dark:text-trim-dark text-secondary-light mt-0">
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
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
