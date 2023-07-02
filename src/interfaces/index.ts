interface Heading {
  id: string;
  title: string;
}

interface HeadingWithNestedHeadings extends Heading {
  items: Heading[];
}

interface PostFrontmatter {
  title: string;
  datePublished: string;
  lastUpdated?: string;
  author: string;
  description: string;
  tags: string[];
}

interface PortfolioItemFrontmatter {
  title: string;
  description: string;
  cardImage: string;
}

interface PortfolioCardProps {
  markdownContent: string;
  frontmatter: PortfolioItemFrontmatter;
  cardImageBlob: string;
}

interface PostSearchFilter {
  searchText: string;
  tags: string[];
}

export type {
  Heading,
  HeadingWithNestedHeadings,
  PostFrontmatter,
  PortfolioItemFrontmatter,
  PortfolioCardProps,
  PostSearchFilter,
};
