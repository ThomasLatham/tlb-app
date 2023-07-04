import Head from "next/head";
import { GetServerSideProps } from "next";

import { getAllPortfolioItems } from "@/contentRetrieval/portfolioItems/portfolioItems";
import { PortfolioCardProps, PortfolioItemFrontmatter } from "@/interfaces";

import Layout from "../../components/layout";
import PortfolioCard from "../../components/portfolioCard";

interface Props {
  portfolioItemsArray: PortfolioCardProps[];
}

const PortfolioPage: React.FC<Props> = ({ portfolioItemsArray }) => {
  return (
    <Layout>
      <Head key="portfolio">
        <title>{"Tom's Projects"}</title>
      </Head>
      <div className="flex flex-wrap mt-5 mx-16">
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

const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      portfolioItemsArray: getAllPortfolioItems(),
    },
  };
};

export { getServerSideProps };
export default PortfolioPage;
