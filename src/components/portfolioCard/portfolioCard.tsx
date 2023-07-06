import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Router from "next/router";
import { X } from "react-feather";
import rehypeRewrite from "rehype-rewrite";
import { Root, RootContent } from "hast";

import { PortfolioCardProps } from "@/interfaces";
import { useAppSelector } from "@/redux/hooks";
import { userPreferences } from "@/ducks";

import tailwindConfig from "../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const reactMarkdownRehypePlugins = [
  [
    rehypeRewrite,
    {
      rewrite: (node: Root | RootContent) => {
        if (node.type === "element" && node.tagName === "a") {
          node.properties = {
            ...node.properties,
            className: "modal-link",
          };
        }
      },
    },
  ],
];

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  markdownContent,
  frontmatter,
  cardImageBase64,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);

  const handleCardClick = () => {
    setIsModalOpen(true);
    Router.push({ hash: frontmatter.id });
  };

  const closeModal = (event: React.MouseEvent) => {
    if (
      event.target === event.currentTarget ||
      (event.target instanceof Element && event.target.closest(".modal-close-button"))
    ) {
      setIsModalOpen(false);
      Router.push({ hash: "" });
    }
  };

  useEffect(() => {
    const openModalId = Router.asPath.match(/#([^#]+)$/i)?.[1];

    if (openModalId === frontmatter.id) {
      setIsModalOpen(true);
    }
  }, []);

  const markdownWithoutFrontmatter = markdownContent.replace(/^---[\s\S]*?---\s*/, "");

  return (
    <>
      <div className="w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/5 mx-10 flex">
        <div
          className="cursor-pointer rounded-lg 
          border-[1.5px] dark:border-side-dark border-secondary-light
          dark:hover:border-secondary-dark
          dark:text-trim-dark text-secondary-light
          dark:bg-back-dark hover:bg-primary-light 
          mb-4 mt-8"
          onClick={handleCardClick}
        >
          <div className="mt-6 text-center flex items-center justify-center">
            <Image
              src={`data:image/png;base64,${cardImageBase64}`}
              alt={frontmatter.title}
              width={100}
              height={100}
              className="border border-secondary-light"
            />
          </div>
          <div className="p-4 flex flex-col text-center">
            <p className="text-xl font-bold mb-2 text-secondary-light dark:text-trim-light">
              {frontmatter.title}
            </p>
            <hr />
            <p className="font-bold text-lg my-2 text-secondary-light dark:text-trim-light">
              {frontmatter.role}
            </p>
            <hr />
            <p className="italic text-secondary-light dark:text-trim-light mt-2 content-between">
              {frontmatter.description}
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light bg-opacity-50 dark:bg-side-dark dark:bg-opacity-50"
          onClick={closeModal}
        >
          <div className="prose dark:prose-invert max-w-none bg-back-light p-8 rounded-lg md:w-3/4 w-5/6 h-3/4 overflow-y-auto dark:bg-back-dark relative">
            <h1 className="text-4xl font-bold mb-4 text-secondary-light dark:text-trim-light">
              {frontmatter.title}
            </h1>
            <button
              className="absolute top-4 right-4 text-secondary-light dark:text-trim-light hover:text-secondary-dark dark:hover:text-secondary-dark modal-close-button"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            <ReactMarkdown rehypePlugins={reactMarkdownRehypePlugins as any}>
              {markdownWithoutFrontmatter}
            </ReactMarkdown>
          </div>
          <style>{`
            .modal-link {
              color: ${useDarkMode ? colors["trim-dark"] : colors["secondary-light"]};
            }
            .modal-link:link {
              text-decoration: underline;
            }
            .modal-link:hover {
              color: ${useDarkMode ? colors["secondary-dark"] : colors["primary-light"]};
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default PortfolioCard;
