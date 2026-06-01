import { type JSX } from "react";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Checkbox,
} from "@mui/material";
import { getNoCompareOperators } from "@src/components/utils/operator-utils";
import OperatorSelect from "../general/operator-select";
import TextFieldValue1 from "../general/textfield-value1";
import TextFieldValue2 from "../general/textfield-value2";
import { createUUID } from "../utils/general";

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
export default function SimplePropertyItem({
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

  return (
    <Stack direction="row" sx={{ mt: -2, mb: -2, pt: -2, pb: -2 }}>
      <ListItem
        dense
        disablePadding
        sx={{
          mt: -12,
          mb: -12,
          width: "fit-content",
        }}
      >
        <ListItemButton onClick={() => handlePropCheck(bufferKey)}>
          <Checkbox
            key={createUUID()}
            edge="start"
            checked={
              typeof property.checked !== "undefined" ? property.checked : true
            }
            disableRipple
          />
          <ListItemText
            primary={property.key}
            secondary={property.type}
            sx={{ minWidth: 145 }}
          />
        </ListItemButton>
      </ListItem>
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
            isPropertySelect={false}
            propertyMenuItems={[]}
            inputWidth={inputWidth}
            handleValueChange={handleValueChange}
          />
        )}

        {property.operators[0] === "between" && (
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
