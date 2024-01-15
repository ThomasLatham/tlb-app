import { signIn } from "next-auth/react";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";

import ButtonBasic from "@/components/buttonBasic";
import { userPreferences } from "@/ducks";
import { useAppSelector } from "@/redux/hooks";

import tailwindConfig from "../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const SignInForm: React.FC = () => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);

  const [signInEmail, setSignInEmail] = useState<string>("");
  const [emailSignInConfirmationMessage, setEmailSignInConfirmationMessage] = useState<string>("");
  const [isAwaitingEmailSignInResponse, setIsAwaitingEmailSignInResponse] =
    useState<boolean>(false);

  useEffect(() => {
    if (emailSignInConfirmationMessage) {
      setTimeout(() => {
        setEmailSignInConfirmationMessage("");
      }, 10000);
    }
  }, [emailSignInConfirmationMessage]);

  const emailSignInFlow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInEmail("");
    setIsAwaitingEmailSignInResponse(true);
    signIn("email", { email: signInEmail, redirect: false })
      .then(
        () => {
          setEmailSignInConfirmationMessage(
            `An email with a sign-in link has been sent to ${signInEmail} and will arrive within the next 5 minutes.
If you experience any issues, please reach out to contact@tomlatham.blog.`
          );
        },
        () => {
          setEmailSignInConfirmationMessage("Something went wrong.");
        }
      )
      .finally(() => setIsAwaitingEmailSignInResponse(false));
  };

  return (
    <Fragment>
      <p className="mt-6 text-center mx-4 md:mx-0">
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
            emailSignInFlow(e);
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
              value={signInEmail}
            ></input>
          </span>
          <span className="ml-4">
            <ButtonBasic type="submit">Sign in with Email</ButtonBasic>
          </span>
        </form>
        {isAwaitingEmailSignInResponse ? (
          <div className="mt-4">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color={useDarkMode ? colors["trim-dark"] : colors["secondary-light"]}
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          emailSignInConfirmationMessage.split("\n").map((line, idx) => {
            return (
              <p key={idx} className="sm:px-4 px-20 pt-4">
                {line}
              </p>
            );
          })
        )}
      </div>
    </Fragment>
  );
};

export default SignInForm;
