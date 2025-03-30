import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Head from "next/head";

import Layout from "@/components/layout";
import { getBasePath } from "@/utils/general";

interface Props {
  isAuthenticated: boolean;
  errorMessage: string;
}

const UnsubscribeConfirmationPage: React.FC<Props> = ({ isAuthenticated, errorMessage }) => {
  const router = useRouter();
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState<number>(10);

  useEffect(() => {
    if (secondsUntilRedirect <= 0) {
      router.push(getBasePath());
    } else {
      setTimeout(() => {
        setSecondsUntilRedirect(secondsUntilRedirect - 1);
      }, 1000);
    }
  }, [secondsUntilRedirect]);
  if (isAuthenticated) {
    return (
      <Layout>
        <Head key="unsubscribe-confirmation">
          <title>{"Unsubscribe Confirmation"}</title>
        </Head>
        <div
          className="
      flex flex-col items-center content-center justify-center 
      dark:text-trim-dark text-secondary-light 
      max-w-full"
        >
          <p className="mt-6 text-[30px] underline">Unsubscribe Confirmation</p>
          <div className="flex flex-col sm:flex-row items-center px-4 lg:px-44 sm:mt-4">
            <p className="sm:pl-5 sm:mt-0 mt-2 text-justify">
              {`You've successfully unsubscribed from all emails. You will be redirected to the homepage in ${secondsUntilRedirect} seconds.`}
            </p>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Head key="unauthorized">
          <title>{"Unauthorized"}</title>
        </Head>
        <div
          className="
  flex flex-col items-center content-center justify-center 
  dark:text-trim-dark text-secondary-light 
  max-w-full"
        >
          <p className="mt-6 text-[30px] underline">Unauthorized</p>
          <div className="flex flex-col items-center px-4 lg:px-44 sm:mt-4">
            <p className="sm:pl-5 sm:mt-0 mt-2 text-justify">
              {"You're not authorized to view this page, or it's unavailable at this time."}
            </p>
            <p className="sm:pl-5 sm:mt-0 mt-2 text-justify">
              {` You will be redirected to the homepage in ${secondsUntilRedirect} seconds.`}
            </p>
          </div>
        </div>
      </Layout>
    );
  }
};

const getServerSideProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.token || params.token instanceof Array) {
    return {
      props: {
        isAuthenticated: false,
        errorMessage: "Token invalid or not present.",
      },
    };
  }

  if (!process.env.JWT_SECRET) {
    return {
      props: {
        isAuthenticated: false,
        errorMessage: "Sorry, something went wrong on our end.",
      },
    };
  }

  try {
    jwt.verify(params.token, process.env.JWT_SECRET);
  } catch (err: any) {
    return {
      props: {
        isAuthenticated: false,
        errorMessage: "Invalid token: " + err.message,
      },
    };
  }

  return {
    props: {
      isAuthenticated: true,
      errorMessage: "",
    },
  };
};

export { getServerSideProps };
export default UnsubscribeConfirmationPage;
