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

  return (
    <div>
      <div className={className} ref={containerRef} />
      <style>{`
      @media (pointer:none), (pointer:coarse), (pointer:fine) {
        .katex-display > .katex {
          display: inline-block;
          white-space: nowrap;
          max-width: 100%;
          width: 100%;
          overflow-y: clip;
          overflow-x: auto;
          text-align: initial;
        }
        .katex {
          font: normal 1.21em KaTeX_Main, Times New Roman, serif;
          line-height: 1.2;
          white-space: normal;
          text-indent: 0;
        }
      }
      `}</style>
    </div>
  );
};

export default KaTeXComponent;
