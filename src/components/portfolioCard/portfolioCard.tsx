import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

import { PortfolioCardProps } from "@/interfaces";

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  markdownContent,
  frontmatter,
  cardImageBlob,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
        <div
          className="cursor-pointer rounded-lg shadow-lg hover:shadow-xl"
          onClick={handleCardClick}
        >
          <Image
            src={`data:image/png;base64,${cardImageBlob}`}
            alt={frontmatter.title}
            width={40}
            height={40}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <p className="text-lg font-medium mb-2">{frontmatter.title}</p>
            <p className="text-gray-500">{frontmatter.description}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{frontmatter.title}</h2>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioCard;
