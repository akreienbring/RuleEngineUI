import { type JSX } from "react";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Checkbox,
} from "@mui/material";
import {
  getNoCompareOperators,
  getStateOperators,
} from "@src/components/utils/operator-utils";
import OperatorSelect from "../general/operator-select";
import TextFieldValue1 from "../general/textfield-value1";
import TextFieldValue2 from "../general/textfield-value2";

interface SimplePropertyItemProps {
  property: Property;
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
}

/**
 * A PropertyItem represents a singele property of the JSON schema.
 * It allows the user to select an operator and a value to compare the property with.
 * @param {PropertyItemProps} props
 * @param {Property} props.property The property object containing current and original values and operators.
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {Function} props.handlePropCheck Called when the checkbox of the property is toggled
 * @param {Function} props.handlePropOperatorChange Called when the operator of the property is changed
 * @param {Function} props.handleValueChange Called when the value of the property is changed
 * @returns {JSX.Element | null}
 */ export default function SimplePropertyItem({
  property,
  bufferKey,
  handlePropCheck,
  handlePropOperatorChange,
  handleValueChange,
}: SimplePropertyItemProps): JSX.Element | null {
  const inputWidth = 400;

  const isNoCompareOperator = getNoCompareOperators().includes(
    property.operators[0],
  );

  const isStateOperator = getStateOperators().includes(property.operators[0]);

  return (
    <Stack
      key={`ST1_${bufferKey}`}
      direction="row"
      sx={{ mt: -2, mb: -2, pt: -2, pb: -2 }}
    >
      <ListItem
        key={`LI_${bufferKey}`}
        dense
        disablePadding
        sx={{
          mt: -12,
          mb: -12,
          width: "fit-content",
        }}
      >
        <ListItemButton
          key={`LIB_${bufferKey}`}
          onClick={() => handlePropCheck(bufferKey)}
        >
          <Checkbox
            key={`CB_${bufferKey}`}
            edge="start"
            checked={
              typeof property.isChecked !== "undefined"
                ? property.isChecked
                : true
            }
            disableRipple
          />
          <ListItemText
            key={`LIT_${bufferKey}`}
            primary={property.key}
            secondary={
              typeof property.enum !== "undefined"
                ? `${property.type} (enum)`
                : property.isConst
                  ? `${property.type} (const)`
                  : `${property.type}`
            }
            sx={{ minWidth: 145 }}
          />
        </ListItemButton>
      </ListItem>
      <Stack
        key={`ST 2_${bufferKey}`}
        direction="row"
        spacing={2}
        sx={{
          width: 650,
          alignItems: "baseline-top",
          justifyContent: "flex-start",
          mb: 1,
          mt: 1,
          visibility: property.isChecked ? "visible" : "hidden",
        }}
      >
        <OperatorSelect
          property={property}
          bufferKey={bufferKey}
          handlePropOperatorChange={handlePropOperatorChange}
        />

        {!isNoCompareOperator && (
          <TextFieldValue1
            property={property}
            bufferKey={bufferKey}
            isPropertySelect={false}
            propertyMenuItems={[]}
            inputWidth={inputWidth}
            handleValueChange={handleValueChange}
          />
        )}

        {(property.operators[0] === "between" || isStateOperator) && (
          <TextFieldValue2
            property={property}
            bufferKey={bufferKey}
            isPropertySelect={false}
            propertyMenuItems={[]}
            inputWidth={inputWidth}
            handleValueChange={handleValueChange}
          />
        )}
      </Stack>
    </Stack>
  );
}
