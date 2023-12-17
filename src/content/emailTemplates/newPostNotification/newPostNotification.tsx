/* eslint-disable quotes */
import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlButton,
  MjmlImage,
  MjmlText,
  MjmlStyle,
} from "@faire/mjml-react";
import jwt from "jsonwebtoken";

import { PostFrontmatter } from "@/interfaces";
import { formatDateString } from "@/utils/format";
import { getBasePath } from "@/utils/general";

import { renderReactToMjml } from "../renderReactToMjml";
import tailwindConfig from "../../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const getNewPostNotificationHtml = (
  recipientUserId: string,
  recipientName: string,
  postFrontmatter: PostFrontmatter,
  postId: string
) => {
  let token;
  if (process.env.JWT_SECRET) {
    token = jwt.sign(
      {
        userId: recipientUserId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30 days" }
    );
  } else {
    throw "Error: Missing environment variable: JWT_SECRET.";
  }

  if (!token) {
    throw "Error: Empty token.";
  }

  return renderReactToMjml(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>New Post Notification</MjmlTitle>
        <MjmlPreview>{"There's a new post on the Tom Latham Blog!"}</MjmlPreview>
        <MjmlStyle>{`
          .border {
            border: 1.5px solid ${colors["side-dark"]} !important;
            border-radius: 2px !important;
          }
    `}</MjmlStyle>
      </MjmlHead>
      <MjmlBody width={600} backgroundColor={colors["primary-dark"]}>
        <MjmlSection paddingBottom={0}>
          <MjmlColumn
            width={200}
            backgroundColor={colors["secondary-dark"]}
            border="2px"
            borderRadius="3px"
          >
            <MjmlImage
              width={200}
              src="https://raw.githubusercontent.com/ThomasLatham/tlb-app/1d8abe85e4fd0a5d6538a356845816ef6b705430/public/myImages/logo.svg"
            />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingBottom={0}>
          <MjmlColumn>
            <MjmlText color={colors["trim-dark"]}>{`Hi ${recipientName.split(" ")[0]},`}</MjmlText>
            <MjmlText color={colors["trim-dark"]}>
              {`There's a new post on my blog that you might be interested in! See below for details:`}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={0} paddingBottom={0}>
          <MjmlColumn cssClass="border" width={400}>
            <MjmlText
              align="center"
              color={colors["trim-dark"]}
              textDecoration={"underline"}
              fontSize={20}
            >
              {postFrontmatter.title}
            </MjmlText>

            <MjmlText align="left" color={colors["trim-dark"]} paddingTop={0}>
              {postFrontmatter.description}
            </MjmlText>
            <MjmlText align="left" color={colors["trim-dark"]} paddingTop={0} paddingBottom={4}>
              {"✍️ " + postFrontmatter.author}
            </MjmlText>
            <MjmlText align="left" color={colors["trim-dark"]} paddingTop={0} paddingBottom={4}>
              {"🗓️ " + formatDateString(postFrontmatter.datePublished)}
            </MjmlText>
            <MjmlText align="left" color={colors["trim-dark"]} paddingTop={0} paddingBottom={4}>
              {"🕑 " + postFrontmatter.readingTime + " minutes"}
            </MjmlText>
            <MjmlText align="left" color={colors["trim-dark"]} paddingTop={0} paddingBottom={6}>
              {"#️⃣ " + postFrontmatter.tags.join(", ")}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={0} paddingBottom={0}>
          <MjmlColumn>
            <MjmlButton
              backgroundColor={colors["primary-dark"]}
              border={"1.5px solid " + colors["side-dark"]}
              color={colors["trim-dark"]}
              href={"https://tomlatham.blog/posts/" + postId}
            >
              Click here to check it out!
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={0} paddingBottom={0}>
          <MjmlColumn>
            <MjmlText color={colors["trim-dark"]}>
              {`I hope you'll take a look. Feel free to tell me what you think by respoding to this email!`}
            </MjmlText>
            <MjmlText color={colors["trim-dark"]}>Sincerely,</MjmlText>
            <MjmlText color={colors["trim-dark"]}>Tom Latham</MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={0} paddingBottom={2}>
          <MjmlColumn>
            <MjmlButton
              backgroundColor={colors["primary-dark"]}
              fontSize={10}
              color={colors["trim-dark"]}
              href={getBasePath() + "/api/v1/users/self/tags?token=" + token}
            >
              {`Don't want to receive these emails anymore? Click here to unsubscribe.`}
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  );
};

export default getNewPostNotificationHtml;
