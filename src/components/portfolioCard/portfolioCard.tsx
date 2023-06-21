import React, { useState } from "react";
import Image from "next/image";

const PortfolioCard: React.FC<{ image: string; description: string }> = ({
  image,
  description,
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
          <Image src={image} alt="Project" className="w-full h-48 object-cover" />
          <div className="p-4">
            <p className="text-lg font-medium mb-2">{description}</p>
            <p className="text-gray-500">Click for more details</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{description}</h2>
            <p>Additional information about the project goes here...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioCard;
