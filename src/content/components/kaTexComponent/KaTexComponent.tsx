import React, { useEffect, useRef } from "react";
import katex, { KatexOptions } from "katex";

interface Props {
  texExpression: string;
  options?: KatexOptions | undefined;
  className?: string;
}

const KaTeXComponent: React.FC<Props> = ({ texExpression, options, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => katex.render(texExpression, containerRef.current as HTMLDivElement, options),
    [texExpression, options]
  );

  return <div className={className} ref={containerRef} />;
};

export default KaTeXComponent;
