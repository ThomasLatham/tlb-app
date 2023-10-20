# Tom Latham Blog

## Table of Contents
+ [Project Structure](#project-structure)
- [Use This Code as a Template for Your Own Blog](#use-this-code-as-a-template-for-your-own-blog)

---

I created this project primarily with Next.js and React to practice and demonstrate my programming skills. Blog posts are written in [MDX](https://mdxjs.com/), allowing me to embed interactive React components in Markdown, a simple, easy-to-read markup language. It really is the best of both worlds.

The posts live on the server (I suppose I use GitHub as a CMS) and are also compiled and bundled server-side using [mdx-bundler](https://github.com/kentcdodds/mdx-bundler). Each blog-post page, in fact, is also [rendered on the server](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation#static-generation-with-data) at build time, and the resulting HTML is served to clients and reused on each request.

I also have some plain Markdown content for items in my portfolio, and that is served in a similar way. The differences are:

- (a.) There's no need for compiling and bundling the content since it's plain Markdown — it gets passed in the server as plain text and rendered there with the help of [react-markdown](https://github.com/remarkjs/react-markdown).
- (b.) Instead of rendering at build time like each of the blog-post pages, the portfolio page is rendered [on every request](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering). (This doesn't seem necessary now that I'm writing about it; it rather seems that the portfolio page would be better off being rendered at build time since it doesn't ever need to re-pre-render with updated external data. For now, though, we'll just say we're using `getServerSideProps` as an exercise in Next.js capabilities.)

Anyway, those are the basics of what's going on with this blog, and below I'll go into more details in case somebody wants learn more about the technologies used or build their own website.

## Project Structure

### `public`

This directory is used by Next.js for [serving static files](https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets) in a conveniently-programmed way. In my own implementation, images owned by myself are in the `public/myImages` directory, and images I don't own are in the `public/otherImages` directory.

### General Standards in `src`

- For the most part every TypeScript file gets its own directory, with exports passed onto the directory's `index.ts` file.
- All exports (default and named) are declared at the end of files.

### `src/components`

Here we find all the from-scratch components used in the website, except those consumed in blog-post MDX files. The exception to this is the `<BlogPlot>` , which contains the large Plotly import so that posts that use it don't have such a large amount of data, since this [strains the client](https://nextjs.org/docs/messages/large-page-data).

An important detail is that components used exclusively on the `posts/id` page have names beginning with "Blog." The [`<Layout>`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required) component is also special and worth mentioning since it's a parent of every page.

### `src/constants`

For things that don't change and are used in multiple parts of the application.

### `src/content`

This directory is basically the "database" for the application. Here we have the MDX blog posts, the components embedded into that MDX and also the Markdown files for portfolio items.

### `src/contentRetrieval`

If `src/content` is the database of the app, then this directory is like the API (in a way, since everything that consumes the data returned from here still gets rendered on the server anyway). Retrieving portfolio items is fairly straightforward, since our use-case is only ever getting all of them, but post retrieval is a bit more involved, since sometimes we only want the frontmatter or a filtered subset of the posts.

If I ever move away from using GitHub as my CMS and instead set up a separate back end to serve data from a database, then this directory will probably hold all the functions for hitting that API for reusability purposes.

### `src/ducks`

The code for managing application state via the [Redux ducks pattern](https://github.com/erikras/ducks-modular-redux). Right now the only application state we're managing is the `userPreferences` slice with the `useDarkMode` state and `toggleUseDarkMode`

reducer.

### `src/interfaces`

Any TypeScript interfaces that get reused.

### `src/pages`

This directory implements the Next.js [Pages
Router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts).
Eventually I want to migrate to the [App Router](https://nextjs.org/docs/app).

### `src/redux`

Here you'll find the Redux store and root reducer.

### `src/styles`

Here we have global styling for the whole application (e.g., smooth scrolling and Webkit stuff) and
also the syntax-highlighting rules for code snippets in blog posts.

### `src/types`

This directory is for custom types, in case some dependency isn't typed or we only want a type
declaration for a partial bundle of a dependency, as seen
[here](https://dev.to/dheerajmurali/building-a-responsive-chart-in-react-with-plotly-js-4on8).

### `src/utils`

We have here shared tools for formatting and general usage, as well as custom React hooks.

### Noteworthy Root-Directory Files

Most of the configuration files are just a matter of reading the documentation provided for them to
see what they're doing for the application. In `next.config.js` we have some stuff going on to make
SVGs render as React components. Also, in `tailwind.config.js` is the palette definition for the
application, which may be of particular use if you're going to use this codebase as a template for
your own blog.

## Use This Code as a Template for Your Own Blog

### Step 1: Clone the Repo and Get Dependencies

First, open a terminal (e.g., Git Bash) in some directory where you want the code to live locally.
Then enter the command

```bash
git clone https://github.com/ThomasLatham/tlb-app.git
```

Then, make sure you have `node` and `yarn` installed globally on your machine. You can check this by
entering `node -v` and `yarn -v` in the terminal. To install dependencies for the application, run
`yarn`.

Now you can run the application locally in development mode with the command `yarn dev`, after which
you can visit `localhost:3000` to see the website.

### Step 2: Personalize Your Blog

#### Logo and Icon

In the `public/myImages` directory, replace `logo.svg` with a logo of your own. I used
[UXWing](https://uxwing.com) to find an attribution-free SVG, and then I used a mix of
[GIMP](https://www.gimp.org/) and [Inkscape](https://inkscape.org/) to edit and add onto the SVG to
my liking. I used [favicon.io](https://favicon.io/) to generate the icons in the `public/myImages/favicon`
directory, using just the honeycomb symbol portion of my logo.

#### Blog Posts

Start by cleaning out the files in the `src/content/posts` directory. Once cleanup is done, to
create a blog post, make a new MDX file in that same directory (e.g., `my-first-post.mdx`). The
filename (without the `.mdx` extension) will be used as the slug for the post URL, so I
recommend-using-kebab-case-for-that.

Inside that file you just
created, at the very top you'll want to have some frontmatter in the following format:

```Markdown
---
title: My First Post!
datePublished: "2024-01-03"
author: Finn Mertins
description: A short description for your first blog post.
tags: ["Tag1", "Tag2"]
---
```

Below that you can add any Markdown you want for post's content. You don't really have to do
anything else besides this to make a new post because the application automatically does the rest
for you, including creating a listing in the post-search page and making the post page itself.
There's some fine-tuning you can do though, if you want:
- To change the way code snippets are displayed, you'll want to check out and play with the
  `src/styles/syntaxHighlighting.css` file. Some code-snippet styling is also done in
  `tailwind.config.js` in the root directory, but that's just keeping Tailwind from wrapping every
  snippet in quotes.
- To change the depth of the table of contents, you'll want to take a look at the `useHeadingsData()`
  function in `src/utils/hooks/hooks.ts`. It looks like:
  ```TypeScript
  const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<HeadingWithNestedHeadings[]>([]);

  useEffect(() => {
    const headingElements: HTMLElement[] = Array.from(document.querySelectorAll("h1, h2"));

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};
```
Change the argument of `document.querySelectorAll()` to get the desired TOC depth you're after. For example, if you only one top-level headings to be included in the TOC, then the argument to that function would just be `"h1"`. If you wanted a depth of three, though, then you could pass `"h1, h2, h3"` as the argument.

### Portfolio

### Color Palette

## Deploying