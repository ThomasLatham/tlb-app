import { Client, LibraryResponse, Segmentation } from "node-mailjet";
/* ** REQUEST HANDLING ** */

        await sendNewPostNotificationEmails(newPostId);
/* ** GET-POST-ID FLOW ** */

/* ** SEND-EMAILS FLOW ** */

const sendNewPostNotificationEmails = async (newPostId: string) => {
/**
 * This function retrieves the ID of a Mailjet contact filter that `OR`s together the given post
 * tags. In the case that such a filter already exists in the account for which the `mailjet` client
 * is authenticated, then this function just retrieves that filter's ID. Otherwise, the function
 * creates a new filter with the given tags `OR`ed together.
 *
 * @param postTags An array of post tags for which to retrieve a contact filter.
 * @param mailjet The Mailjet client.
 * @returns The ID of a Mailjet contact filter `OR`ing together the given post tags.
 */
const getContactFilterIdFromPostTags = async (
  postTags: string[],
): Promise<number> => {
  const desiredFilterExpression = getFilterExpressionFromPostTags(postTags);
  const getFiltersRequest: Promise<LibraryResponse<Segmentation.GetContactFilterResponse>> = mailjet
    .get("contactfilter", { version: "v3" })
    .request();
  return getFiltersRequest
    .then((result) => {
      const preExistingFilters = result.body.Data.filter((contactFilter) => {
        return contactFilter.Expression === desiredFilterExpression;
      });

      if (preExistingFilters.length) {
        return preExistingFilters[0].ID;
      }

      const createFilterRequest: Promise<LibraryResponse<Segmentation.PostContactFilterResponse>> =
        mailjet.post("contactfilter", { version: "v3" }).request({
          Description:
            "Will send only to contacts subscribed to at least one of the following tags: " +
            postTags.join(", "),
          Expression: desiredFilterExpression,
          Name: "Contact Subscribed to One or More of The Following Tags: " + postTags.join(", "),
        });

      return createFilterRequest
        .then((result) => {
          return result.body.Data[0].ID;
        })
        .catch((err) => {
          console.log(err.statusCode);
          return 0;
        });
    })
    .catch((err) => {
      console.log(err.statusCode);
      return 0;
    });
};

/**
 * @param postTags The array of post tags used to create the Mailjet contact-filter expression.
 * @returns A filter expression for Mailjet contact segmentation, using Mailjet syntax.
 */
const getFilterExpressionFromPostTags = (postTags: string[]) => {
  return postTags.reduce((prev, cur, curIdx, arr) => {
    return (
      prev +
      " OR " +
      `Contains(tags_subscribed_to,"${cur}")` +
      (curIdx === arr.length - 1 ? ")" : "")
    );
    // eslint-disable-next-line quotes
  }, '(Contains(tags_subscribed_to, "all")' + (postTags.length ? "" : ")"));
};

/**
 * Update the New-Post-Notification Campaign's segmentation to reflect the new post's tags.
 *
 * @param contactFilterId The ID of the segment we want to apply to the New-Post-Notification
 * Campaign.
 * @param mailjet The Mailjet client.
 */
const applyTagFilterToCampaign = async (contactFilterId: number, mailjet: Client) => {
  const newPostNotificationCampaignId = 11615515;

  const request = mailjet
    .put("campaigndraft", { version: "v3" })
    .id(newPostNotificationCampaignId)
    .request({
      SegmentationID: "" + contactFilterId,
    });
  request
    .then((result) => {
      console.log("Segmentation applied successfully.");
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const getNewPostNotificationEmailContent = (frontmatter: PostFrontmatter) => {
  // TODO: implement function
};

const sendNewPostNotificationCampaign = async (campaignId: number, mailjet: Client) => {
  // TODO: implement function