import React from "react";

import { Heading, HeadingWithNestedHeadings } from "../../interfaces";
import { useHeadingsData } from "../../utils/hooks";

interface HeadingsProps {
  headings: HeadingWithNestedHeadings[];
}

const Headings: React.FC<HeadingsProps> = ({ headings }) => (
  <ul className="pl-2 border-l-2 dark:border-trim-dark border-secondary-light">
    {headings.map((heading: HeadingWithNestedHeadings) => (
      <li className="mb-4" key={heading.id}>
        <a className="blog-link" href={`#${heading.id}`}>
          {`${heading.title}`}
        </a>
        {heading.items.length > 0 && (
          <ul className="ml-4 pl-2 border-l-2 dark:border-trim-dark border-secondary-light">
            {heading.items.map((subheading: Heading) => (
              <li className="mt-4" key={subheading.id}>
                <a className="blog-link" href={`#${subheading.id}`}>
                  {`${subheading.title}`}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

const BlogTOC: React.FC = () => {
  const { nestedHeadings } = useHeadingsData();

  return (
    <nav
      className="max-h-[calc(100vh-40px)] overflow-auto text-secondary-light dark:text-trim-dark"
      aria-label="Table of contents"
    >
      <Headings headings={nestedHeadings} />
    </nav>
  );
};

export default BlogTOC;
