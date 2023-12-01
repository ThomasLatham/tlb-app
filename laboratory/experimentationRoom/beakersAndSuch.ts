import * as fs from "fs";
import { Client, ContactProperties, LibraryResponse } from "node-mailjet";
import matter from "gray-matter";
import readingTime from "reading-time";

import { getLocalVariableValue } from "./utilityCloset";
import { POSTS_PATH } from "../../src/constants";
import { PostFrontmatter } from "../../src/interfaces";

/**
 * Executes the process of sending new-post-notifaction emails.
 *
 * Considerations:
 * - need to generate the HTML for each send
 *   - do this in the cronjob
 *
 * Infrastructure/tech stack:
 * - Need a DB that holds all the subscribers and what they're subscribed to
 * - using Vercel Postgres for storage, going to queue emails in the DB
 * - using Gmail API to send emails in MIME format
 * - using Vercel cronjob to read/write the queue and send emails at daily intervals
 *
 * Steps (new post merged to `main` branch):
 *
 * - [x] 1. GitHub Webhook sees the merged PR and sends request to our Next.js API endpoint
 * - [x] 2. Next.js API endpoint gets the post's ID and frontmatter
 * - [ ] 3. Next.js API endpoint gets the list of subscribers from the Vercel DB
 * - [ ] 4. Next.js API endpoint schedules emails the Vercel DB
 * - [ ] 5. Vercel cronjob daily reads from the Vercel DB scheduled emails, sends 2000 from the top
 *    then deletes the records from the schedule table
 *
 * @param newPostId
 */
const executeNewPostNotificationFlow = async (newPostId: string) => {
  const frontmatter = getFrontmatterFromPostId(newPostId);
  const mailjet = new Client({
    apiKey: getLocalVariableValue("MAILJET_API_KEY"),
    apiSecret: getLocalVariableValue("MAILJET_SECRET_KEY"),
  });

  const subscribers = await getSubscribersFromPostTags(frontmatter.tags, mailjet);
  await sendNewPostNotificationEmails(subscribers, frontmatter, newPostId, mailjet);
};

const getFrontmatterFromPostId = (postId: string): PostFrontmatter => {
  const sourceText = fs.readFileSync(`${POSTS_PATH}/${postId}/${postId}.mdx`, "utf8");
  return {
    ...matter(sourceText).data,
    wordCount: sourceText.split(/\s+/gu).length,
    readingTime: readingTime(sourceText).minutes,
  } as PostFrontmatter;
};

const getSubscribersFromPostTags = async (
  tagsFromPost: string[],
  mailjet: Client
): Promise<ContactProperties.ContactData[]> => {
  const queryData: ContactProperties.GetContactDataQueryParams = {
    ContactsList: 10354543,
  };

  const result: LibraryResponse<ContactProperties.GetContactDataResponse> = await mailjet
    .get("contactdata", { version: "v3" })
    .request({}, queryData);

  return result.body.Data.filter((contact: ContactProperties.ContactData) => {
    const contactSubscribedTags = contact.Data.filter(
      (contactProperty: ContactProperties.ContactProperty) =>
        contactProperty.Name === "tags_subscribed_to"
    )[0].Value.split(", ");

    return (
      contactSubscribedTags.includes("all") || hasCommonElement(tagsFromPost, contactSubscribedTags)
    );
  });
};

/**
 * Check if there is any common element between two arrays of strings.
 *
 * @param {string[]} array1 - The first array of strings.
 * @param {string[]} array2 - The second array of strings.
 * @returns {boolean} Returns true if there is any common element, false otherwise.
 */
const hasCommonElement = (array1: string[], array2: string[]): boolean => {
  // Use the Set data structure for efficient membership testing
  const set1 = new Set(array1);

  // Check if any element in array2 is in set1
  for (const element of array2) {
    if (set1.has(element)) {
      return true; // Found a common element
    }
  }

  // No common element found
  return false;
};

const sendNewPostNotificationEmails = async (
  subscribers: ContactProperties.ContactData[],
  newPostFrontmatter: PostFrontmatter,
  newPostId: string,
  mailjet: Client
) => {
  const request = mailjet.post("send").request({
    Messages: subscribers.map((subscriber) => {
      return {
        FromEmail: "contact@tomlatham.blog",
        FromName: "Tom Latham",
        Recipients: [
          {
            Email: getContactPropertyValue(subscriber, "email_address"),
            Name: getContactPropertyValue(subscriber, "first_name"),
          },
        ],
        Subject: "There's a new post on the Tom Latham Blog!",
        "Mj-TemplateID": 5346495,
        "Mj-TemplateLanguage": true,
        Vars: {
          newPostFrontmatter: {
            ...newPostFrontmatter,
          },
          newPostId: newPostId,
        },
      };
    }),
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((error) => {
      console.log(error.statusCode);
    });
};

const getContactPropertyValue = (
  contactData: ContactProperties.ContactData,
  propertyName: string
) => {
  return contactData.Data.filter((contactProperty) => contactProperty.Name === propertyName)[0]
    .Value;
};

/* *** *** *** *** *** *** *** *** *** *** *** *** *
 * System Internals Below -- Probably Don't Change *
 * *** *** *** *** *** *** *** *** *** *** *** *** */

const putTestTubeInCentrifuge = async () => {
  await executeNewPostNotificationFlow("test-post");
};

export default putTestTubeInCentrifuge;
