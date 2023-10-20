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
  wordCount: number;
  readingTime: number;
}

interface PortfolioItemFrontmatter {
  id: string;
  title: string;
  role: string;
  description: string;
  cardImage: string;
}

interface PortfolioCardProps {
  markdownContent: string;
  frontmatter: PortfolioItemFrontmatter;
  cardImageBase64: string;
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
