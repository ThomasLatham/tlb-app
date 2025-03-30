import * as fs from "fs";
import matter from "gray-matter";
import path from "path";

import { PortfolioCardProps, PortfolioItemFrontmatter } from "@/interfaces";
import { PORTFOLIO_ITEMS_PATH, PORTFOLIO_ITEMS_PATH_ABSOLUTE } from "@/constants";

const getAllPortfolioItems = (): PortfolioCardProps[] => {
  const portfolioItemsArray: PortfolioCardProps[] = [];
  for (const portfolioItemFolder of fs.readdirSync(PORTFOLIO_ITEMS_PATH_ABSOLUTE)) {
    for (const portfolioItemFile of fs.readdirSync(
      path.resolve(PORTFOLIO_ITEMS_PATH, portfolioItemFolder)
    )) {
      if (portfolioItemFile.split(".").at(-1) === "md") {
        const markdownContent = fs.readFileSync(
          path.resolve(PORTFOLIO_ITEMS_PATH_ABSOLUTE, portfolioItemFolder, portfolioItemFile),
          "utf8"
        );

        const frontmatter = matter(markdownContent).data as PortfolioItemFrontmatter;

        const cardImageBase64 = Buffer.from(
          fs.readFileSync(
            path.resolve(PORTFOLIO_ITEMS_PATH, portfolioItemFolder, frontmatter.cardImage)
          )
        ).toString("base64");

        portfolioItemsArray.push({
          markdownContent: markdownContent,
          frontmatter: frontmatter,
          cardImageBase64: cardImageBase64,
        });
      }
    }
  }

  return portfolioItemsArray;
};

export { getAllPortfolioItems };
