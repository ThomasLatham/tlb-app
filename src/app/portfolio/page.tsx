import { Metadata } from "next";

import { getAllPortfolioItems } from "@/contentRetrieval/portfolioItems";

import PortfolioPage from "./PortfolioPage";

const metadata: Metadata = {
  title: "Tom's Projects",
};

const Page = async () => {
  return <PortfolioPage portfolioItemsArray={getAllPortfolioItems()} />;
};

export default Page;
export { metadata };
