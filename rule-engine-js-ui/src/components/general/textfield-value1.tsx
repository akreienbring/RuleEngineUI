/*
  Author: André Kreienbring
  The Textfield that is uses to enter the value1 of a property.
*/
import { type JSX } from "react";
import { MenuItem, TextField } from "@mui/material";

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
 * @param {number} props.inputWidth The width of the input field(s)
 * @param {Function} props.handleValueChange Called when the value of the input field is changed
 * @returns {JSX.Element} The TextField for the value2 of a property
 */
export default function TextFieldValue1({
  property,
  bufferKey,
  isPropertySelect,
  propertyMenuItems,
  inputWidth,
  handleValueChange,
}: TextFieldValue1Props): JSX.Element {
  return (
    <TextField
      error={typeof property?.value1Error !== "undefined"}
      label={
        typeof property?.value1Error !== "undefined" ? property.value1Error : ""
      }
      required={property.type === "number"}
      size="small"
      variant="filled"
      select={property.type === "boolean" || isPropertySelect}
      value={property.value1}
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
        width:
          property.operators[0] === "between" ? inputWidth / 2 - 8 : inputWidth,
      }}
    >
      {!isPropertySelect && property.type === "boolean"
        ? [
            <MenuItem value={true as any}>true</MenuItem>,
            <MenuItem value={false as any}>false</MenuItem>,
          ]
        : propertyMenuItems.map((bufferKey) => (
            <MenuItem key={bufferKey} value={bufferKey}>
              {bufferKey}
            </MenuItem>
          ))}
    </TextField>
  );
}
