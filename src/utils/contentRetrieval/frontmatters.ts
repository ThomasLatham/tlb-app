import * as fs from "node:fs";
import matter from "gray-matter";

import { Frontmatter, PostSearchFilter } from "../../interfaces";
import { intersection } from "../general";
import { POSTS_PATH } from "./constants";

const frontmatterResult = (mdxFilepath: string) => {
  const mdxFile = fs.readFileSync(mdxFilepath, "utf8");
  return {
    frontmatter: {
      ...matter(mdxFile).data,
    },
  };
};

const getAllPostFrontmatters = async (): Promise<{ id: string; frontmatter: Frontmatter }[]> => {
  const frontmatterArray: { id: string; frontmatter: any }[] = [];
  for (const mdxFilename of fs.readdirSync(POSTS_PATH)) {
    const { frontmatter } = await frontmatterResult(`${POSTS_PATH}/${mdxFilename}`);

    frontmatterArray.push({
      id: mdxFilename.split(".mdx")[0],
      frontmatter: frontmatter,
    });
  }

  return frontmatterArray;
};

const getFilteredPostFrontmatters = async (
  filters: PostSearchFilter
): Promise<
  {
    id: string;
    frontmatter: Frontmatter;
  }[]
> => {
  return (await getAllPostFrontmatters()).filter((result) => {
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

const getAllTags = async (): Promise<string[]> => {
  return (await getAllPostFrontmatters())
    .map((fm) => fm.frontmatter.tags)
    .reduce((prevArr, curArr) => {
      return [...new Set(prevArr.concat(curArr))];
    }, []);
};

export { getAllPostFrontmatters, getFilteredPostFrontmatters, getAllTags };
