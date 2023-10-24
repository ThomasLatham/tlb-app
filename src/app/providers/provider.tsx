"use client";

import { PropsWithChildren } from "react";

import ReduxProvider from "./ReduxProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ReduxProvider>{children}</ReduxProvider>
    </>
  );
};

export default Providers;
