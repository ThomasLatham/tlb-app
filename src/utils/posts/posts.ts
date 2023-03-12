import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import * as fs from "node:fs";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import readingTime from "reading-time";
import matter from "gray-matter";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import rehypeCodeTitles from "rehype-code-titles";

import { Frontmatter } from "../../interfaces";

const POSTS_PATH = process.cwd() + "\\src\\content\\posts";

const mdxResult = async (mdxFilepath: string) => {
  const { code, frontmatter } = await bundleMDX({
    file: mdxFilepath,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? [])];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
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
            rewrite: (node: { type: string; tagName: string; properties: any }) => {
              if (
                node.type === "element" &&
                ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
              ) {
                node.properties = {
                  ...node.properties,
                  style: "scroll-margin-top: 80px;",
                };
              } else if (node.type === "element" && node.tagName === "a") {
                node.properties = {
                  ...node.properties,
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
    const { code, frontmatter } = await mdxResult(`${POSTS_PATH}/${mdxFilename}`);

    postsArr.push({
      id: mdxFilename.split(".mdx")[0],
      code: code,
      frontmatter: frontmatter,
    });
  }
  return postsArr;
};

const getAllPostFrontmatters = (): {
  id: string;
  frontmatter: Frontmatter;
}[] => {
  const frontmatterArray: { id: string; frontmatter: any }[] = [];
  fs.readdirSync(POSTS_PATH).map((mdxFilename) => {
    const fileString = fs.readFileSync(POSTS_PATH + "\\" + mdxFilename);
    frontmatterArray.push({
      id: mdxFilename.split(".mdx")[0],
      frontmatter: matter(fileString).data,
    });
  });

  return frontmatterArray;
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

const getPostById = async (postId: string) => {
  return await mdxResult(`${POSTS_PATH}\\${postId}.mdx`);
};

export { getAllPosts, getAllPostFrontmatters, getAllPostIds, getPostById };
