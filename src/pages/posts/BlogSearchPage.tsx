import React from "react";

import { getAllPostFrontmatters } from "../../utils/posts";
import Layout from "../../components/layout";
import PostSearchListEntry from "../../components/postSearchListEntry";

const BlogSearchPage: React.FC = () => {
  const frontmatterArray = getAllPostFrontmatters();

  return (
    <Layout>
      <div className="flex flex-col items-center h-screen w-screen">
        <input></input>
        {/* {frontmatterArray?.map((postFM) => {
          return (
            <div key={postFM.id}>
              <PostSearchListEntry postFM={postFM.frontmatter} />
            </div>
          );
        })} */}
      </div>
    </Layout>
  );
};

export default BlogSearchPage;
