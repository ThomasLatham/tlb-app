import React from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";

import Layout from "../../components/layout";
import SubscriberSettings from "./SubscriberSettings";
import SignInForm from "./SignInForm";

const SubscribePage: React.FC = () => {
  const { data: session, status } = useSession();

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
          session={session}
        ></AuthenticationDependentContent>
      </div>
    </Layout>
  );
};

interface AuthenticationDependentContentProps {
  status: "authenticated" | "loading" | "unauthenticated";
  session: Session | undefined | null;
}

const AuthenticationDependentContent: React.FC<AuthenticationDependentContentProps> = ({
  status,
  session,
}) => {
  if (status === "unauthenticated") {
    return <SignInForm></SignInForm>;
  } else if (status === "loading") {
    return <p className="mt-6 text-justify">Loading...</p>;
  } else {
    return <SubscriberSettings session={session}></SubscriberSettings>;
  }
};

export default SubscribePage;
