/* eslint-disable @next/next/no-img-element */
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Props {
  imgSrc: string;
  altText: string;
  initialScale: number;
  initialPositionX: number;
  initialPositionY: number;
}

const Chalkboard: React.FC<Props> = ({
  imgSrc,
  altText,
  initialScale,
  initialPositionX,
  initialPositionY,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="border-2 border-primary-light dark:border-trim-dark bg-secondary-light">
        <TransformWrapper
          initialScale={initialScale}
          initialPositionX={initialPositionX}
          initialPositionY={initialPositionY}
        >
          <TransformComponent>
            <div className="bg-secondary-light h-[70vh] w-[80vw] md:w-[50vw]">
              <img src={imgSrc} alt={altText} height={250} width={250} />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Chalkboard;
