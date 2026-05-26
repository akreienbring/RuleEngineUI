/*
  Author: André Kreienbring
*/
import { type JSX, useState } from "react";
import { RuleExpression } from "rule-engine-js";
import LoadRule from "@src/components/full/dialogs/load-rule";
import SchemaSelect from "@src/components/general/schema-select";
import LogicSelect from "@src/components/general/logic-select";
import { restoreSubrules } from "@src/components/utils/rule-utils-ts";

import { IconButton, Tooltip, Stack } from "@mui/material";
import {
  UndoRounded,
  AccountTreeRounded,
  RttRounded,
  SaveRounded,
  RuleFolderRounded,
} from "@mui/icons-material";

interface CreateRuleToolbarProps {
  schemas: InputSchema[];
  schemaIndex: number;
  operator: Operator;
  isShowRuleText: boolean;
  archivedRules: ArchivedRule[];
  handleSchemaSelect: (schemaIndex: number) => void;
  handleResetAll: () => void;
  handleRuleOperatorChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  toggleShowRuleText: () => void;
  handleSaveToprule: () => void;
  handleLoadRule: (archivedRule: ArchivedRule) => void;
}

/**
 * Implements the possible actions for the manipulation of the top rule (e.g. save, reset, select schema...)
 * @param {CreateRuleToolbarProps} props
 * @param {InputSchema[]} props.schemas - A list of JSON schemas used to build a list of properties for a rule
 * @param {number} props.schemaIndex - The index of the currently selected JSON schema
 * @param {Operator} props.operator - The operator (and, or, not) of the selected rule
 * @param {boelean} props.isShowRuleText - Indicates if the list of rules is presented as JSON or as object
 * @param {Function} props.handleSchemaSelect - Called when a different schema must be used
 * @param {Function} props.handleResetAll - Called when all properties of a rule must be reset to there original values
 * @param {Function} props.handleRuleOperatorChange - Called when the operator (and, or, not) of a rule must be changed
 * @param {Function} props.toggleShowRuleText - Used to toggle the presentation of the rule. (JSON or object)
 * @param {Function} props.handleSaveToprule - Hand over the created rule to the application that is using this component
 * @param {Function} props.handleLoadRule - Called when an rule was selected for loading
 * @returns {JSX.Element} The Toolbar with the possible actions
 */
export default function CreateRuleToolbar({
  schemas,
  schemaIndex,
  operator,
  isShowRuleText,
  archivedRules,
  handleSchemaSelect,
  handleResetAll,
  handleRuleOperatorChange,
  toggleShowRuleText,
  handleSaveToprule,
  handleLoadRule,
}: CreateRuleToolbarProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Open / Close the load rule dialog.
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  /**
   * Closes the load rule dialog and calls the handleLoadRule function to load the selected rule.
   * The rule is restored with all subrules and properties to be able to directly manipulate the loaded rule.
   * @param {ArchivedRule} archivedRule - the archived rule to load
   */
  const handleLoadArchiveRule = (archivedRule: ArchivedRule) => {
    setIsOpen(false);
    const subOperators = restoreSubrules(
      archivedRule.rule[archivedRule.operator] as object[],
      [],
    );
    const loadedRule: RuleExpression = {
      [archivedRule.operator]: subOperators,
    };
    const ruleToLoad: ArchivedRule = {
      ...archivedRule,
      rule: loadedRule,
    };
    handleLoadRule(ruleToLoad);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        border: "1px solid grey",
        borderRadius: 1,
        mt: 2,
        mb: 2,
        p: 2,
      }}
    >
      <Tooltip title={`Save Rule`}>
        <IconButton
          onClick={handleSaveToprule}
          sx={{ p: 0, m: 0, height: "fit-content" }}
        >
          <SaveRounded fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Load Rule">
        <span>
          <IconButton
            onClick={handleOpen}
            disabled={archivedRules.length === 0}
            sx={{ p: 0, m: 0, height: "fit-content" }}
          >
            <RuleFolderRounded fontSize="large" />
          </IconButton>
        </span>
      </Tooltip>

      <SchemaSelect
        schemas={schemas}
        schemaIndex={schemaIndex}
        handleSchemaSelect={handleSchemaSelect}
      />
      <LogicSelect
        operator={operator}
        handleRuleOperatorChange={handleRuleOperatorChange}
      />
      <Tooltip title={`Reset ${schemas[schemaIndex].name}`}>
        <IconButton
          onClick={handleResetAll}
          sx={{ p: 0, m: 0, height: "fit-content" }}
        >
          <UndoRounded fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={isShowRuleText ? "Show Rule as object" : "Show Rule as text"}
      >
        <IconButton
          onClick={toggleShowRuleText}
          sx={{ p: 0, m: 0, height: "fit-content" }}
        >
          {isShowRuleText ? (
            <AccountTreeRounded fontSize="large" />
          ) : (
            <RttRounded fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
      <LoadRule
        isOpen={isOpen}
        onClose={onClose}
        archivedRules={archivedRules}
        handleLoadArchiveRule={handleLoadArchiveRule}
      />
    </Stack>
  );
}
