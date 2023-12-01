import { Client, ContactProperties, LibraryResponse } from "node-mailjet";
        await executeNewPostNotificationFlow(newPostId);
const executeNewPostNotificationFlow = async (newPostId: string) => {
  // new flow now that we can't use segmentation:
  // - going to use the Send API (v3) rather than campaigns
  // - get all the subscribers, then filter here (NextJS) for those subscribed to
const getSubscribersFromPostTags = async (
  tagsFromPost: string[],
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
      contactSubscribedTags.includes("all") || hasCommonElement(tagsFromPost, contactSubscribedTags)
  });
 * Check if there is any common element between two arrays of strings.
 * @param {string[]} array1 - The first array of strings.
 * @param {string[]} array2 - The second array of strings.
 * @returns {boolean} Returns true if there is any common element, false otherwise.
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
        TemplateID: 5346495,
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
    .catch((error) => {
      console.log(error.statusCode);
const getContactPropertyValue = (
  contactData: ContactProperties.ContactData,
  propertyName: string
) => {
  return contactData.Data.filter((contactProperty) => contactProperty.Name === propertyName)[0]
    .Value;

// comment for PR