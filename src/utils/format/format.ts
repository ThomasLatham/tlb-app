import { DateTime } from "luxon";

const formatDateString = (dateString: string) => {
  return DateTime.fromFormat(dateString, "yyyy-MM-dd").toLocaleString({
    ...DateTime.DATE_MED,
    month: "long",
    timeZone: "utc",
  });
};

export { formatDateString };
