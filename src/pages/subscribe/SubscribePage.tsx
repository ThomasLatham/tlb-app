import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Prisma, User } from "@prisma/client";

import ButtonBasic from "@/components/buttonBasic";

import Layout from "../../components/layout";

type UserWithTags = Prisma.UserGetPayload<{
  include: { tags: true };
}>;

const SubscribePage: React.FC = () => {
  const { data: session, status } = useSession();

  const [signInEmail, setSignInEmail] = useState<string>();
  const [userData, setUserData] = useState<UserWithTags>();

  useEffect(() => {
    if (status === "authenticated" && session.user?.email)
      fetch("/api/")
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
        });
  }, []);

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
          /* ************ *
           * SIGN-IN FORM *
           * ************ */
          <Fragment>
            <p className="mt-6 text-justify">
              Please sign in to subscribe and/or to tailor your subscription settings.
            </p>
            <div className="flex flex-col items-center mt-5">
              <div>
                <ButtonBasic onClick={() => signIn("google")}>Sign in with Google</ButtonBasic>
              </div>
              <p className="my-5"> —————— or —————— </p>
              <form
                className="flex flex-row items-baseline"
                onSubmit={(e) => {
                  e.preventDefault();
                  signIn("email", { email: signInEmail });
                }}
              >
                <span>
                  <input
                    type="email"
                    className="
                      dark:bg-primary-dark dark:border-side-dark dark:text-trim-dark
                      hover:dark:border-secondary-dark hover:dark:placeholder-[#9CA3AF]
                      bg-back-light
                      hover:bg-primary-light hover:placeholder-back-light
                      text-sm rounded-lg block w-full p-2.5 border-[1.5px]"
                    placeholder="someone@example.com"
                    onChange={(e) => setSignInEmail(e.target.value)}
                  ></input>
                </span>
                <span className="ml-4">
                  <ButtonBasic type="submit">Sign in with Email</ButtonBasic>
                </span>
              </form>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {status === "loading" ? (
              /* ************** *
               * LOADING SCREEN *
               * ************** */
              <p className="mt-6 text-justify">Loading...</p>
            ) : (
              /* ***************************** *
               * SUBSCRIPTION-PREFERENCES FORM *
               * ***************************** */
              <div className="mt-6 flex flex-col items-center">
                <p className="text-justify">
                  Welcome, {session?.user?.name ?? session?.user?.email?.split("@")[0]}!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    signIn("email", { email: signInEmail });
                  }}
                >
                  <div>
                    <span>
                      <span className="mr-4">
                        <ButtonBasic type="submit">Update Preferences</ButtonBasic>
                      </span>
                      <ButtonBasic onClick={() => signOut()}>Sign Out</ButtonBasic>
                    </span>
                  </div>
                </form>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </Layout>
  );
};

export default SubscribePage;
