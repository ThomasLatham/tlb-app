import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import _ from "lodash";

import Layout from "@/components/layout";
import PostSearchListEntry from "@/components/postSearchListEntry";
import { PostFrontmatter } from "@/interfaces";
import { getFilteredPostFrontmatters, getAllTags } from "@/contentRetrieval/posts";
import ButtonBasic from "@/components/buttonBasic";
import ButtonTogglable from "@/components/buttonTogglable";

interface Props {
  frontmatterArray: { id: string; frontmatter: PostFrontmatter }[];
  allTags: string[];
}

const BlogSearchPage: React.FC<Props> = ({ frontmatterArray, allTags }) => {
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    router.query.selectedTags ? router.query.selectedTags.toString().split(",") : []
  );

  const getFilteredPosts = () => {
    router.replace(`/posts?searchText=${searchText}&selectedTags=${selectedTags}`, "/posts");
  };

  const toggleTag = (tag: string) => {
    let selectedTagsClone = _.cloneDeep(selectedTags);
    if (selectedTags.includes(tag)) {
      selectedTagsClone = selectedTagsClone.filter((selectedTag) => selectedTag !== tag);
    } else {
      selectedTagsClone = [...selectedTags, tag];
    }

    // this can be removed once all the categories listed on the homepage have at least one post
    selectedTagsClone = selectedTagsClone.filter((selectedTag) => {
      return allTags.includes(selectedTag);
    });

    setSelectedTags(selectedTagsClone);
  };

  useEffect(() => {
    getFilteredPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  return (
    <Layout>
      <Head key="search">
        <title>Post Search</title>
      </Head>
      <div className="flex flex-col items-center w-screen">
        <div className="flex mt-2 mb-2">
          <div className="pt-2 mx-2">
            <input
              type="text"
              className="
                dark:bg-primary-dark dark:border-side-dark dark:text-trim-dark
                hover:dark:border-secondary-dark hover:dark:placeholder-[#9CA3AF]
                bg-back-light
                hover:bg-primary-light hover:placeholder-back-light
                text-sm rounded-lg block w-full p-2.5 border-[1.5px]"
              placeholder="Search by post title..."
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getFilteredPosts();
                }
              }}
            ></input>
          </div>
          <div>
            <ButtonBasic onClick={getFilteredPosts}>Search</ButtonBasic>
          </div>
        </div>
        <div className="flex flex-wrap mt-2 mb-4">
          {allTags.map((tag, idx) => {
            return (
              <div className="mx-2" key={idx}>
                <ButtonTogglable
                  onClick={() => toggleTag(tag)}
                  isToggledInitially={selectedTags.includes(tag)}
                >{`#${tag}`}</ButtonTogglable>
              </div>
            );
          })}
        </div>
        {frontmatterArray?.length ? (
          frontmatterArray?.map((postFM) => {
            return (
              <div className="w-8/12 sm:w-7/12 md:w-6/12" key={postFM.id}>
                <Link href={`/posts/${postFM.id}`}>
                  <PostSearchListEntry postFM={postFM.frontmatter} />
                </Link>
              </div>
            );
          })
        ) : (
          <div className="mt-5">
            <p className="dark:text-trim-dark text-secondary-light text-lg">
              {/* the first condition can be removed once all the categories listed on 
              the homepage have at least one post */}
              {selectedTags.filter((selectedTag) => !allTags.includes(selectedTag)).length
                ? // eslint-disable-next-line quotes
                  'No posts yet exist for the "' +
                  selectedTags.filter((selectedTag) => !allTags.includes(selectedTag))[0] +
                  // eslint-disable-next-line quotes
                  '" tag.'
                : "No posts found."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const searchText = context.query.searchText ? (context.query.searchText as string) : "";
  const selectedTags =
    context.query.selectedTags === "" || context.query.selectedTags === undefined
      ? getAllTags()
      : [...(context.query.selectedTags as string).split(",")];
  return {
    props: {
      frontmatterArray: getFilteredPostFrontmatters({
        searchText: searchText,
        tags: selectedTags,
      }),
      allTags: getAllTags(),
    },
  };
};

export { getServerSideProps };
export default BlogSearchPage;
