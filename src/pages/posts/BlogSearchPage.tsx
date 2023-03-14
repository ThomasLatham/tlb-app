import React from "react";

import { getAllPostFrontmatters } from "../../utils/posts";
import Layout from "../../components/layout";
import PostSearchListEntry from "../../components/postSearchListEntry";
import { Frontmatter } from "@/interfaces";

interface Props {
  frontmatterArray: { id: string; frontmatter: Frontmatter }[];
}

const BlogSearchPage: React.FC<Props> = ({ frontmatterArray }) => {
  return (
    <Layout>
      <div className="flex flex-col items-center w-screen">
        {frontmatterArray?.map((postFM) => {
          return (
            <div className="w-8/12 sm:w-7/12 md:w-6/12" key={postFM.id}>
              <PostSearchListEntry postFM={postFM.frontmatter} />
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

const getStaticProps = async () => {
  const frontmatterArray = getAllPostFrontmatters();
  return {
    props: {
      frontmatterArray: frontmatterArray,
    },
  };
};

export { getStaticProps };
export default BlogSearchPage;
