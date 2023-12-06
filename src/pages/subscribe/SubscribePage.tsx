import React, { Fragment, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import ButtonBasic from "@/components/buttonBasic";

import Layout from "../../components/layout";

const SubscribePage: React.FC = () => {
  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);

  const [signInEmail, setSignInEmail] = useState<string>();

  return (
    <Layout>
      <Head key="subscribe">
        <title>{"Subscription Settings"}</title>
      </Head>
      <div
        className="
        flex flex-col items-center
        dark:text-trim-dark text-secondary-light 
        max-w-full"
      >
        <p className="mt-6 text-[30px] underline">Subscription Settings</p>
        {status === "unauthenticated" ? (
          <Fragment>
            <p className="sm:pl-5 sm:mt-6 mt-6 text-justify">
              Please sign in to subscribe and to tailor your subscription settings.
            </p>
            <div className="flex flex-col items-center sm:pl-5 mt-5">
              <div>
                <ButtonBasic onClick={() => signIn("google")}>Sign in with Google</ButtonBasic>
              </div>
              <p className="my-5"> —————— or —————— </p>
              <div className="flex flex-row items-baseline">
                <span>
                  <input
                    type="text"
                    className="
                dark:bg-primary-dark dark:border-side-dark dark:text-trim-dark
                hover:dark:border-secondary-dark hover:dark:placeholder-[#9CA3AF]
                bg-back-light
                hover:bg-primary-light hover:placeholder-back-light
                text-sm rounded-lg block w-full p-2.5 border-[1.5px]"
                    placeholder="someone@example.com"
                    onChange={(e) => setSignInEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        signIn("email", { email: signInEmail });
                      }
                    }}
                  ></input>
                </span>
                <span className="ml-4">
                  <ButtonBasic onClick={() => signIn("email", { email: signInEmail })}>
                    Sign in with Email
                  </ButtonBasic>
                </span>
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {status === "loading" ? (
              <p className="sm:pl-5 sm:mt-6 mt-6 text-justify">Loading...</p>
            ) : (
              <div className="mt-6">
                <span>
                  <ButtonBasic onClick={() => signOut()}>Sign Out</ButtonBasic>
                </span>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </Layout>
  );
};

export default SubscribePage;
