import React from "react";
import Image from "next/image";
import Head from "next/head";

import Layout from "../../components/layout";
import tomPic from "./tom-pic.jpg";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Head key="about">
        <title>{"About Tom's Blog"}</title>
      </Head>
      <div
        className="
        flex flex-col items-center content-center justify-center 
        dark:text-trim-dark text-secondary-light 
        max-w-full"
      >
        <p className="mt-6 text-[30px] underline">About Me</p>
        <div className="flex flex-col sm:flex-row items-center px-4 lg:px-44 sm:mt-4">
          <Image
            src={tomPic}
            alt="tom-pic"
            width={210}
            height={250}
            className="border-2 
            object-contain 
            dark:border-trim-dark border-secondary-light"
          />
          <p className="sm:pl-5 sm:mt-0 mt-2 text-justify">
            {`I'm a software developer who lives in New England. Besides coding, I like 
            dabbling in a range of hobbies. I can usually be found doing something fun outside, 
            finding a cool diner to eat at or playing video games with my friends.`}
          </p>
        </div>
        <p className="mt-8 text-[30px] underline">About The Blog</p>
        <p className="text-justify px-4 lg:px-44 sm:mt-4">
          {`
          I started this website as a way to expand and improve my programming skills, and
          while that focus still motivates a lot of what I do here, 
          the blog is also becoming a way for me to simply share my interests with the world. 
          On the technical side, I built it with React, utilizing the Next.js framework in conjunction with`}{" "}
          <a
            className="dark:text-secondary-dark text-side-light hover:underline"
            href="https://mdxjs.com/"
          >
            MDX
          </a>{" "}
          and{" "}
          <a
            className="dark:text-secondary-dark text-side-light hover:underline"
            href="https://github.com/kentcdodds/mdx-bundler"
          >
            mdx-bundler
          </a>{" "}
          {`
          for creating interactive blog posts. If you're interested in the source code, 
          you can check it out at the blog's`}{" "}
          <a
            className="dark:text-secondary-dark text-side-light hover:underline"
            href="https://github.com/ThomasLatham/tlb-app"
          >
            GitHub repository
          </a>
          {"."}
          <br />
          <br />
          {`I chose the honeycomb symbol for the logo and theme bee-cause I think the animals
          that make them are cool, and hexagons are math-y. And when I was creating the logo I found
          a public-domain honeycomb SVG that didn't require any attribution for usage (but thanks`}{" "}
          <a
            className="dark:text-secondary-dark text-side-light hover:underline"
            href="https://uxwing.com/honeycomb-icon/"
          >
            UXWing
          </a>{" "}
          for the image).
          <br /> <br />
          {`If you find a post here that educates or entertains you in some way, I'd be stoked to hear
          about that. Feel free to email me at`}{" "}
          <a
            className="dark:text-secondary-dark text-side-light hover:underline"
            href="mailto:contact@tomlatham.blog"
          >
            contact@tomlatham.blog
          </a>{" "}
          with any feedback or questions, and thanks for visiting!
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
