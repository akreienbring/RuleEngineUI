import type { JSX } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// ----------------------------------------------------------------------
/**
 * The header display above all other views of the application
 * @returns {JSX.Element}
 */
export default function Header(): JSX.Element {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rule Engine JS UI
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
