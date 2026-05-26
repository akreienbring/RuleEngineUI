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

export default function LogicSelect({
  operator,
  handleRuleOperatorChange,
}: LogicSelectProps): JSX.Element {
  return (
    <FormControl>
      <FormLabel
        sx={{ fontSize: 12, mt: 1 }}
      >{`Selected Rule: ${operator}`}</FormLabel>
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
