import Head from "next/head";
import { GetServerSideProps } from "next";

import { getAllPortfolioItems } from "@/contentRetrieval/portfolioItems/portfolioItems";
import { PortfolioItemFrontmatter } from "@/interfaces";

import Layout from "../../components/layout";
import PortfolioCard from "../../components/portfolioCard";

interface Props {
  portfolioItemsArray: {
    markdownContent: string;
    frontmatter: PortfolioItemFrontmatter;
    cardImageBlob: Buffer;
  }[];
}

const PortfolioPage: React.FC<Props> = ({ portfolioItemsArray }) => {
  return (
    <Layout>
      <Head key="portfolio">
        <title>{"Tom's Projects"}</title>
      </Head>
      <div className="flex flex-wrap -mx-4">
        {portfolioItemsArray.map((portfolioItem, index) => (
          <PortfolioCard
            key={index}
            markdownContent={portfolioItem.markdownContent}
            frontmatter={portfolioItem.frontmatter}
            cardImageBlob={portfolioItem.cardImageBlob}
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
