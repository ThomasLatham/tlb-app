import path from "path";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");

const PORTFOLIO_ITEMS_PATH = path.normalize("src/content/portfolioItems");
const PORTFOLIO_ITEMS_PATH_ABSOLUTE = path.join(process.cwd(), PORTFOLIO_ITEMS_PATH);

const THEME_TYPES = {
  THEME_DARK: "dark",
  THEME_LIGHT: "light",
};

const NAV_OPTIONS = [
  ["Home", "/"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/posts"],
  ["About", "/about"],
  ["Subscribe", "/subscribe"],
];

export {
  POSTS_PATH,
  PORTFOLIO_ITEMS_PATH,
  PORTFOLIO_ITEMS_PATH_ABSOLUTE,
  THEME_TYPES,
  NAV_OPTIONS,
};
