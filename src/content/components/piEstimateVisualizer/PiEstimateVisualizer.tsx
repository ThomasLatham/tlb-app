import React, { useState } from "react";
import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import Slider from "rc-slider";

import colors from "@/content/constants/colors";

import KaTeXComponent from "../kaTexComponent";

const Plot = createPlotlyComponent(Plotly);

interface Props {
  minPoints: number;
  maxPoints: number;
  initialPoints: number;
}

const PiEstimateVisualizer: React.FC<Props> = ({ minPoints, maxPoints, initialPoints }) => {
  // const root = document.documentElement;
  const useDarkMode = true; //root.classList.contains("dark"); // would be nice to figure this out at some point

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
            marker: { color: colors["trim-dark"], size: 4 },
          },
        ]}
        layout={{
          paper_bgcolor: colors["side-dark"],
          plot_bgcolor: colors["side-dark"],
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
              fillcolor: colors["secondary-dark"],
              opacity: 0.25,
              line: {
                color: colors["secondary-dark"],
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
                color: colors["trim-dark"],
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
          railStyle={{ background: colors["side-dark"] }}
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
      `}</style>
    </div>
  );
};

export default PiEstimateVisualizer;
