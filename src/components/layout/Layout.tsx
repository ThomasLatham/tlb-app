import React from "react";
import Head from "next/head";

import { useAppSelector } from "../../redux/hooks";
import NavBar from "../navBar";
import Footer from "../footer";
import { userPreferences } from "../../ducks";
import { useThemePreference } from "../../utils/hooks";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);
  useThemePreference(useDarkMode);
  return (
    <div className="overflow-visible">
      <Head>
        <meta name="Tom Latham Blog" content="Whatever I feel like, gosh!" />
      </Head>
      <header className="sticky top-0 z-50" tabIndex={-1}>
        <NavBar />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
