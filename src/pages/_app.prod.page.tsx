import React from "react";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";

import store, { persistor } from "../redux/store";
import "../styles/globals.css";
import "../styles/syntaxHighlighting.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head key="app">
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
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default App;
