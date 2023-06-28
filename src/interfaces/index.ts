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

interface PostSearchFilter {
  searchText: string;
  tags: string[];
}

export type { Heading, HeadingWithNestedHeadings, PostFrontmatter, PostSearchFilter };
