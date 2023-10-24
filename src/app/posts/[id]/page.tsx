import { Metadata } from "next";

import { getAllPostIds } from "@/contentRetrieval/posts";

import BlogPost from "./BlogPost";

const metadata: Metadata = {
  title: "Tom's Blog",
  description: "Whatever I feel like, gosh!",
};

const dynamicParams = false;

const generateStaticParams = async () => {
  return getAllPostIds();
};

const Page = async (searchParams: any) => {
  return <BlogPost code={} frontmatter={} />;
};

export default Page;
export { metadata, generateStaticParams, dynamicParams };
