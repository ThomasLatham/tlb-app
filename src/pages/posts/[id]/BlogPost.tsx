import React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import dynamic from "next/dynamic";
import { GetStaticPropsContext } from "next";
// needed for rc-slider as used in the content-component PiEstimateVisualizer
import "rc-slider/assets/index.css";

import { getPostById, getAllPostIds } from "../../../utils/contentRetrieval";
import Layout from "../../../components/layout";
import BlogHeader from "../../../components/blogHeader";
import BlogTOC from "../../../components/blogTOC";
import { userPreferences } from "../../../ducks";
import { useAppSelector } from "../../../redux/hooks";
import tailwindConfig from "../../../../tailwind.config";
const BlogPlot = dynamic(() => import("../../../components/blogPlot"), {
  ssr: false,
});

const colors = tailwindConfig.theme.colors;

interface Props {
  code: string;
  frontmatter: {
    [key: string]: string | string[];
  };
}

const BlogPost: React.FC<Props> = ({ code, frontmatter }) => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);
  //const Plot = createPlotlyComponent(Plotly);

  const PostComponent = React.useMemo(
    () =>
      getMDXComponent(code, {
        myUseDarkMode: useDarkMode,
        myColors: colors,
        myBlogPlot: BlogPlot,
      }),
    [code, useDarkMode]
  );
  return (
    <Layout>
      <div className="flex">
        <div className="hidden md:block md:grow-[1] md:m">
          <div className="self-start sticky top-32 flex-col pl-2 md:ml-8">
            <p className="text-left pb-4 text-xl dark:text-trim-dark text-secondary-light">
              {"Contents"}
            </p>
            <div>
              <BlogTOC />
            </div>
          </div>
        </div>
        <article className="prose prose-slate dark:prose-invert text-left pt-10 px-20 max-w-none grow-[12]">
          <header>
            <BlogHeader
              title={frontmatter.title as string}
              datePublished={frontmatter.datePublished as string}
              lastUpdated={frontmatter?.lastUpdated as string}
              author={frontmatter.author as string}
              tags={frontmatter.tags as string[]}
            />
          </header>
          <main className="mt-10">
            <PostComponent />
          </main>
        </article>
      </div>
      <style>{`
        .blog-link {
          color: ${useDarkMode ? colors["trim-dark"] : colors["secondary-light"]};
        }
        .blog-link:link {
          text-decoration: none;
        }
        p .blog-link:link {
          text-decoration: underline;
        }
        .blog-link:hover {
          color: ${useDarkMode ? colors["secondary-dark"] : colors["primary-light"]};
        }
        .js-plotly-plot,
        .plot-container {
          height: 225px;
          width: 225px;
        }
      `}</style>
    </Layout>
  );
};

const getStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const post = await getPostById(params?.id as string);
  return {
    props: {
      code: post.code,
      frontmatter: post.frontmatter,
    },
  };
};

export { getStaticPaths, getStaticProps };
export default BlogPost;
