import React from "react";
import { DateTime } from "luxon";
import { formatDateString } from "@/utils/format";

interface Props {
  title: string;
  datePublished: string;
  lastUpdated?: string;
  author: string;
  tags: string[];
}

const BlogHeader: React.FC<Props> = ({ title, datePublished, lastUpdated, author, tags }) => {
  const publishedString = `Published ${formatDateString(datePublished)}`;

  const updatedString = lastUpdated ? `Last updated ${formatDateString(lastUpdated)}` : "";

  return (
    <div className="flex flex-col">
      <div className="text-left">
        <p className="text-5xl my-0">{title}</p>
      </div>
      <div className="text-left">
        <p className="mt-2 mb-0">{`✍️ Written by ${author}`}</p>
        <p className="my-0">
          {`🗓️ ${publishedString}  ${lastUpdated ? " — " + updatedString : ""}`}
        </p>
        <p className="my-0">{`#️⃣ Tags: ${tags.join(", ")}`}</p>
      </div>
    </div>
  );
};

export default BlogHeader;
