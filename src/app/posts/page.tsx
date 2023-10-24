import { Metadata } from "next";

import { getAllTags, getFilteredPostFrontmatters } from "@/contentRetrieval/posts";

import BlogSearchPage from "./BlogSearchPage";

const metadata: Metadata = {
  title: "Post Search",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = async (searchParams: any) => {
  const searchText = searchParams.searchText ? (searchParams.searchText as string) : "";
  const selectedTags =
    searchParams.selectedTags === "" || searchParams.selectedTags === undefined
      ? getAllTags()
      : [...(searchParams.selectedTags as string).split(",")];
  const frontmatterArray = getFilteredPostFrontmatters({
    searchText: searchText,
    tags: selectedTags,
  });

  return <BlogSearchPage frontmatterArray={frontmatterArray} allTags={getAllTags()} />;
};

export default Page;
export { metadata };
