export type Theme = "light" | "dark";

export const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const setDocumentTheme = (theme: Theme) =>
  document.documentElement.setAttribute("data-theme", theme);
