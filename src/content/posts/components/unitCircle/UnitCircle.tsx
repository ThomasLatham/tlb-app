import React from "react";
import { PlotParams } from "react-plotly.js";

interface Props {
  withSquare: boolean;
  withBigSquare: boolean;
  data: Plotly.Data[];
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

const UnitCircle: React.FC<Props> = ({
  withSquare = false,
  withBigSquare = false,
  data = [],
  useDarkMode,
  colors,
  Plot,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Plot
        config={{ displayModeBar: false }}
        data={data}
        layout={{
          paper_bgcolor: useDarkMode ? colors["side-dark"] : colors["primary-light"],
          plot_bgcolor: useDarkMode ? colors["side-dark"] : colors["primary-light"],
          showlegend: false,
          xaxis: {
            range: [-1.2, 1.2],
            autotick: false,
            ticks: "outside",
            tick0: 0,
            dtick: 0.5,
            ticklen: 8,
            tickwidth: 2,
            tickcolor: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
            color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
          },
          yaxis: {
            range: [-1.2, 1.2],
            autotick: false,
            ticks: "outside",
            tick0: 0,
            dtick: 0.5,
            ticklen: 8,
            tickwidth: 2,
            tickcolor: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
            color: useDarkMode ? colors["trim-dark"] : colors["secondary-light"],
          },
          margin: {
            l: 40,
            r: 10,
            b: 35,
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
              visible: withSquare,
              type: "rect",
              xref: "x",
              yref: "y",
              x0: withBigSquare ? -1 : 0,
              y0: withBigSquare ? -1 : 0,
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
      <style>{`
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

export default UnitCircle;
