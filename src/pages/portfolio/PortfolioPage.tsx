import Head from "next/head";

import Layout from "../../components/layout";
import PortfolioCard from "../../components/portfolioCard";

const PortfolioPage: React.FC = () => {
  const portfolioItems = [
    {
      image: "/path/to/project1.jpg",
      description: "Project 1",
    },
    {
      image: "/path/to/project2.jpg",
      description: "Project 2",
    },
    {
      image: "/path/to/project3.jpg",
      description: "Project 3",
    },
    // Add more portfolio items as needed
  ];

  return (
    <Layout>
      <Head key="portfolio">
        <title>{"Tom's Projects"}</title>
      </Head>
      <div className="flex flex-wrap -mx-4">
        {portfolioItems.map((item, index) => (
          <PortfolioCard key={index} image={item.image} description={item.description} />
        ))}
      </div>
    </Layout>
  );
};

export default PortfolioPage;
