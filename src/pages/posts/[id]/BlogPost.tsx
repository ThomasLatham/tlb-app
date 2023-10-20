import React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import dynamic from "next/dynamic";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import "rc-slider/assets/index.css"; // needed for rc-slider as used in the content-component PiEstimateVisualizer

import { PostFrontmatter } from "@/interfaces";

import { getPostById, getAllPostIds } from "../../../contentRetrieval/posts";
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
  frontmatter: PostFrontmatter;
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
      <Head key={frontmatter.title as string}>
        <title>{frontmatter.title}</title>
      </Head>
      <div className="flex">
        <div className="hidden md:block md:m md:w-[20%]">
          <div className="self-start sticky top-32 flex-col pl-2 md:ml-8">
            <p className="text-left pb-4 text-xl dark:text-trim-dark text-secondary-light">
              {"Contents"}
            </p>
            <div className="max-h-96 overflow-y-auto">
              <BlogTOC />
            </div>
          </div>
        </div>
        <article className="prose dark:prose-invert text-left pt-10 md:px-10 px-2 max-w-none md:max-w-[80%]">
          <header>
            <BlogHeader postFrontmatter={frontmatter} />
          </header>
          <div className="mt-10">
            <PostComponent />
          </div>
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
        /*this next block keeps the website from being yuck on mobile*/
        article {
          width: 100%;
          max-width: 100%;
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
