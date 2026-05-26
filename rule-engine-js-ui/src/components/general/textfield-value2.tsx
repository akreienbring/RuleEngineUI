/*
  Author: André Kreienbring
  The Textfield that is uses to enter the value2 (operater = beetween) of a property.
*/
import { type JSX } from "react";
import { MenuItem, TextField } from "@mui/material";

interface TextFieldValue2Props {
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
 * Used in the property lists when the operator of a property is "between". Allows the user to enter the second value for the comparison.
 * @param {TextFieldValue2Props} props
 * @param {Property} props.property The property for which the value2 is entered (operater = beetween)
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {boolean} props.isPropertySelect If true the value is selected from a list of properties, otherwise it is entered in a textfield
 * @param {string[]} props.propertyMenuItems If isPropertySelect is true, the list of properties to select from
 * @param {number} props.inputWidth The width of the input field(s)
 * @param {Function} props.handleValueChange Called when the value of the input field is changed
 * @returns {JSX.Element} The TextField for the value2 of a property
 */
export default function TextFieldValue2({
  property,
  bufferKey,
  isPropertySelect,
  propertyMenuItems,
  inputWidth,
  handleValueChange,
}: TextFieldValue2Props): JSX.Element {
  return (
    <TextField
      error={typeof property?.value2Error !== "undefined"}
      label={
        typeof property?.value2Error !== "undefined" ? property.value2Error : ""
      }
      required
      size="small"
      variant="filled"
      select={isPropertySelect}
      value={property.value2}
      name="value2"
      onChange={(event) =>
        handleValueChange(
          bufferKey,
          event.target.value,
          true,
          isPropertySelect,
          event.target.value,
        )
      }
      slotProps={{
        htmlInput: {
          maxLength: 20,
        },
      }}
      sx={{
        width: inputWidth / 2 - 8,
      }}
    >
      {propertyMenuItems.map((bufferKey) => (
        <MenuItem key={bufferKey} value={bufferKey}>
          {bufferKey}
        </MenuItem>
      ))}
    </TextField>
  );
}
