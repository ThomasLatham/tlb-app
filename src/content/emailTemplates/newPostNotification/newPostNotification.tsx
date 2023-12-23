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

import { PostFrontmatter } from "@/interfaces";
import { formatDateString } from "@/utils/format";
import { getBasePath, getToken } from "@/utils/general";

import { renderReactToMjml } from "../renderReactToMjml";
import tailwindConfig from "../../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const getNewPostNotificationHtml = (
  recipientUserId: string,
  recipientName: string,
  postFrontmatter: PostFrontmatter,
  postId: string
) => {
  const token = getToken(recipientUserId);

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
              src="https://raw.githubusercontent.com/ThomasLatham/tlb-app/main/public/myImages/full_logo_transparent.png"
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
        <MjmlSection paddingTop={0} paddingBottom={0} paddingLeft={6} paddingRight={6}>
          <MjmlColumn cssClass="border" width={300}>
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
              href={getBasePath() + "/posts/" + postId}
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
