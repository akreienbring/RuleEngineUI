/*
  Author: André Kreienbring
  The Textfield that is uses to enter the value2 (operater = beetween) of a property.
*/
import { type JSX } from "react";
import { MenuItem, TextField } from "@mui/material";
import { createUUID } from "../utils/general";

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
  /*
    Determine if the textfield should be a select input and what the menu items should be. 
    The value of the textfield is determined by the value1 of the property 
  */
  const menueItems: JSX.Element[] = [];
  let selectValue: any = property.value2;

  if (property.type === "boolean") {
    menueItems.push(
      <MenuItem key={`MI2_true_${bufferKey}`} value={true as any}>
        true
      </MenuItem>,
    );
    menueItems.push(
      <MenuItem key={`MI2_false_${bufferKey}`} value={false as any}>
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
        <MenuItem key={`MI2_${index}_${bufferKey}`} value={bufferKey}>
          {bufferKey}
        </MenuItem>
      )),
    );
  }

  return (
    <TextField
      key={`TF2_${bufferKey}`}
      error={typeof property?.value2Error !== "undefined"}
      label={
        typeof property?.value2Error !== "undefined" ? property.value2Error : ""
      }
      required
      size="small"
      variant="filled"
      select={menueItems.length > 0}
      value={selectValue}
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
        width: inputWidth,
      }}
    >
      {menueItems.length > 0 ? menueItems : null}
    </TextField>
  );
}
