import { type JSX } from "react";
import Box from "@mui/material/Box";

/**
 * Main Component of the React application
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function Main({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
}
