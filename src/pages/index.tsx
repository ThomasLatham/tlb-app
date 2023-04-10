import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import _ from "lodash";
const HexGrid = dynamic(() => import("react-hexgrid").then((a) => a.HexGrid), { ssr: false });
const HexLayout = dynamic(() => import("react-hexgrid").then((a) => a.Layout), { ssr: false });
const Hexagon = dynamic(() => import("react-hexgrid").then((a) => a.Hexagon), { ssr: false });
const Text = dynamic(() => import("react-hexgrid").then((a) => a.Text), { ssr: false });

import { useAppSelector } from "../redux/hooks";
import { userPreferences } from "../ducks";
import Layout from "../components/layout";
import tailwindConfig from "../../tailwind.config";

const colors = tailwindConfig.theme.colors;

interface HexLinkData {
  href: string;
  q: number;
  r: number;
  s: number;
  text: string;
}

const Home: React.FC = () => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);

  const [hexLinkDataArr, setHexLinkDataArr] = useState<HexLinkData[]>([
    {
      href: "/posts",
      q: 0,
      r: 0,
      s: 0,
      text: "Random Post",
    },
    {
      href: "/posts",
      q: 0,
      r: 1,
      s: -1,
      text: "All Posts",
    },
    {
      href: "/posts?searchText=&selectedTags=math",
      q: 1,
      r: -1,
      s: 0,
      text: "Math Posts",
    },
    {
      href: "/posts?searchText=&selectedTags=career",
      q: 1,
      r: 0,
      s: -1,
      text: "Career Posts",
    },
    {
      href: "/posts?searchText=&selectedTags=travel",
      q: -1,
      r: 0,
      s: 1,
      text: "Travel Posts",
    },
    {
      href: "/posts?searchText=&selectedTags=programming",
      q: -1,
      r: 1,
      s: 0,
      text: "Programming Posts",
    },
  ]);

  return (
    <Layout>
      <Head>
        <title>{"Tom's Blog"}</title>
      </Head>
      <div className="flex flex-row items-center content-center justify-center">
        <div>
          <HexGrid viewBox="-50 -60 100 120" className="mb-[18px] sm:mb-[-80px] sm:mt-[-30px]">
            <HexLayout size={{ x: 18, y: 18 }} flat={true} spacing={1}>
              <Hexagon q={0} r={-1} s={1} className="">
                <Text y={-10}>Hi, I'm Tom.</Text>
                <Text>Welcome to my blog.</Text>
              </Hexagon>
              <React.Fragment>
                {hexLinkDataArr.map((data, idx) => {
                  return (
                    <Link
                      key={idx}
                      href={data.href}
                      onMouseEnter={() => {
                        // because z-index doesn't apply to SVGs (it's just whichever <g> is rendered last
                        // is the one that's "on top"), if we want the hexagons to all be touching, and we
                        // we also want the border of the currently-hovered hexagon to not be covered by another
                        // hexagon, we have to move the currently-hovered hexagon to the last place in the render
                        // order
                        const hexLinkDataArrCopy = _.cloneDeep(hexLinkDataArr);
                        hexLinkDataArrCopy.push(hexLinkDataArrCopy.splice(idx, 1)[0]);
                        setHexLinkDataArr(hexLinkDataArrCopy);
                      }}
                    >
                      <Hexagon q={data.q} r={data.r} s={data.s}>
                        <Text>{data.text}</Text>
                      </Hexagon>
                    </Link>
                  );
                })}
              </React.Fragment>
            </HexLayout>
          </HexGrid>
        </div>
      </div>
      <style>{`
        svg g polygon {
          stroke: ${colors[useDarkMode ? "secondary-dark" : "back-light"]};
          stroke-width: 0.4;
        }
        svg g {
          fill: ${colors[useDarkMode ? "back-dark" : "secondary-light"]};
        }
        a g g:hover polygon {
          stroke: ${colors[useDarkMode ? "trim-dark" : "back-light"]};
          stroke-width: 0.4;
        }
        svg g text {
          font-size: 3px;
          fill: ${colors[useDarkMode ? "trim-dark" : "secondary-light"]};
        }
        /*this next block keeps the website from being yuck on mobile*/
        svg {
          width: 100%;
          max-width: 100%;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
