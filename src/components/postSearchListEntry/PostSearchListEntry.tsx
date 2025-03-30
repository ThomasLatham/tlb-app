import React from "react";

import { formatDateString } from "@/utils/format";

import { PostFrontmatter } from "../../interfaces";

interface Props {
  postFM: PostFrontmatter;
}

const PostSearchListEntry: React.FC<Props> = ({ postFM }) => {
  const publishedString = `${formatDateString(postFM.datePublished)}`;

  return (
    <div className="group">
      <div
        className="
          border-[1.5px] rounded dark:border-side-dark border-secondary-light
          dark:group-hover:border-secondary-dark
          px-2 pb-2 my-2 text-left w-full
          dark:text-trim-dark text-secondary-light
          dark:bg-back-dark hover:bg-primary-light
        "
      >
        <p className="text-3xl ">{postFM.title}</p>
        <hr className="dark:group-hover:text-trim-dark my-2" />
        <div className="hidden md:block">
          <p>{postFM.description}</p>
          <hr className="dark:text-trim-dark my-2" />
        </div>
        <p className="mt-2 mb-0">{`✍️ By ${postFM.author}`}</p>
        <p className="my-0">{`🗓️ ${publishedString}`}</p>
        <p className="my-0">{`🕑 ${postFM.readingTime.toFixed(0)} minutes`}</p>
        <p className="my-0">{`#️⃣ ${postFM.tags.join(", ")}`}</p>
      </div>
    </div>
  );
};

export default PostSearchListEntry;
