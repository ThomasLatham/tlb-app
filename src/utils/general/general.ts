const intersection = <T>(arr1: T[], arr2: T[]): Array<T> => {
  return arr1.filter((x) => arr2.includes(x));
};

export { intersection };
