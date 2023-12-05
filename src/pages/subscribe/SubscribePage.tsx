import React from "react";
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
        <title>{"Subscribe"}</title>
      </Head>
      <div>
        <ButtonBasic onClick={() => signIn()} text="Sign In" />
      </div>
    </Layout>
  );
};

export default SubscribePage;
