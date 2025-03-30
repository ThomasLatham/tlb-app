import jwt from "jsonwebtoken";

const intersection = <T>(arr1: T[], arr2: T[]): Array<T> => {
  return arr1.filter((x) => arr2.includes(x));
};

const getBasePath = (customBasePath?: string): string => {
  const env = process.env.NODE_ENV;
  if (env == "development") {
    return "http://localhost:3000";
  } else if (env == "production") {
    return "https://tomlatham.blog";
  } else {
    return customBasePath ?? "";
  }
};

const getToken = (recipientUserId: string) => {
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
  return token;
};

export { intersection, getBasePath, getToken };
