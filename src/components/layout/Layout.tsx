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
    <div className="overflow-clip">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
        <meta name="Tom Latham Blog" content="Whatever I feel like, gosh!" />
        {/*The below tag makes the site actually fill the screen on mobile*/}
        <meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
      </Head>
      <header className="sticky top-0 z-50" tabIndex={-1}>
        <NavBar />
      </header>
      <main className="min-h-[calc(100vh-126px)]">{children}</main>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
