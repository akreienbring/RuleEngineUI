/*
  Author: André Kreienbring
  The Textfield that is uses to enter the value1 of a property.
*/
import { type JSX } from "react";
import { TextField } from "@mui/material";
import { useMenuItems } from "./use-menuitems";

interface TextFieldValue1Props {
  property: Property;
  bufferKey: string;
  isPropertySelect: boolean;
  propertyMenuItems: string[];
  inputWidth: number;
  handleValueChange: (
    bufferKey: string,
    value: string,
    second: boolean,
    isPropertySelect: boolean,
    path: string,
  ) => void;
}

/**
 * Used in the property lists for the input of value1.
 * @param {TextFieldValue1Props} props
 * @param {Property} props.property The property for which the value1 is entered
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {boolean} props.isPropertySelect If true the value is selected from a list of properties, otherwise it is entered in a textfield
 * @param {string[]} props.propertyMenuItems If isPropertySelect is true, the list of properties to select from
 * @param {number} props.inputWidth The width of the input field
 * @param {Function} props.handleValueChange Called when the value of the input field is changed
 * @returns {JSX.Element} The TextField for the value1 of a property
 */
export default function TextFieldValue1({
  property,
  bufferKey,
  isPropertySelect,
  propertyMenuItems,
  inputWidth,
  handleValueChange,
}: TextFieldValue1Props): JSX.Element {
  const { createMenuItems } = useMenuItems();

  const { menuItems, selectValue } = createMenuItems(
    property,
    bufferKey,
    propertyMenuItems,
    isPropertySelect,
    false,
  );

  return (
    <TextField
      key={`TF1_${bufferKey}`}
      disabled={property.isConst}
      error={typeof property?.value1Error !== "undefined"}
      label={
        typeof property?.value1Error !== "undefined" ? property.value1Error : ""
      }
      required={property.type === "number"}
      size="small"
      variant="filled"
      select={menuItems.length > 0}
      value={selectValue}
      name="value1"
      onChange={(event) =>
        handleValueChange(
          bufferKey,
          event.target.value,
          false,
          isPropertySelect,
          event.target.value,
        )
      }
      sx={{
        width: inputWidth,
      }}
    >
      {menuItems.length > 0 ? menuItems : null}
    </TextField>
  );
}
