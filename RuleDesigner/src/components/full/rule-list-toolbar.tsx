/*
  Author: André Kreienbring
*/

import { type JSX, useState } from "react";
import { RuleExpression } from "rule-engine-js";
import type { ArchivedRule } from "@src/components/types/public";
import {
  Tooltip,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Stack,
  IconButton,
} from "@mui/material";
import {
  AddRounded,
  ClearRounded,
  AccountTreeRounded,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import AddRule from "@src/components/full/dialogs/add-rule";
import { restoreSubrules } from "@src/components/utils/rule-utils-ts";

interface RuleListToolbarProps {
  uuid: string;
  ruleLevel: number;
  isExpanded: boolean;
  operatorName: Operator;
  archivedRules: ArchivedRule[];
  schemaId: number;
  schemaName: string;
  handleSelectedRuleChange: (selectedRule: RuleIndex) => void;
  handleAddRule: (
    operator: Operator,
    rule: RuleExpression,
    uuid: string,
  ) => void;
  handleDeleteRule: (uuid: string) => void;
  handleExpandObject: (level: number) => void;
}

/**
 * Implements the possible actions for a rule (and, or, not) in the rule list.
 * @param {RuleListToolbarProps} props
 * @param {string} props.uuid - A unique Id to identify the (sub-) rule
 * @param {number} props.ruleLevel - The recursion level. Used to indent the rule in the tree of rules
 * @param {boolean} props.isExpanded - indicates if a rule is currently expanded or collapsed
 * @param {Operator} props.operatorName - (and, or, not) The operator of the rule
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {number} props.schemaId - The id of the currently selected schema
 * @param {string} props.schemaName - The name of the schema of the rule
 * @param {Function} props.handleSelectedRuleChange - Called when the user selects a rule of the list
 * @param {Function} props.handleAddRule - Called when a subrule must be added to an existing rule
 * @param {Function} props.handleDeleteRule - Called when a subrule must be deleted from an existing rule
 * @param {Function} props.handleExpandObject - Called when a rule must be expanded or collapsed
 * @returns {JSX.Element} The toolbar with the possible actions
 */
export default function RuleListToolbar({
  uuid,
  ruleLevel,
  isExpanded,
  operatorName,
  archivedRules,
  schemaId,
  schemaName,
  handleSelectedRuleChange,
  handleAddRule,
  handleDeleteRule,
  handleExpandObject,
}: RuleListToolbarProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Called from the dialog when an empty rule must be added
   * @param {Operator} operator - and, or, not
   */
  const handleAddEmptyRule = (operator: Operator) => {
    setIsOpen(false);
    handleAddRule(operator, { [operator]: [] }, uuid);
  };

  /**
   * Close the load rule dialog and add a rule from the list of archive rules as a subrule
   * Before adding the rule it is converted to the internal rule presentation format (with subrules)
   * @param {RuleExpression} rule The existing rule to add
   * @param {Operator} operator The operator of the rule that will be added
   */
  const handleLoadArchiveRule = (archivedRule: ArchivedRule) => {
    setIsOpen(false);
    const operator = archivedRule.operator;
    const subOperators = restoreSubrules(
      archivedRule.rule[operator] as object[],
      [],
    );
    const subrule: RuleExpression = {
      [operator]: subOperators,
    };
    handleAddRule(operator, subrule, uuid);
  };

  /**
   * Open / Close the add rule dialog.
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Stack direction="row" sx={{ width: 1 }}>
      <ListItemButton
        onClick={() =>
          handleSelectedRuleChange({
            uuid: uuid,
            operator: operatorName,
          })
        }
        sx={{ p: 0, m: 0, pl: ruleLevel }}
      >
        <ListItemIcon>
          <AccountTreeRounded />
        </ListItemIcon>
        <ListItemText primary={operatorName} />
      </ListItemButton>
      <IconButton
        onClick={() => handleExpandObject(ruleLevel)}
        sx={{
          p: 0,
          ml: 0,
          mr: 0,
          height: "fit-content",
        }}
      >
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Tooltip title="Add Rule">
        <IconButton
          onClick={(event) => handleOpen(event)}
          sx={{ p: 0, m: 0, height: "fit-content" }}
        >
          <AddRounded />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Rule">
        <span>
          <IconButton
            onClick={() => handleDeleteRule(uuid)}
            disabled={ruleLevel === 0}
            sx={{ p: 0, ml: 0, mr: 0, height: "fit-content" }}
          >
            <ClearRounded />
          </IconButton>
        </span>
      </Tooltip>
      <AddRule
        isOpen={isOpen}
        onClose={onClose}
        archivedRules={archivedRules}
        schemaId={schemaId}
        schemaName={schemaName}
        handleAddEmptyRule={handleAddEmptyRule}
        handleLoadArchiveRule={handleLoadArchiveRule}
      />
    </Stack>
  );
}
