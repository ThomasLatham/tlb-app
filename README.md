# Tom Latham Blog

<!-- omit in toc -->
## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
   1. [General Standards](#general-standards)
   2. [The `src` Directory](#the-src-directory)
      1. [`src/components`](#srccomponents)
      2. [`src/constants`](#srcconstants)
      3. [`src/content`](#srccontent)
      4. [`src/contentRetrieval`](#srccontentretrieval)
      5. [`src/ducks`](#srcducks)
      6. [`src/interfaces`](#srcinterfaces)
      7. [`src/pages`](#srcpages)
      8. [`src/redux`](#srcredux)
      9. [`src/styles`](#srcstyles)
      10. [`src/types`](#srctypes)
      11. [`src/utils`](#srcutils)
   3. [Other Directories and Files](#other-directories-and-files)
      1. [The `public` Directory](#the-public-directory)
      2. [Root-Directory Configuration Files](#root-directory-configuration-files)
3. [Use This Code as a Template for Your Own Blog](#use-this-code-as-a-template-for-your-own-blog)
   1. [Step 1: Clone the Repo and Get Dependencies](#step-1-clone-the-repo-and-get-dependencies)
      1. [Clone the Repo](#clone-the-repo)
      2. [Get Dependencies and Run Locally](#get-dependencies-and-run-locally)
   2. [Step 2: Personalize Your Blog's Content](#step-2-personalize-your-blogs-content)
      1. [License (Important!)](#license-important)
      2. [Logo and Icon](#logo-and-icon)
      3. [Blog Posts](#blog-posts)
      4. [Portfolio](#portfolio)
      5. [Color Palette](#color-palette)
   3. [Step 3: Deploy Your Blog](#step-3-deploy-your-blog)
      1. [Set Up Your Own GitHub Repository](#set-up-your-own-github-repository)
      2. [Deploy to Vercel](#deploy-to-vercel)


---

## Project Overview

I created this project primarily with Next.js, React and Tailwind to practice and demonstrate my programming skills. Blog posts are written in [MDX](https://mdxjs.com/), allowing me to embed interactive React components in Markdown, a simple, easy-to-read markup language. It really is the best of both worlds.

The posts live on the server (I suppose I use GitHub as a CMS) and are also compiled and bundled server-side using [mdx-bundler](https://github.com/kentcdodds/mdx-bundler). Each blog-post page, in fact, is also [rendered on the server](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation#static-generation-with-data) at build time, and the resulting HTML is served to clients and reused on each request.

I also have some plain Markdown content for items in my portfolio, and that is served in a similar
way. Since it's just regular old Markdown though there's no need for compiling and bundling the
content, so it simply gets passed in the server as plain text and rendered there with the help of
[react-markdown](https://github.com/remarkjs/react-markdown).

Those are the basics of what's going on with this blog; below I'll go into more details in case
anybody wants learn more about how I have things organized or if they want to build a blog of their
own using this code.

## Project Structure

### General Standards

- For the most part, every TypeScript file gets its own directory, with exports passed onto the
  directory's `index.ts` file.
- All exports (default and named) are declared at the end of files.
- Code is formatted according to the rules outlined in `.eslintrc.js` and `.prettierrc.js`.

### The `src` Directory

#### `src/components`

Here we find all the from-scratch components used in the website, except those consumed in blog-post MDX files. The exception to this is the `<BlogPlot>` , which contains the large Plotly import so that posts that use it don't have such a large amount of data, since this [strains the client](https://nextjs.org/docs/messages/large-page-data).

An important detail is that components used exclusively on the `posts/id` page have names beginning with "Blog." The [`<Layout>`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required) component is also special and worth mentioning since it's a parent of every page.

#### `src/constants`

For things that don't change and are used in multiple parts of the application.

#### `src/content`

This directory is basically the "database" for the application. Here we have the MDX blog posts, the components embedded into that MDX and also the Markdown files for portfolio items.

#### `src/contentRetrieval`

If `src/content` is the database of the app, then this directory is like the API (in a way, since everything that consumes the data returned from here still gets rendered on the server anyway). Retrieving portfolio items is fairly straightforward, since our use-case is only ever getting all of them, but post retrieval is a bit more involved, since sometimes we only want the frontmatter or a filtered subset of the posts.

If I ever move away from using GitHub as my CMS and instead set up a separate back end to serve data from a database, then this directory will probably hold all the functions for hitting that API for reusability purposes.

#### `src/ducks`

The code for managing application state via the [Redux ducks pattern](https://github.com/erikras/ducks-modular-redux). Right now the only application state we're managing is the `userPreferences` slice with the `useDarkMode` state and `toggleUseDarkMode` reducer.

#### `src/interfaces`

Any TypeScript interfaces that get reused.

#### `src/pages`

This directory implements the Next.js [Pages
Router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts).
Eventually I want to migrate to the [App Router](https://nextjs.org/docs/app).

#### `src/redux`

Here you'll find the Redux store and root reducer.

#### `src/styles`

Here we have global styling for the whole application (e.g., smooth scrolling and Webkit stuff) and
also the syntax-highlighting rules for code snippets in blog posts.

#### `src/types`

This directory is for custom types, in case some dependency isn't typed or we only want a type
declaration for a partial bundle of a dependency, as seen
[here](https://dev.to/dheerajmurali/building-a-responsive-chart-in-react-with-plotly-js-4on8).

#### `src/utils`

We have here shared tools for formatting and general usage, as well as custom React hooks.

### Other Directories and Files

#### The `public` Directory

This directory is used by Next.js for [serving static
files](https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets) in a
conveniently-programmed way. In my own implementation, images owned by myself are in the
`public/myImages` directory, and images I don't own are in the `public/otherImages` directory.

#### Root-Directory Configuration Files
Understanding most of the config files in the root directory is just a matter of reading the
official documentation provided for them to see what they're doing for the application. In
`next.config.js` we have some stuff going on to make SVGs render as React components. Also, in
`tailwind.config.js` is the palette definition for the application, which may be of particular use
if you're going to use this codebase as a template for your own blog.

## Use This Code as a Template for Your Own Blog

### Step 1: Clone the Repo and Get Dependencies

#### Clone the Repo

First, open a terminal (e.g., Git Bash) in some directory where you want the code to live locally.
Then pick a name for the directory that will store the codebase (e.g., `my-blog-app`) and enter the
command

```bash
git clone https://github.com/ThomasLatham/tlb-app.git my-blog-app
```
After that, enter the command `cd my-blog-app` to navigate into the project's root directory.

(In both the commands above, you can replace the `my-blog-app` part with whatever directory name you
chose.)

From there, go into the `package.json` file and change the value of the `name` property to something of your
choosing (e.g., `"my-blog-app"`).

#### Get Dependencies and Run Locally

Make sure you have `node` and `yarn` installed globally on your machine. You can check this by
entering `node -v` and `yarn -v` in the terminal. To install dependencies for the application, run
`yarn`.

Now you can run the application locally in development mode with the command `yarn dev`, after which
you can visit `localhost:3000` to see the website.

### Step 2: Personalize Your Blog's Content

#### License (Important!)

If you plan to open-source your blog's code and/or release the blog to the public, then please
follow these steps to ensure licensing is done correctly:
1. Open `LICENSE.md` in the project's root directory.
2. Remove everything from the top of the file down to (but not including) the `# License Texts`
   heading.
3. Remove the `## GPLv3` subheading (and its content) under the `## MIT License` subheading.
4. At the top of the file add the following section:
   ```Markdown
   # Third-Party Software

   ## Thomas Latham

   Copyright (c) 2025 Thomas Latham

   License: MIT
   ```
5. If you want to open-source your code, then [choose a license](https://choosealicense.com/) and
   modify the `LICENSE.md` file to reflect your choice.

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

Inside that file you just created, at the very top you'll want to have some frontmatter in the
following format:

```Markdown
---
title: My First Post!
datePublished: "2025-01-03"
author: Finn Mertins
description: A short description for your first blog post.
tags: ["someTag", "anotherTag"]
---
```

The above is just a template, so feel free to change up the fields to your liking.

Below that you can add any Markdown or React components you want for your post's content. You don't
really have to do anything else besides this to make a new post because the application
automatically does the rest for you, from creating a listing and tag-filter buttons in the
post-search page to styling the post itself and the creating its table of contents. There's some
fine-tuning you can do though, if you want:
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

Change the argument of `document.querySelectorAll()` to get the desired TOC depth you're after. For
example, if you only want top-level headings to be included in the TOC, then the argument to that
function would just be `"h1"`. If you wanted a depth of three, though, then you could pass `"h1, h2,
h3"` as the argument.

#### Portfolio

If you *don't* want a portfolio on your website, follow these steps:
- Delete the `src/pages/portfolio` directory so that Next.js doesn't create a route for the page.
- In `src/constants/index.ts`, remove the `["Portfolio", "/portfolio"]` element from the
  `NAV_OPTIONS` array so that the "Portfolio" option doesn't appear in the navbar and the footer.

If you *do* want a portfolio, follow these steps (the example for which follow my arbitrary naming
conventions):
- Delete the directories which currently reside in the `src/content/portfolioItems` directory.
- Create a new directory there for your first portfolio item, (e.g., `dragonTracker`).
- Inside that directory create a **single** Markdown file (e.g., `dt-info.md`) to hold the content
  of your portfolio item. It's important that there is precisely one Markdown file in the directory.
- Put a PNG in the same directory that will act as the image for the portfolio card (see [my
  portfolio](https://www.tomlatham.blog/portfolio) for an example). The image should be roughly
  square (same height and width dimensions) in order for it to not get distorted. Name it, for
  example, `dt-image.png`.
- At the top of your Markdown file, create frontmatter according to the following format:

  ```Markdown
  ---
  id: "dragon-tracker"
  title: "Dragon Tracker"
  role: "Creator"
  description:"An application I made to globally geolocate dragons and estimate the values of their gold hoards."
  cardImage: "dt-image.png"
  ---
  ```

  It's important that the value of the `cardImage` field matches the name and file extension on the
  card image you placed in the portfolio item's directory. I also recommend for readability keeping
  the value of the `id` field in kebab-case since the portfolio item's URL will display as
  `www.yourblog.com/porfolio#dragon-tracker`.

After following these steps, you should have a working portfolio page that contains your first
portfolio item.

#### Color Palette

To change the colors for the light and dark themes in your blog, open the `tailwind.config.js` file
in the project's root directory and modify the values of the properties in the `theme.colors`
property. For example, if you wanted to change the primary color of the blog's light theme to white,
then you would set the value of `theme.colors["primary-light"]` to `#ffffff`. To read more, check
out [Tailwind's Theme Configuration documentation](https://tailwindcss.com/docs/theme).

### Step 3: Deploy Your Blog

#### Set Up Your Own GitHub Repository

[Create a repo in GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) to house
your blog's code remotely. After that, execute the following commands to point your local repo at
your new remote one:

```bash
git remote set-url origin <URL of the repo you just created>
```

Then, to make sure your deployment reflects all the changes you just made, push those changes to
remote with the following commands:

```bash
git add .
git commit -m "initial commit"
git push
```

#### Deploy to Vercel

With your GitHub repository set up and up to date with your tailored blog content, you're ready to
deploy with Vercel. I could describe this process in detail, but I'd basically just be rewriting
what the awesome folks at Vercel have already prepared in their [Deploying Your Next.js
App](https://nextjs.org/learn/basics/deploying-nextjs-app/deploy) documentation. Of course there are
other deployment options, but Vercel makes the process very simple (and it's the option I chose).
After you follow the steps outlined in that guide, your blog should be live. Congratulations on
making a blog!
