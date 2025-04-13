import React, { useEffect, useState } from "react";

import { Heading, HeadingWithNestedHeadings } from "../../interfaces";
import { useHeadingsData } from "../../utils/hooks";

interface HeadingsProps {
  headings: HeadingWithNestedHeadings[];
  activeId: string;
}

const Headings: React.FC<HeadingsProps> = ({ headings, activeId }) => (
  <ul className="pl-2 border-l-2 dark:border-trim-dark border-secondary-light">
    {headings.map((heading: HeadingWithNestedHeadings) => (
      <li
        className={`mb-4 ${
          activeId === heading.id ? "font-bold text-primary-light dark:text-primary-dark" : ""
        }`}
        key={heading.id}
      >
        <a className="blog-link" href={`#${heading.id}`}>
          {`${heading.title}`}
        </a>
        {heading.items.length > 0 && (
          <ul className="ml-4 pl-2 border-l-2 dark:border-trim-dark border-secondary-light">
            {heading.items.map((subheading: Heading) => (
              <li
                className={`mt-4 ${
                  activeId === subheading.id
                    ? "font-bold text-primary-light dark:text-primary-dark"
                    : ""
                }`}
                key={subheading.id}
              >
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
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px 0px -50% 0px", // Trigger when the section is halfway in view
      threshold: 0.1,
    });

    const elements = document.querySelectorAll("article [id]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <nav
      className="max-h-[calc(100vh-40px)] overflow-auto text-secondary-light dark:text-trim-dark"
      aria-label="Table of contents"
    >
      <Headings headings={nestedHeadings} activeId={activeId} />
    </nav>
  );
};

export default BlogTOC;
