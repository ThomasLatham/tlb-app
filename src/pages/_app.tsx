import React from "react";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "../redux/store";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head key="app">
          <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};

export default App;
