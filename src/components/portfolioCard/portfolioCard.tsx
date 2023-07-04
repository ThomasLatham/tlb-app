import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { X } from "react-feather";

import { PortfolioCardProps } from "@/interfaces";

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  markdownContent,
  frontmatter,
  cardImageBase64,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = (event: React.MouseEvent) => {
    if (
      event.target === event.currentTarget ||
      (event.target instanceof Element && event.target.closest(".modal-close-button"))
    ) {
      setIsModalOpen(false);
    }
  };

  const markdownWithoutFrontmatter = markdownContent.replace(/^---[\s\S]*?---\s*/, "");

  return (
    <>
      <div className="w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 mx-4 flex-grow flex">
        <div
          className="cursor-pointer rounded-lg border-secondary-light
          dark:text-trim-light dark:border-secondary-dark border-2 flex-grow
          mb-4"
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
            <p className="text-lg font-bold mb-2 text-center text-secondary-light dark:text-trim-light">
              {frontmatter.title}
            </p>
            <p className="text-secondary-light dark:text-trim-light">{frontmatter.description}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light bg-opacity-50 dark:bg-side-dark dark:bg-opacity-50"
          onClick={closeModal}
        >
          <div className="bg-back-light p-8 rounded-lg w-3/4 h-3/4 overflow-y-auto dark:bg-back-dark dark:text-trim-light relative">
            <h2 className="text-2xl font-bold mb-4 text-secondary-light dark:text-trim-light">
              {frontmatter.title}
            </h2>
            <button
              className="absolute top-4 right-4 text-secondary-light dark:text-trim-light hover:text-secondary-dark dark:hover:text-secondary-dark modal-close-button"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            <ReactMarkdown>{markdownWithoutFrontmatter}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioCard;
