import { PortfolioCardProps } from "@/interfaces";

import Layout from "../../components/layout";
import PortfolioCard from "../../components/portfolioCard";

interface Props {
  portfolioItemsArray: PortfolioCardProps[];
}

const PortfolioPage: React.FC<Props> = ({ portfolioItemsArray }) => {
  return (
    <Layout>
      <div className="flex flex-wrap mt-5 justify-center">
        {portfolioItemsArray.map((portfolioItem, index) => (
          <PortfolioCard
            key={index}
            markdownContent={portfolioItem.markdownContent}
            frontmatter={portfolioItem.frontmatter}
            cardImageBase64={portfolioItem.cardImageBase64}
          />
        ))}
      </div>
    </Layout>
  );
};

export default PortfolioPage;
