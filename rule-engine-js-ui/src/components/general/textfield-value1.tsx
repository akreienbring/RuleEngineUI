/*
  Author: André Kreienbring
  The Textfield that is uses to enter the value1 of a property.
*/
import { type JSX } from "react";
import { MenuItem, TextField } from "@mui/material";
import { createUUID } from "../utils/general";

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
  /*
    Determine if the textfield should be a select input and what the menu items should be. 
    The value of the textfield is determined by the value1 of the property 
  */
  const menueItems: JSX.Element[] = [];
  let selectValue: any = property.value1;

  if (property.type === "boolean") {
    menueItems.push(
      <MenuItem key={`MI1_true_${bufferKey}`} value={true as any}>
        true
      </MenuItem>,
    );
    menueItems.push(
      <MenuItem key={`MI1_false_${bufferKey}`} value={false as any}>
        false
      </MenuItem>,
    );
  } else if (isPropertySelect) {
    /*
      If the property references another property, the possible values are the keys of the properties in the buffer.
      The value of the textfield is the key of the selected property
    */
    selectValue = propertyMenuItems[0];
    menueItems.push(
      ...propertyMenuItems.map((bufferKey, index) => (
        <MenuItem key={`MI1_${index}_${bufferKey}`} value={bufferKey}>
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
    menueItems.push(
      ...enumItems.map((item, index) => (
        <MenuItem key={`MI1_${index}_${bufferKey}`} value={item.value}>
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
    menueItems.push(
      ...enumValues.map((value, index) => (
        <MenuItem key={`MI1_${index}_${bufferKey}`} value={value}>
          {value}
        </MenuItem>
      )),
    );
  }

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
      select={menueItems.length > 0}
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
      {menueItems.length > 0 ? menueItems : null}
    </TextField>
  );
}
