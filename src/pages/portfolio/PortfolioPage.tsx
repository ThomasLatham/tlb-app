import Head from "next/head";
import { GetServerSideProps } from "next";

import { getAllPortfolioItems } from "@/contentRetrieval/portfolioItems";
import { PortfolioCardProps } from "@/interfaces";

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

const getStaticProps: GetServerSideProps = async () => {
  return {
    props: {
      portfolioItemsArray: getAllPortfolioItems(),
    },
  };
};

export { getStaticProps };
export default PortfolioPage;
