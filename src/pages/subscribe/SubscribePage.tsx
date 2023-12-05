import React, { Fragment } from "react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import ButtonBasic from "@/components/buttonBasic";

import Layout from "../../components/layout";

const SubscribePage: React.FC = () => {
  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);

  return (
    <Layout>
      <Head key="subscribe">
        <title>{"Subscription Settings"}</title>
      </Head>
      <div
        className="
        flex flex-col items-center content-center justify-center 
        dark:text-trim-dark text-secondary-light 
        max-w-full"
      >
        <p className="mt-6 text-[30px] underline">Subscription Settings</p>
        {status !== "authenticated" ? (
          <Fragment>
            <p className="sm:pl-5 sm:mt-6 mt-6 text-justify">
              Please sign in to subscribe and to tailor your subscription settings.
            </p>
            <div className="sm:pl-5 sm:mt-2 mt-2 text-justify">
              <span className="mr-4">
                <ButtonBasic onClick={() => signIn("google")} text="Sign in with Google" />
              </span>
              <span>
                <ButtonBasic onClick={() => signIn("email")} text="Sign in with Email" />
              </span>
            </div>
          </Fragment>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  );
};

export default SubscribePage;
