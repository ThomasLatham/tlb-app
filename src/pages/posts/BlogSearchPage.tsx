import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "@/components/layout";
import PostSearchListEntry from "@/components/postSearchListEntry";
import MultiSelectDropdown from "@/components/multiSelectDropdown";
import { Frontmatter } from "@/interfaces";
import { getFilteredPostFrontmatters, getAllTags } from "@/utils/contentRetrieval";

interface Props {
  frontmatterArray: { id: string; frontmatter: Frontmatter }[];
  allTags: string[];
}

const BlogSearchPage: React.FC<Props> = ({ frontmatterArray, allTags }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  const getFilteredPosts = () => {
    router.replace(`/posts?searchText=${searchText}&selectedTags=${selectedTags}`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-screen">
        <div>
          <div>
            <input type="text" />
            <button onClick={getFilteredPosts}>{"search"}</button>
          </div>
          <div>
            <MultiSelectDropdown
              options={allTags}
              selectedValues={selectedTags}
              setSelectedValues={setSelectedTags}
            ></MultiSelectDropdown>
          </div>
        </div>
        {frontmatterArray?.map((postFM) => {
          return (
            <div className="w-8/12 sm:w-7/12 md:w-6/12" key={postFM.id}>
              <Link href={`/posts/${postFM.id}`}>
                <PostSearchListEntry postFM={postFM.frontmatter} />
              </Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const searchText = context.query.searchText ? (context.query.searchText as string) : "";
  const selectedTags =
    context.query.selectedTags === "" || context.query.selectedTags === undefined
      ? await getAllTags()
      : [...(context.query.selectedTags as string).split(",")];
  console.log(selectedTags);
  return {
    props: {
      frontmatterArray: await getFilteredPostFrontmatters({
        searchText: searchText,
        tags: selectedTags,
      }),
      allTags: await getAllTags(),
    },
  };
};

export { getServerSideProps };
export default BlogSearchPage;
