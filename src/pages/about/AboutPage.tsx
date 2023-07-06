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
            {`I'm a software developer who's been based out of Hartford, Connecticut for the last year
            or so. For work I'm currently developing an enterprise application for my company's
            (Infosys Limited) client, writing mostly frontend code in Angular, but also helping out
            in our Spring Boot API as needed. Before that I held an ETL QA role for the same client,
            where I got the opportunity to automate my team's workflow with Python.`}
            <br />
            <br />
            Before getting into IT, I spent a year lifeguarding on the beach in Florida, and before
            that I got a degree in math from Eastern Washington University. In my free time I like
            exercising, surfing, travling, playing music and, of course, coding.
            <br />
            <br />I hope someday to land a timezone-independent programming job, preferably with a
            company whose mission I really believe in, enabling me to pursue my passions and make a
            living from anywhere in the world while also contributing to something that aligns with
            my values.
          </p>
        </div>
        <p className="mt-8 text-[30px] underline">About The Blog</p>
        <p className="text-justify px-4 lg:px-44 sm:mt-4">
          {`
          I started this website as a way to practice (and demonstrate) my programming skills, and
          that'll probably remain the primary reason for its existence. I built it with React,
          utilizing the Next.js framework in conjunction with`}{" "}
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
            href="mailto:tom.latham.blog@gmail.com"
          >
            tom.latham.blog@gmail.com
          </a>{" "}
          with any feedback or questions, and thanks for visiting!
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
