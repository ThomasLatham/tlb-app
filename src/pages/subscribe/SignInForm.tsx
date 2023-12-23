import { signIn } from "next-auth/react";
import { Fragment, useState } from "react";

import ButtonBasic from "@/components/buttonBasic";

const SignInForm: React.FC = () => {
  const [signInEmail, setSignInEmail] = useState<string>("");

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

export default SignInForm;
