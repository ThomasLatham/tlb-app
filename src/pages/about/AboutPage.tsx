import React from "react";

import Layout from "../../components/layout";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-row items-center content-center justify-center">
        <p className="dark:text-trim-dark text-secondary-light">Hi!!</p>
      </div>
    </Layout>
  );
};

export default AboutPage;
