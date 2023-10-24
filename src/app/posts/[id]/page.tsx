import { Metadata } from "next";

import { getAllPostIds, getPostById } from "@/contentRetrieval/posts";

import BlogPost from "./BlogPost";

const metadata: Metadata = {
  title: "Tom's Blog",
  description: "Whatever I feel like, gosh!",
};

const dynamicParams = false;

const generateStaticParams = async () => {
  return getAllPostIds();
};

const Page = async (params: any) => {
  const post = await getPostById(params.params.id as string);
  return <BlogPost code={post.code} frontmatter={post.frontmatter} />;
};

export default Page;
export { metadata, generateStaticParams, dynamicParams };
