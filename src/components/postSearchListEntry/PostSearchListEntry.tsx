import React from "react";

import { Frontmatter } from "../../interfaces";

interface Props {
  postFM: Frontmatter;
}

const PostSearchListEntry: React.FC<Props> = ({ postFM }) => {
  return (
    <div className="border-[1.5px] rounded px-2 my-2 dark:border-secondary-dark border-secondary-light">
      <p>{postFM.title}</p>
    </div>
  );
};

export default PostSearchListEntry;
