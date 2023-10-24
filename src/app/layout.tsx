import React from "react";

import Footer from "@/components/footer";
import NavBar from "@/components/navBar";

import "../styles/globals.css";
import "../styles/syntaxHighlighting.css";
import Providers from "./providers/provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <head key="app">
        <link rel="shortcut icon" href="/myImages/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/myImages/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/myImages/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/myImages/favicon/favicon-16x16.png"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
        {/*The below tag makes the site actually fill the screen on mobile*/}
        <meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
      </head>
      <Providers>
        <body>
          <header className="sticky top-0 z-50" tabIndex={-1}>
            <NavBar />
          </header>
          <main className="min-h-[calc(100vh-126px)]">{children}</main>
          <div>
            <Footer />
          </div>
        </body>
      </Providers>
    </html>
  );
};

export default RootLayout;
