import React, { useEffect, useRef } from "react";
import katex, { KatexOptions } from "katex";

interface Props {
  texExpression: string;
  options?: KatexOptions | undefined;
}

const KaTeXComponent: React.FC<Props> = ({ texExpression, options }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => katex.render(texExpression, containerRef.current as HTMLDivElement, options),
    [texExpression, options]
  );

  return <div ref={containerRef} />;
};

export default KaTeXComponent;
