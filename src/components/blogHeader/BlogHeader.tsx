import React from "react";
import { DateTime } from "luxon";

interface Props {
  title: string;
  datePublished: Date;
  lastUpdated?: Date;
  author: string;
  tags: string[];
}

const BlogHeader: React.FC<Props> = ({ title, datePublished, lastUpdated, author, tags }) => {
  const publishedString = `Published ${DateTime.fromJSDate(datePublished).toLocaleString({
    ...DateTime.DATE_MED,
    month: "long",
    timeZone: "utc",
  })}`;

  const updatedString = lastUpdated
    ? `Last updated ${DateTime.fromJSDate(lastUpdated).toLocaleString({
        ...DateTime.DATE_MED,
        month: "long",
        timeZone: "utc",
      })}`
    : "";

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
