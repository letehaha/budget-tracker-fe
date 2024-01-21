import { ref } from "vue";

const THEME_LS_KEY = "preferred-theme";

export enum Themes {
  dark = "dark",
  light = "light",
}

export const currentTheme = ref<Themes>(Themes.dark);

export const setTheme = (theme: Themes, save = false) => {
  currentTheme.value = theme;
  document.body.classList.remove(Themes.dark);
  document.body.classList.remove(Themes.light);
  document.body.classList.add(theme);

  if (save) localStorage.setItem(THEME_LS_KEY, theme);
};

export const toggleTheme = () => {
  setTheme(
    currentTheme.value === Themes.dark ? Themes.light : Themes.dark,
    true,
  );
};

export const identifyCurrentTheme = () => {
  const preferredTheme = localStorage.getItem(THEME_LS_KEY) as Themes;

  if (Object.values(Themes).includes(preferredTheme)) {
    setTheme(preferredTheme);
  } else {
    const matched = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(matched ? Themes.dark : Themes.light);
  }
};
