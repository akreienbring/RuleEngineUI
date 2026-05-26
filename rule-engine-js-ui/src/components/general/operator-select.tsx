/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import { TextField, MenuItem } from "@mui/material";
import { getOperators } from "@src/components/utils/operator-utils";

interface OperatorSelectProps {
  property: Property;
  bufferKey: string;
  handlePropOperatorChange: (bufferKey: string, operator: Operator) => void;
}
/**
 * Allows to select an operator from a list (e.g. eq, neq...)
 * @param {OperatorSelectProps} props
 * @param {Propery} props.property - The property to select an operator for
 * @param {string} props.bufferKey - The key of the property in the PropertyBuffer
 * @param {Function} props.handlePropOperatorChange - called when the operator for the property was changed
 * @returns {JSX.Element} A compoonent that allows selecting an operator
 */
export default function OperatorSelect({
  property,
  bufferKey,
  handlePropOperatorChange,
}: OperatorSelectProps): JSX.Element {
  return (
    <TextField
      size="small"
      variant="filled"
      select
      value={property.operators[0]}
      name="operator"
      onChange={(event) =>
        handlePropOperatorChange(bufferKey, event.target.value as Operator)
      }
      sx={{ width: 130 }}
    >
      {getOperators(property.type).map((operator, index) => (
        <MenuItem key={`MI_${operator}_${index}`} value={operator}>
          {operator}
        </MenuItem>
      ))}
    </TextField>
  );
}
