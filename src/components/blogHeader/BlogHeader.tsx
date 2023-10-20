import React from "react";

import { formatDateString } from "@/utils/format";
import { PostFrontmatter } from "@/interfaces";

interface Props {
  postFrontmatter: PostFrontmatter;
}

const BlogHeader: React.FC<Props> = ({ postFrontmatter }) => {
  const publishedString = `Published ${formatDateString(postFrontmatter.datePublished)}`;

  const updatedString = postFrontmatter.lastUpdated
    ? `Last updated ${formatDateString(postFrontmatter.lastUpdated)}`
    : "";

  return (
    <div className="flex flex-col">
      <div className="text-left">
        <p className="text-5xl my-0">{postFrontmatter.title}</p>
      </div>
      <div className="text-left">
        <p className="mt-2 mb-0">{`✍️ Written by ${postFrontmatter.author}`}</p>
        <p className="my-0">
          {`🗓️ ${publishedString} ${postFrontmatter.lastUpdated ? " — " + updatedString : ""}`}
        </p>
        <p className="my-0">{`🕑 Reading time: ${postFrontmatter.readingTime.toFixed(
          0
        )} minutes`}</p>
        <p className="my-0">{`#️⃣ Tags: ${postFrontmatter.tags.join(", ")}`}</p>
      </div>
    </div>
  );
};

export default BlogHeader;
