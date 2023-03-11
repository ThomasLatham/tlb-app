interface Heading {
  id: string;
  title: string;
}

interface HeadingWithNestedHeadings extends Heading {
  items: Heading[];
}

interface Frontmatter {
  title: string;
  datePublished: Date;
  lastUpdated?: Date;
  author: string;
  description: string;
  tags: string[];
}

export type { Heading, HeadingWithNestedHeadings, Frontmatter };
