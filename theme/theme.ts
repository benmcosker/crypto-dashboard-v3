import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: { colorSchemeSelector: "class" },
  typography: {
    fontFamily: "var(--font-geist-sans), Roboto, Arial, sans-serif",
  },
});

export default theme;
