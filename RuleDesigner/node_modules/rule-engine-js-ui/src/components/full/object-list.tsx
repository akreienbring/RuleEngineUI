/*
  Author: André Kreienbring
*/
import { type JSX, useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { DataObject } from "@mui/icons-material";

interface ObjectListProps {
  obj: object;
  maxLevel?: number;
}

/**
 * Converts a given object to a MUI list
 * @param {ObjectListProps} props
 * @param {object} props.obj - An object used to validate the created rule with. This helps visually testing the rule while it is created.
 * @param {number} props.maxLevel - If provided, the JSON schema is only analized up to the given
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 */
export default function ObjectList({
  obj,
  maxLevel,
}: ObjectListProps): JSX.Element {
  let elements: JSX.Element[] = [];
  let propCount = -1;

  /**
   * A recursive function that builds the list items for all properties of the given object.
   * @param {object} obj - An object or sub object described by the JSON schema
   * @param {string} path - Is build during the recursion to later identify a property in the property buffer.
   * @param {number} level - The level of recursion. Used to indent properties in the created list
   * @returns null But fills the list of HTML elements with the MUI components.
   */
  const createList = (obj: object, path: string, level: number) => {
    if (typeof maxLevel !== "undefined" && level >= maxLevel) return elements;
    const indent = 3;
    const subObjects: { path: string; propName: string; obj: object }[] = [];

    elements.push(
      <ListItem
        key={`LI1_${level}`}
        sx={{
          pl: level * indent,
          mb: 0.5,
          width: "fit-content",
        }}
      >
        <ListItemIcon sx={{ ml: -1 }}>
          <DataObject />
        </ListItemIcon>
        <ListItemText
          primary={path.substring(path.lastIndexOf(".") + 1, path.length)}
        />
      </ListItem>,
    );
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value !== "object" || Array.isArray(value)) {
        propCount++;

        elements.push(
          <ListItem
            key={`LI_${level}_${propCount}`}
            disablePadding
            sx={{
              pl: level * indent,
              width: "fit-content",
              p: -1,
              mt: -1,
            }}
          >
            <ListItemText primary={key} secondary={value.toString()} />
          </ListItem>,
        );
      } else {
        subObjects.push({ path, propName: key, obj: value });
      }
    }); // forEach level property
    // recursion for every sub object in this level
    subObjects.forEach((subObject) => {
      const newPath = !subObject.path
        ? subObject.propName
        : `${path}.${subObject.propName}`;

      elements = elements.concat(
        <List component="div" key={`L_${propCount}`} dense disablePadding>
          {createList(subObject.obj, newPath, level + 1)}
        </List>,
      );
    });

    return null;
  };

  createList(obj, "", 0);

  return (
    <List dense disablePadding sx={{ pl: 1 }}>
      {elements}
    </List>
  );
}
