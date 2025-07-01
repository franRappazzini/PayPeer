import { ThemeProviderContext } from "../context/theme-provider";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  console.log("pasa");
  console.log(context);

  return context;
};
