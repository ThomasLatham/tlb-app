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
import rehypeKatex from "rehype-katex";
import matter from "gray-matter";

import { PostFrontmatter, PostSearchFilter } from "@/interfaces";

import { POSTS_PATH } from "../../constants";
import { intersection } from "../../utils/general";

/*----------------------
------FULL_CONTENT------
----------------------*/

const fullPostResult = async (mdxFilepath: string) => {
  const { code, frontmatter } = await bundleMDX({
    file: mdxFilepath,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkMath, remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeKatex,
        rehypeSlug,
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
      readingTime: readingTime(sourceText).minutes,
    },
  };
};

const getPostById = async (postId: string) => {
  return await fullPostResult(`${POSTS_PATH}/${postId}/${postId}.mdx`);
};

const getAllPostIds = () => {
  return getPostIdsArray().map((postId) => {
    return {
      params: {
        id: postId,
      },
    };
  });
};

const getRandomPostId = () => {
  const postFileNameArr = getPostIdsArray();
  return postFileNameArr[Math.floor(Math.random() * postFileNameArr.length)];
};

/*---------------------
------FRONTMATTER------
---------------------*/

const getAllPostFrontmatters = (): { id: string; frontmatter: PostFrontmatter }[] => {
  const frontmatterArray: { id: string; frontmatter: PostFrontmatter }[] = [];
  for (const postId of getPostIdsArray()) {
    const sourceText = fs.readFileSync(`${POSTS_PATH}/${postId}/${postId}.mdx`, "utf8");

    const frontmatter = {
      ...matter(sourceText).data,
      wordCount: sourceText.split(/\s+/gu).length,
      readingTime: readingTime(sourceText).minutes,
    };

    frontmatterArray.push({
      id: postId,
      frontmatter: frontmatter as PostFrontmatter,
    });
  }

  return frontmatterArray;
};

const getFrontmatterByPostId = (postId: string): PostFrontmatter => {
  const sourceText = fs.readFileSync(`${POSTS_PATH}/${postId}/${postId}.mdx`, "utf8");
  return {
    ...matter(sourceText).data,
    wordCount: sourceText.split(/\s+/gu).length,
    readingTime: readingTime(sourceText).minutes,
  } as PostFrontmatter;
};

const getFilteredPostFrontmatters = (
  filters: PostSearchFilter
): {
  id: string;
  frontmatter: PostFrontmatter;
}[] => {
  return getAllPostFrontmatters().filter((result) => {
    const fm = result.frontmatter;

    if (
      intersection<string>(fm.tags, filters.tags).length > 0 &&
      fm.title.includes(filters.searchText)
    ) {
      return true;
    }

    return false;
  });
};

const getAllTags = (): string[] => {
  return getAllPostFrontmatters()
    .map((fm) => fm.frontmatter.tags)
    .reduce((prevArr, curArr) => {
      return [...new Set(prevArr.concat(curArr))];
    }, []);
};

/*--------------
------UTIL------
---------------*/

/**
 * Returns An array of the post IDs for all posts. Note that posts are located and contained as
 * follows: `src/content/posts/some-post-id/some-post-id.mdx`.
 */
const getPostIdsArray = () => {
  return fs
    .readdirSync(POSTS_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "components")
    .map((postDirectory) => postDirectory.name);
};

export {
  getPostById,
  getAllPostIds,
  getRandomPostId,
  getAllPostFrontmatters,
  getFrontmatterByPostId,
  getFilteredPostFrontmatters,
  getAllTags,
};
