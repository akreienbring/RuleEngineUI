import { type JSX } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { DataObject, ExpandLess, ExpandMore } from "@mui/icons-material";
import { createUUID } from "../utils/general";
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
      key={createUUID()}
      sx={{
        pl: level * indent,
        mt: isExpanded ? -2 : 2,
        width: "fit-content",
      }}
    >
      <ListItemButton
        key={createUUID()}
        onClick={() => handleExpandObject(level)}
      >
        <ListItemIcon key={createUUID()} sx={{ ml: -1.3 }}>
          <DataObject />
        </ListItemIcon>
        <ListItemText
          key={createUUID()}
          primary={path.substring(path.lastIndexOf(".") + 1, path.length)}
        />
        {level > 0 && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
    </ListItem>
  );
}
