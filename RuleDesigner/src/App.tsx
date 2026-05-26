import AppLayout from "./layouts/app/app-layout";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles, ThemeProvider, createTheme } from "@mui/material";

/*
  For performance of TextFields, see https://mui.com/material-ui/react-text-field/#performance
*/
const theme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        disableInjectingGlobalStyles: true,
      },
    },
  },
});

export default function ButtonAppBar() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "@keyframes mui-auto-fill": { from: { display: "block" } },
          "@keyframes mui-auto-fill-cancel": { from: { display: "block" } },
        }}
      />
      <AppLayout />
    </ThemeProvider>
  );
}
