/**
 * This component is for use in blog posts, consumed either directly in MDX or in components inside the MDX.
 *
 * Because plotly is so big, we don't want to bundle it with blog posts. So we keep the bulk of the package
 * in the client (the `<Plot>` type is imported in the server and bundled, though, which is redundant).
 *
 * This component should be imported dynamically (Nextjs) with ssr set to false, then passed to the post
 * via mdx-bundler globals.
 */

import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const BlogPlot = createPlotlyComponent(Plotly);

export default BlogPlot;
