import * as fs from "fs";
import { bundleMDX } from "mdx-bundler";
import { Root, Element, RootContent } from "hast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import readingTime from "reading-time";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from "rehype-katex";

import { POSTS_PATH } from "./constants";

const fullPostResult = async (mdxFilepath: string) => {
  const { code, frontmatter } = await bundleMDX({
    file: mdxFilepath,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkMath, remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeKatex,
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              ariaHidden: true,
              tabIndex: -1,
            },
          },
        ],
        [
          rehypeRewrite,
          {
            rewrite: (node: Root | RootContent) => {
              if (
                node.type === "element" &&
                ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
              ) {
                (node as Element).properties = {
                  ...(node as Element).properties,
                  style: "scroll-margin-top: 80px;",
                };
              } else if (node.type === "element" && node.tagName === "a") {
                node.properties = {
                  ...node.properties,
                  className: "blog-link",
                };
              }

              if (node.type === "element" && node.properties?.id === "footnote-label") {
                node.tagName = "h1";
              }

              if (((node as Element).properties?.id as string)?.includes("fnref")) {
                (node as Element).properties = {
                  ...(node as Element).properties,
                  style: "scroll-margin-top: 80px;",
                  className: "blog-link",
                };
              }
            },
          },
        ],
      ];
      return options;
    },
    cwd: POSTS_PATH,
    globals: {
      useDarkMode: "myUseDarkMode",
      colors: "myColors",
      BlogPlot: "myBlogPlot",
    },
  });

  const sourceText = fs.readFileSync(mdxFilepath, "utf8");

  return {
    code: code,
    frontmatter: {
      ...frontmatter,
      wordCount: sourceText.split(/\s+/gu).length,
      readingTime: readingTime(sourceText),
    },
  };
};

const getAllPosts = async () => {
  const postsArr = [];

  for (const mdxFilename of fs.readdirSync(POSTS_PATH)) {
    const { code, frontmatter } = await fullPostResult(`${POSTS_PATH}/${mdxFilename}`);

    postsArr.push({
      id: mdxFilename.split(".mdx")[0],
      code: code,
      frontmatter: frontmatter,
    });
  }
  return postsArr;
};

const getPostById = async (postId: string) => {
  return await fullPostResult(`${POSTS_PATH}\\${postId}.mdx`);
};

const getAllPostIds = () => {
  return fs.readdirSync(POSTS_PATH).map((mdxFilename) => {
    return {
      params: {
        id: mdxFilename.split(".mdx")[0],
      },
    };
  });
};

const getRandomPostId = () => {
  const postFileNameArr = fs.readdirSync(POSTS_PATH);
  return postFileNameArr[Math.floor(Math.random() * postFileNameArr.length)].split(".mdx")[0];
};

export { getAllPosts, getPostById, getAllPostIds, getRandomPostId };
