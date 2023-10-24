import { Fragment, PropsWithChildren } from "react";

import { useAppSelector } from "@/redux/hooks";
import { userPreferences } from "@/ducks";
import { useThemePreference } from "@/utils/hooks";

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);
  useThemePreference(useDarkMode);
  return <Fragment>{children}</Fragment>;
};

export default ThemeProvider;
