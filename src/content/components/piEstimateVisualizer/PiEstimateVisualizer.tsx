import React, { useState } from "react";
import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { colors } from "@/content/constants";

const Plot = createPlotlyComponent(Plotly);

const maxPoints: number = 10000;

const xPoints = new Array<number>(maxPoints).fill(1).map(() => {
  return Math.random();
});

const yPoints = new Array<number>(maxPoints).fill(1).map(() => {
  return Math.random();
});

const PiEstimateVisualizer: React.FC = () => {
  const root = document.documentElement;
  const useDarkMode = true;

  const [numPoints, setNumPoints] = useState(10);

  const piEstimate =
    (xPoints.slice(0, numPoints).filter((xVal, idx) => {
      const yVal = yPoints[idx];
      return Math.sqrt(Math.pow(xVal, 2) + Math.pow(yVal, 2)) <= 1;
    }).length /
      numPoints) *
    4;

  return (
    <div className="flex flex-col items-center ">
      <Plot
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
      <label htmlFor="inputGuy">Enter number of points to use in estimate:</label>
      <input
        type="number"
        id="inputGuy"
        className="bg-side-dark text-trim-dark mt-2"
        onChange={(event) => {
          setNumPoints(Number.parseInt(event.target.value));
        }}
        value={numPoints}
      />
      <p className="mt-2">π ≈ {piEstimate.toPrecision(3)}</p>
    </div>
  );
};

export default PiEstimateVisualizer;
