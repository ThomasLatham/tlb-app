import { Metadata } from "next";

import { getRandomPostId } from "@/contentRetrieval/posts";

import HomePage from "./HomePage";

const metadata: Metadata = {
  title: "Tom's Blog",
  description: "Whatever I feel like, gosh!",
};

const Page = async () => {
  return <HomePage randomPostId={getRandomPostId()} />;
};

export default Page;
export { metadata };
