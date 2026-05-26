import { JSX } from "react";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface AddEmptyRuleProps {
  handleAddEmptyRule: (operator: Operator) => void;
}

/**
 * A list with options (and, or, not). Used to add a new rule as a subrule
 * @param {AddEmptyRuleProps} props
 * @param {Function} props.handleAddEmptyRule - Called when an empty rule is added as a subrule
 * @returns
 */
export default function AddEmptyRule({
  handleAddEmptyRule,
}: AddEmptyRuleProps): JSX.Element {
  const options = [
    {
      text: "And",
      value: "and",
      description: "Add an empty 'and: []' rule to the currently selected rule",
    },
    {
      text: "Or",
      value: "or",
      description: "Add an empty 'or: []' rule to the currently selected rule",
    },
    {
      text: "Not",
      value: "not",
      description: "Add an empty 'not: []' rule to the currently selected rule",
    },
  ];

  return (
    <List dense disablePadding sx={{ pt: 0, minWidth: 400 }}>
      {options.map((option, index) => (
        <ListItem disablePadding key={`RuleOption_${index}`}>
          <ListItemButton
            onClick={() => handleAddEmptyRule(option.value as Operator)}
          >
            <ListItemText
              primary={option.text}
              secondary={option.description}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
