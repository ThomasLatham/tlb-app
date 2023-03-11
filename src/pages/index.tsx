import React from "react";
import Head from "next/head";

import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>{"Tom's Blog"}</title>
      </Head>
      <section className="flex">
        <div className="flex-col justify-evenly items-center text-center grow">
          <div className="flex-row">
            <h1>{"Hi I'm Tom."}</h1>
            <p> Will this be under?</p>
          </div>
          <div className="flex-row">
            <p>What about this guy?</p>
          </div>
          <div className="flex-row"></div>
        </div>
      </section>
    </Layout>
  );
}
