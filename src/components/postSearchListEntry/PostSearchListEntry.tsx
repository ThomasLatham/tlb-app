import { formatDateString } from "@/utils/format";
import React from "react";

import { Frontmatter } from "../../interfaces";

interface Props {
  postFM: Frontmatter;
}

const PostSearchListEntry: React.FC<Props> = ({ postFM }) => {
  const publishedString = `${formatDateString(postFM.datePublished)}`;

  const updatedString = postFM.lastUpdated ? `Updated ${formatDateString(postFM.lastUpdated)}` : "";
  return (
    <div
      className="
        border-[1.5px] rounded dark:border-secondary-dark border-secondary-light
        px-2 pb-2 my-2 text-left w-full
      dark:text-trim-dark text-secondary-light"
    >
      <p className="text-3xl">{postFM.title}</p>
      <hr className="dark:text-secondary-dark my-2" />
      <div className="hidden md:block">
        <p>{postFM.description}</p>
        <hr className="dark:text-secondary-dark my-2" />
      </div>
      <p className="mt-2 mb-0">{`✍️ By ${postFM.author}`}</p>
      <p className="my-0">{`🗓️ ${publishedString}`}</p>
      <p className="my-0">{`#️⃣ ${postFM.tags.join(", ")}`}</p>
    </div>
  );
};

export default PostSearchListEntry;
