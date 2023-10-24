import { Metadata } from "next";

import AboutPage from "./AboutPage";

const metadata: Metadata = {
  title: "About Tom's Blog",
};

const Page = async () => {
  return <AboutPage />;
};

export default Page;
export { metadata };
