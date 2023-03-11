import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { userPreferences } from "../../ducks";
import styles from "./ThemeSwitch.module.css";
import tailwindConfig from "../../../tailwind.config";

const colors = tailwindConfig.theme.colors;

const ThemeSwitch: React.FC = () => {
  const useDarkMode = useAppSelector(userPreferences.selectors.getUseDarkMode);
  const dispatch = useAppDispatch();

  const toggleDarkMode = () => {
    dispatch(userPreferences.actions.toggleDarkMode(!useDarkMode));
  };

  return (
    <div onClick={toggleDarkMode}>
      <DarkModeSwitch
        checked={useDarkMode}
        onChange={(checked) => {
          return;
        }}
        className={styles.switch}
        size={28}
        moonColor={colors["secondary-dark"]}
      />
    </div>
  );
};

export default ThemeSwitch;
