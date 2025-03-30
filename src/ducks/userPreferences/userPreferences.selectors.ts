/* eslint-disable import/no-anonymous-default-export */
import { pathOr } from "ramda";

import { namespace } from "./userPreferences.slice";

const getUseDarkMode = (state: any) => {
  return pathOr(false, [namespace, "useDarkMode"], state);
};

export default {
  getUseDarkMode,
};
