/*
  Author: André Kreienbring
  This is a custom hook that creates menuitems based on property values.
 */

import { type JSX } from "react";
import { MenuItem } from "@mui/material";

/**
 * A Ract-Hook that is used to create menu items.
 */
export const useMenuItems = () => {
  const createMenuItems = (
    property: Property,
    bufferKey: string,
    propertyMenuItems: string[],
    isPropertySelect: boolean,
    isSecond: boolean,
  ): { menuItems: JSX.Element[]; selectValue: string } => {
    /*
    Determine if the textfield should be a select input and what the menu items should be. 
    The value of the textfield is determined by the value1 of the property 
  */
    const menuItems: JSX.Element[] = [];
    let selectValue: any = isSecond ? property.value2 : property.value1;
    const key = isSecond ? "M2" : "M1";

    if (property.type === "boolean") {
      menuItems.push(
        <MenuItem key={`${key}_true_${bufferKey}`} value={true as any}>
          true
        </MenuItem>,
      );
      menuItems.push(
        <MenuItem key={`${key}_false_${bufferKey}`} value={false as any}>
          false
        </MenuItem>,
      );
    } else if (isPropertySelect) {
      /*
      If the property references another property, the possible values are the keys of the properties in the buffer.
      The value of the textfield is the key of the selected property
    */
      selectValue = propertyMenuItems[0];
      menuItems.push(
        ...propertyMenuItems.map((bufferKey, index) => (
          <MenuItem key={`${key}_${index}_${bufferKey}`} value={bufferKey}>
            {bufferKey}
          </MenuItem>
        )),
      );
    } else if (property.enum && typeof property.enum[0] === "object") {
      // If the enum is an array of objects with name and value, use the name as label and the value as value for the menu item
      const enumItems = property.enum as Array<{
        name: string;
        value: string | number;
      }>;
      menuItems.push(
        ...enumItems.map((item, index) => (
          <MenuItem key={`${key}_${index}_${bufferKey}`} value={item.value}>
            {item.name}
          </MenuItem>
        )),
      );
    } else if (
      property.enum &&
      typeof property.enum[0] !== "object" &&
      typeof property.enum[0] !== "undefined"
    ) {
      /*  If the enum is an array of primitive values, use the value as label and value for the menu item
        The value of the textfield is the first entry in the enum array
    */
      const enumValues = property.enum as Array<string | number>;
      menuItems.push(
        ...enumValues.map((value, index) => (
          <MenuItem key={`${key}_${index}_${bufferKey}`} value={value}>
            {value}
          </MenuItem>
        )),
      );
    }

    return { menuItems, selectValue };
  };

  return { createMenuItems };
};
