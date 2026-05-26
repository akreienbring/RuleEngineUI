/*
  Author: André Kreienbring
*/

import { useState, type JSX } from "react";
import { getNoCompareOperators } from "@src/components/utils/operator-utils";
import PropertyToolbar from "./property-toolbar";
import OperatorSelect from "../general/operator-select";
import TextFieldValue1 from "../general/textfield-value1";
import TextFieldValue2 from "../general/textfield-value2";
import {
  ListItem,
  MenuItem,
  Box,
  Chip,
  TextField,
  Stack,
  Checkbox,
  ListItemText,
  ListItemButton,
} from "@mui/material";

interface PropertyItemProps {
  isExpanded: boolean;
  level: number;
  propName: string;
  properties: PropertyBuffer;
  bufferKey: string;
  handlePropCheck: (bufferKey: string) => void;
  handlePropOperatorChange: (bufferKey: string, value: any) => void;
  handleValueChange: (
    bufferKey: string,
    value: string,
    second: boolean,
    isPropertySelect: boolean,
    path: string,
  ) => void;
  handleResetProperty: (bufferKey: string) => void;
  handleAddOperator: (bufferKey: string) => void;
  handleDeleteOperator: (bufferKey: string, index: number) => void;
  handleSelectOperator: (bufferKey: string, index: number) => void;
}

/**
 * A PropertyItem represents a singele property of the JSON schema.
 * It allows the user to select an operator and a value to compare the property with.
 * @param {PropertyItemProps} props
 * @param {boolean} props.isExpanded If true all subproperties of the property are shown, otherwise they are hidden
 * @param {number} props.level The level of the property in the schema (determines indentation)
 * @param {PropertyBuffer} props.properties The (object) buffer containing the properties of the JSON schema
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {Function} props.handlePropCheck Called when the checkbox of the property is toggled
 * @param {Function} props.handlePropOperatorChange Called when the operator of the property is changed
 * @param {Function} props.handleValueChange Called when the value of the property is changed
 * @param {Function} props.handleResetProperty Called when the property must be reset to its original state
 * @param {Function} props.handleAddOperator Called when the user wants to add an additional operator to the property
 * @param {Function} props.handleDeleteOperator Called when the user wants to delete an operator from the property
 * @param {Function} props.handleSelectOperator Called when the user wants to select an operator of the property
 * @returns {JSX.Element | null}
 */
export default function PropertyItem({
  isExpanded,
  level,
  properties,
  bufferKey,
  handlePropCheck,
  handlePropOperatorChange,
  handleValueChange,
  handleResetProperty,
  handleAddOperator,
  handleDeleteOperator,
  handleSelectOperator,
}: PropertyItemProps): JSX.Element | null {
  const [isPropertySelect, setIsPropertySelect] = useState(false);
  const property: Property = properties[bufferKey];

  //during the first render propery can be undefined!
  if (typeof property === "undefined") return null;

  const indent = 3;
  const itemMinWidth = 250;
  const inputWidth = 400;
  const isNoCompareOperator = getNoCompareOperators().includes(
    property.operators[0],
  );

  /**
   * Create a list of properties that can be compared with other properties of the same object
   * TODO: Offer all properties or only those with the same type?
   * const propertyMenuItems = Object.keys(properties);
   */
  const propertyMenuItems = Object.entries(properties)
    .filter(
      ([bufferKey, prop]) =>
        property.type === prop.type || prop.type === "array",
    )
    .map(([bufferKey, prop]) => bufferKey);

  /**
   * Object properties can either be compared with a value or with another property.
   * This function toggles between these two options.
   * @param {boolean} isPropertySelect If true, the user wants to compare with another property, otherwise with a input value
   */
  const handlePropertySelection = (isPropertySelect: boolean) => {
    if (isPropertySelect) {
      property.value1 = bufferKey;
      property.value2 = bufferKey;
    } else {
      property.value1 = property.origValue1;
      property.value2 = property.origValue1;
    }
    setIsPropertySelect(isPropertySelect);
  };

  return (
    <Stack direction="row" sx={{ m: -1, pl: -1 }}>
      <ListItem
        disablePadding
        sx={{
          display: isExpanded ? "block" : "none",
          pl: level * indent,
          minWidth: itemMinWidth - level * indent,
          width: "fit-content",
        }}
      >
        <ListItemButton onClick={() => handlePropCheck(bufferKey)}>
          <Checkbox
            edge="start"
            checked={
              typeof property.checked !== "undefined" ? property.checked : true
            }
            disableRipple
          />
          <ListItemText
            primary={property.key}
            secondary={property.type}
            sx={{ minWidth: 100 }}
          />
        </ListItemButton>
      </ListItem>
      <Box sx={[isExpanded ? { display: "block" } : { display: "none" }]}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: 650,
            alignItems: "baseline-top",
            justifyContent: "flex-start",
            mb: 1,
            mt: 1,
            visibility: property.checked ? "visible" : "hidden",
          }}
        >
          <OperatorSelect
            property={property}
            bufferKey={bufferKey}
            handlePropOperatorChange={handlePropOperatorChange}
          />

          {!isNoCompareOperator && property?.checked && (
            <TextFieldValue1
              property={property}
              bufferKey={bufferKey}
              isPropertySelect={isPropertySelect}
              propertyMenuItems={propertyMenuItems}
              inputWidth={inputWidth}
              handleValueChange={handleValueChange}
            />
          )}

          {property.operators[0] === "between" && (
            <TextFieldValue2
              property={property}
              bufferKey={bufferKey}
              isPropertySelect={isPropertySelect}
              propertyMenuItems={propertyMenuItems}
              inputWidth={inputWidth}
              handleValueChange={handleValueChange}
            />
          )}
          <PropertyToolbar
            key={`PT_Property_Toolbar_${property.key}`}
            property={property}
            bufferKey={bufferKey}
            isPropertySelect={isPropertySelect}
            isNoCompareOperator={isNoCompareOperator}
            handleResetProperty={handleResetProperty}
            handlePropertySelection={handlePropertySelection}
            handleAddOperator={handleAddOperator}
            handleDeleteOperator={handleDeleteOperator}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "baseline-top",
            justifyContent: "flex-start",
            mr: 2,
            mb: 1,
            mt: 1,
            visibility: property.checked ? "visible" : "hidden",
          }}
        >
          {property.operators.map((operator, operatorIndex) => {
            if (operatorIndex > 0)
              return (
                <Chip
                  key={`CH_Property_Toolbar_${operatorIndex}`}
                  onDelete={() =>
                    handleDeleteOperator(bufferKey, operatorIndex)
                  }
                  onClick={() => handleSelectOperator(bufferKey, operatorIndex)}
                  sx={{
                    height: 25,
                    width: "fit-content",
                    "& .MuiChip-label": { fontSize: "1em" },
                    mt: 1,
                  }}
                  label={operator}
                />
              );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
