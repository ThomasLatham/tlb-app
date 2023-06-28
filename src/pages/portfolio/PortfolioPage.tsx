import Head from "next/head";

import Layout from "../../components/layout";
import PortfolioCard from "../../components/portfolioCard";

const PortfolioPage: React.FC = () => {
  const portfolioMarkdownFiles: any[] = [];

  return (
    <Layout>
      <Head key="portfolio">
        <title>{"Tom's Projects"}</title>
      </Head>
      <div className="flex flex-wrap -mx-4">
        {portfolioMarkdownFiles.map((markdownFilePath, index) => (
          <PortfolioCard key={index} markdownFile={markdownFilePath} />
        ))}
      </div>
    </Layout>
  );
};

export default PortfolioPage;
