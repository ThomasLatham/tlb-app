import path from "path";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");

const PORTFOLIO_ITEMS_PATH = path.join(process.cwd(), "src/content/portfolioItems");

const THEME_TYPES = {
  THEME_DARK: "dark",
  THEME_LIGHT: "light",
};

const NAV_OPTIONS = [
  ["Home", "/"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/posts"],
  ["About", "/about"],
];

export { POSTS_PATH, PORTFOLIO_ITEMS_PATH, THEME_TYPES, NAV_OPTIONS };
