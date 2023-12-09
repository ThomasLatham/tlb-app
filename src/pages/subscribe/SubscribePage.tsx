import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Prisma, User } from "@prisma/client";
import { cloneDeep } from "lodash";
import { Session } from "next-auth/core/types";

import ButtonBasic from "@/components/buttonBasic";

import Layout from "../../components/layout";

type UserWithTags = Prisma.UserGetPayload<{
  include: { tags: true };
}>;

/* SMART COMPONENT */
/*
 * - gets user data on login
 * -
 */

const SubscribePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [signInEmail, setSignInEmail] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>();
  const [userData, setUserData] = useState<UserWithTags>();

  useEffect(() => {
    if (status === "authenticated" && session.user?.email)
      fetch("/api/v1/users/self", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          console.log(data);
        });
  }, [status, session?.user?.email]);

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
        <AuthenticationDependentContent
          status={status}
          signInEmail={signInEmail}
          setSignInEmail={setSignInEmail}
          session={session}
        ></AuthenticationDependentContent>
      </div>
    </Layout>
  );
};

interface AuthenticationDependentContentProps {
  status: "authenticated" | "loading" | "unauthenticated";
  signInEmail: string;
  setSignInEmail: React.Dispatch<React.SetStateAction<string>>;
  session: Session | undefined | null;
}

/* AUTHENTICATION SWITCH */

const AuthenticationDependentContent: React.FC<AuthenticationDependentContentProps> = ({
  status,
  signInEmail,
  setSignInEmail,
  session,
}) => {
  if (status === "unauthenticated") {
    return <SignInForm signInEmail={signInEmail} setSignInEmail={setSignInEmail}></SignInForm>;
  } else if (status === "loading") {
    return <p className="mt-6 text-justify">Loading...</p>;
  } else {
    // then
    return <SubscriberSettings session={session}></SubscriberSettings>;
  }
};

/* SIGN-IN-FORM SECTION */

interface SignInFormProps {
  signInEmail: string;
  setSignInEmail: React.Dispatch<React.SetStateAction<string>>;
}

const SignInForm: React.FC<SignInFormProps> = ({ signInEmail, setSignInEmail }) => {
  return (
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
  );
};

/* SUBSCRIBER-SETTINGS SECTION */
/*
 * - should make the call to the update endpoint
 */

interface SubscriberSettingsProps {
  session: Session | null | undefined;
}

const SubscriberSettings: React.FC<SubscriberSettingsProps> = ({ session }) => {
  return (
    <Fragment>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-justify">
          Welcome, {session?.user?.name ?? session?.user?.email?.split("@")[0]}!
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // update settings
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
    </Fragment>
  );
};

interface TagSelectorProps {
  allTags: string[];
  subscribedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

const TagSelector: React.FC<TagSelectorProps> = ({ allTags, subscribedTags, setSelectedTags }) => {
  return <div></div>;
};

export default SubscribePage;
