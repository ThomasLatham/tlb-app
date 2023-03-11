import React from "react";

import { Frontmatter } from "../../interfaces";

interface Props {
  postFM: Frontmatter;
}

const PostSearchListEntry: React.FC<Props> = ({ postFM }) => {
  return (
    <div>
      <p>{postFM.title}</p>
    </div>
  );
};

export default PostSearchListEntry;
