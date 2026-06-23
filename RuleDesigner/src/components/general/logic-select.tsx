/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import {
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
} from "@mui/material";

interface LogicSelectProps {
  operator: Operator;
  handleRuleOperatorChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

/**
 * Component that allows the user to select the logic operator (AND, OR, NOT) for the rule.
 * @param {LogicSelectProps} props
 * @param {Operator} props.operator The currently selected operator
 * @param {Function} props.handleRuleOperatorChange Called when the selected operator is changed
 * @returns {JSX.Element} The LogicSelect component
 */
export default function LogicSelect({
  operator,
  handleRuleOperatorChange,
}: LogicSelectProps): JSX.Element {
  return (
    <FormControl>
      <RadioGroup
        row
        value={operator ? operator : "and"}
        onChange={handleRuleOperatorChange}
      >
        <FormControlLabel
          value="and"
          control={<Radio size="small" />}
          label="AND"
        />
        <FormControlLabel
          value="or"
          control={<Radio size="small" />}
          label="OR"
        />
        <FormControlLabel
          value="not"
          control={<Radio size="small" />}
          label="NOT"
        />
      </RadioGroup>
    </FormControl>
  );
}
