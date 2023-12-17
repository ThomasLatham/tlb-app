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

export { intersection, getBasePath };
