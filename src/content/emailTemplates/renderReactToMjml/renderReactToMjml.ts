import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import mjml2html from "mjml";
import { MJMLParseResults } from "mjml-core";
import React from "react";

const renderReactToMjml = (email: React.ReactElement): MJMLParseResults => {
  return mjml2html(renderToMjml(email));
};

export { renderReactToMjml };
