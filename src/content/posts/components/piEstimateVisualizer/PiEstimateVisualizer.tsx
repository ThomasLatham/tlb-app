import React, { useState } from "react";
import Slider from "rc-slider";
import { PlotParams } from "react-plotly.js";

import KaTeXComponent from "../kaTexComponent";

interface Props {
  minPoints: number;
  maxPoints: number;
  initialPoints: number;
  useDarkMode: boolean;
  colors: {
    "primary-light": string;
    "secondary-light": string;
    "trim-light": string;
    "side-light": string;
    "back-light": string;
    "primary-dark": string;
    "secondary-dark": string;
    "trim-dark": string;
    "side-dark": string;
    "back-dark": string;
  };
  Plot: React.ComponentType<PlotParams>;
}

const PiEstimateVisualizer: React.FC<Props> = ({
  minPoints,
  maxPoints,
  initialPoints,
  useDarkMode,
  colors,
  Plot,
}) => {
  const [numPoints, setNumPoints] = useState(initialPoints);

  const [xPoints] = useState(
    new Array<number>(maxPoints).fill(1).map(() => {
      return Math.random();
    })
  );

  const [yPoints] = useState(
    new Array<number>(maxPoints).fill(1).map(() => {
      return Math.random();
    })
  );

  const pointsInCircle = xPoints.slice(0, numPoints).filter((xVal, idx) => {
    const yVal = yPoints[idx];
    return Math.sqrt(Math.pow(xVal, 2) + Math.pow(yVal, 2)) <= 1;
  }).length;

  const piEstimate = (pointsInCircle / numPoints) * 4;

  const error = Math.abs(Math.PI - piEstimate) / Math.PI;

  return (
    <div className="flex flex-col items-center">
      <Plot
        config={{ displayModeBar: false }}
        data={[
          {
            x: xPoints.slice(0, numPoints),
            y: yPoints.slice(0, numPoints),
            type: "scatter",
            mode: "markers",
            marker: {
              color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
              size: 4,
            },
          },
        ]}
        layout={{
          paper_bgcolor: useDarkMode ? colors["side-dark"] : colors["primary-light"],
          plot_bgcolor: useDarkMode ? colors["side-dark"] : colors["primary-light"],
          showlegend: false,
          xaxis: {
            range: [0, 1],
            autotick: false,
            ticks: "inside",
            tick0: 0,
            dtick: 0.25,
            ticklen: 8,
            tickwidth: 2,
            tickcolor: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
            color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
          },
          yaxis: {
            range: [0, 1],
            autotick: false,
            ticks: "inside",
            tick0: 0,
            dtick: 0.25,
            ticklen: 8,
            tickwidth: 2,
            tickcolor: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
            color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
          },
          margin: {
            l: 35,
            r: 10,
            b: 25,
            t: 10,
            pad: 4,
          },
          shapes: [
            {
              type: "circle",
              xref: "x",
              yref: "y",
              x0: -1,
              y0: -1,
              x1: 1,
              y1: 1,
              fillcolor: useDarkMode ? colors["secondary-dark"] : colors["secondary-light"],
              opacity: 0.25,
              line: {
                color: useDarkMode ? colors["secondary-dark"] : colors["secondary-light"],
              },
            },
            {
              type: "rect",
              xref: "x",
              yref: "y",
              x0: -1,
              y0: -1,
              x1: 1,
              y1: 1,
              line: {
                color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
              },
            },
          ],
        }}
        useResizeHandler={true}
        className=""
      />
      <div className="w-[225px] mt-2">
        <Slider
          min={minPoints}
          max={maxPoints}
          defaultValue={initialPoints}
          value={numPoints}
          onChange={(value) => setNumPoints(value as number)}
          trackStyle={{ background: colors["primary-light"] }}
          railStyle={{ background: useDarkMode ? colors["side-dark"] : colors["secondary-light"] }}
          handleStyle={{
            background: colors["primary-light"],
          }}
        />
      </div>
      <KaTeXComponent
        texExpression={`
          \\pi \\approx 
          4 \\lparen \\frac {points~in~circle} {total~points} \\rparen = 
          4 \\lparen \\frac {${pointsInCircle}} {${numPoints}} \\rparen = 
          ${piEstimate.toPrecision(3)}
      `}
      />
      <KaTeXComponent
        className="mt-3"
        texExpression={`
            error = \\frac {|\\pi - (estimated~value)|} {\\pi} = ${error.toPrecision(3)}
          `}
      />
      <style>{`
        .top{
          border-bottom:solid black 1px; 
          display:inline-block; 
          float:left;
        }
        .bottom{ 
          display:inline-block; 
          clear:left; 
          float:left;
        }
        .main-svg {
          border: 2px solid ${useDarkMode ? colors["trim-dark"] : colors["secondary-light"]}
        }
        .js-plotly-plot,
        .plot-container {
          height: 225px;
          width: 225px;
        }
      `}</style>
    </div>
  );
};

export default PiEstimateVisualizer;
