import { type JSX } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { DataObject, ExpandLess, ExpandMore } from "@mui/icons-material";

interface ObjectItemProps {
  level: number;
  indent: number;
  path: string;
  isExpanded: boolean;
  handleExpandObject: (level: number) => void;
}

export default function ObjectItem({
  level,
  indent,
  path,
  isExpanded,
  handleExpandObject,
}: ObjectItemProps): JSX.Element {
  return (
    <ListItem
      key={`LI1_${level}`}
      sx={{
        pl: level * indent,
        mb: 0.5,
        width: "fit-content",
      }}
    >
      <ListItemButton onClick={() => handleExpandObject(level)}>
        <ListItemIcon sx={{ ml: -1.3 }}>
          <DataObject />
        </ListItemIcon>
        <ListItemText
          primary={path.substring(path.lastIndexOf(".") + 1, path.length)}
        />
        {level > 0 && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
    </ListItem>
  );
}
