import React, { ChangeEventHandler, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import _, { divide } from "lodash";

import Layout from "@/components/layout";
import PostSearchListEntry from "@/components/postSearchListEntry";
import MultiSelectDropdown from "@/components/multiSelectDropdown";
import { Frontmatter } from "@/interfaces";
import { getFilteredPostFrontmatters, getAllTags } from "@/utils/contentRetrieval";
import ButtonBasic from "@/components/buttonBasic";
import ButtonTogglable from "@/components/buttonTogglable";

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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    getFilteredPosts();
  }, [selectedTags]);

  return (
    <Layout>
      <div className="flex flex-col items-center w-screen">
        <div className="flex mt-2 mb-2">
          <div className="pt-2 mx-2">
            <input
              type="text"
              className="
                dark:bg-primary-dark dark:border-side-dark dark:text-trim-dark
                hover:dark:border-secondary-dark
                text-sm rounded-lg block w-full p-2.5 border-[1.5px]"
              placeholder="Search by post title..."
              onChange={(e) => setSearchText(e.target.value)}
            ></input>
          </div>
          <div>
            <ButtonBasic onClick={getFilteredPosts} text={"Search"} />
          </div>
        </div>
        <div className="flex mt-2 mb-4">
          {allTags.map((tag, idx) => {
            return (
              <div className="mx-2">
                <ButtonTogglable key={idx} onClick={() => toggleTag(tag)} text={`#${tag}`} />
              </div>
            );
          })}
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
