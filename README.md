# Tom Latham Blog

I created this project primarily with Next.js and React to practice and demonstrate my programming
skills. Blog posts are written in [MDX](https://mdxjs.com/), allowing me to embed interactive React
components in Markdown, a simple, easy-to-read markup language. It really is the best of both
worlds.

The posts live on the server (I suppose I use GitHub as a CMS) and are also compiled and bundled
server-side using [mdx-bundler](https://github.com/kentcdodds/mdx-bundler). Each blog-post page
that, in fact, is also [rendered on the
server](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation#static-generation-with-data)
at build time, and the resulting HTML is served to clients and reused on each request.

I also have some plain Markdown content for items in my portfolio, and that is served in a similar
way. The differences are:
* (a.) There's no need for compiling and bundling the content since it's plain Markdown — it gets
  passed in the server as plain text and rendered there via
  [react-markdown](https://github.com/remarkjs/react-markdown).
* (b.) Instead of rendering at build time like each of the blog-post pages, the portfolio page is
  rendered [on every
  request](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering).
  (This doesn't seem necessary now that I'm writing about it; it rather seems that the portfolio
  page would be better off being rendered at build time since it doesn't ever need to re-pre-render
  with updated external data. For now, though, we'll just say we're using `getServerSideProps` as an
  exercise in Next.js capabilities.)

Anyway, those are the basics of what's going on with this blog, and below I'll go into more details in
case somebody wants learn more about the technologies used or build their own website.

## Project Structure

### `public`

This directory is used by Next.js for [serving static
files](https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets) in a
conveniently-programmed way. In my own implementation, images owned by myself are in the
`public/myImages` directory, and images I don't own are in the `public/otherImages` directory.

### General Standards in `src`

* For the most part every TypeScript file gets its own directory, with exports passed onto the
  directory's `index.ts` file.
* All exports (default and named) are declared at the end of files.

### `src/components`

Here we find all the from-scratch components used in the website, except those consumed in blog-post
MDX files. The exception to this is the `<BlogPlot>` , which contains the large Plotly import so that
posts that use it don't have such a large amount of data, since this [strains the
client](https://nextjs.org/docs/messages/large-page-data).

An important detail is that components used exclusively on the `posts/id` page have names beginning
with "Blog." The
[ `<Layout>` ](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)
component is also special and worth mentioning since it's a parent of every page.

### `src/constants`

For things that don't change and are used in multiple parts of the application.

### `src/content`

This directory is basically the "database" for the application. Here we have the MDX blog posts, the
components embedded into that MDX and also the Markdown files for portfolio items.

### `src/contentRetrieval`

If `src/content` is the database of the app, then this directory is like the API (in a way, since
everything that consumes the data returned from here still gets rendered on the server anyway).
Retrieving portfolio items is fairly straightforward, since our use-case is only ever getting all of
them, but post retrieval is a bit more involved, since sometimes we only want the frontmatter or a
filtered subset of the posts.

If I ever move away from using GitHub as my CMS and instead set up a separate back end to serve data
from a database, then this directory will probably hold all the functions for hitting that API for
reusability purposes.

### `src/ducks`

The code for managing application state via the [Redux ducks
pattern](https://github.com/erikras/ducks-modular-redux). Right now the only application state we're
managing is the `userPreferences` slice with the `useDarkMode` state and `toggleUseDarkMode`

reducer.

### `src/interfaces`

Any TypeScript interfaces that get reused.

### `src/pages`

## Use This Code as a Template for Your Own Blog

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `yarn` installed globally on your machine.

Installation:

 `yarn`

To Start Server:

 `yarn dev`

To Visit App:

 `localhost:3000`
