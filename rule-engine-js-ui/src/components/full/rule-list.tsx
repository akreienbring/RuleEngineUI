/*
  Author: André Kreienbring
  Concept:
  A rule consists of a top operator (and, or, not) with operators (eg. eq, neq...) and subrules (again: and, or, not)

*/
import { type JSX, useState } from "react";
import type { ArchivedRule, InputSchema } from "@src/components/types/public";
import { RuleExpression } from "rule-engine-js";
import { List, ListItem, ListItemText } from "@mui/material";
import RuleListToolbar from "./rule-list-toolbar";
import { createUUID } from "../utils/general";

interface RuleListProps {
  topRule: RuleExpression;
  topOperator: Operator;
  selectedRule: RuleIndex;
  isTestValid: boolean;
  uuid: string;
  archivedRules: ArchivedRule[];
  schemas: InputSchema[];
  schemaId: number;
  schemaName: string;
  handleSelectedRuleChange: (selectedRule: RuleIndex) => void;
  handleAddRule: (
    operator: Operator,
    rule: RuleExpression,
    uuid: string,
  ) => void;
  handleDeleteRule: (uuid: string) => void;
}

/**
 *
 * @param {RuleListProps} props
 * @param {RuleExpression} props.topRule - The rule that contains all the other operators and subrules
 * @param {Operator} props.topOperator - The operator of the top rule (and, or, not)
 * @param {RuleIndex} props.selectedRule - The currently selected rule. Contains the uuid of the rule and its operator
 * @param {boolean} props.isTestValid - Indicates if the given test object, tested againgst the top rule, is valid
 * @param {string} props.uuid - Used to identify a rule (and, or, not) in the list
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {InputSchema[]} props.schemas - A list of schemas.
 * @param {number} props.schemaId - The id of the currently selected schema
 * @param {string} [props.schemaName] - If given, the name of the schema of the rule
 * @param {Function} props.handleSelectedRuleChange - Called when the user clicks on a rule in the list to make it the currently selected rule
 * @param {Function} props.handleAddRule - Used to add a subrule to an existing rule
 * @param {Function} props.handleDeleteRule - Used to delete a subrule from an existing rule
 * @returns {JSX.Element} A Hirarchy of all Elements of the rule with possible actions to perform.
 */
export default function RuleList({
  topRule,
  topOperator,
  selectedRule,
  isTestValid,
  uuid,
  archivedRules,
  schemas,
  schemaId,
  schemaName,
  handleSelectedRuleChange,
  handleAddRule,
  handleDeleteRule,
}: RuleListProps): JSX.Element {
  const [expandedObjects, setExpandedObjects] = useState<boolean[]>([]);
  const createdExpanded: boolean[] = [];
  const elements: JSX.Element[] = [];
  let ruleIndex = 0;

  /**
   * Expands / Collapses a Rule level
   * @param {number} level
   */
  const handleExpandObject = (level: number) => {
    let newExpanded = [...expandedObjects];
    if (newExpanded.length === 0) newExpanded = createdExpanded;
    const levelStatus = newExpanded[level];
    for (let i = level; i < newExpanded.length; i++) {
      newExpanded[i] = !levelStatus;
    }
    setExpandedObjects(newExpanded);
  };

  /**
   * A function that is (recursively) called to create the rule list items.
   * It fills the 'elements' array with items.
   * @param {object[]} operators - An Array that contains RuleExpressions (eg. {eq: [name, "David"]}) and subrules.
   * @param {string} path - Is build during the recursion and can be something like "and.or.not" CURRENTLY UNUSED
   * @param {number} ruleLevel - Is indicating the level of recursion. Also used for the indication of a rule in the list.
   * @param {Operator} operatorName - the name of an operator (and, or, not, eq, neq...)
   * @param {boolean} isValid - Indicates if the current rule (and, or, not) was tested against the test object successfully or not
   * @param {string} uuid - The uuid of the rule. Can also be empty ("") if the rule is the top rule.
   * @returns
   */
  const createList = (
    operators: object[],
    path: string,
    ruleLevel: number,
    operatorName: Operator,
    isValid: boolean,
    uuid: string,
  ) => {
    createdExpanded.push(true);

    const isExpanded =
      typeof expandedObjects[ruleLevel] === "boolean"
        ? expandedObjects[ruleLevel]
        : true;

    const subOperators: {
      operators: object[];
      path: string;
      operatorName: Operator;
      isValid: boolean;
      uuid: string;
    }[] = [];

    elements.push(
      <ListItem
        key={createUUID()}
        sx={{
          p: 0,
          m: 0,
          height: "fit-content",
          border: 2,
          borderColor: isValid ? "success.light" : "error.light",
          bgcolor:
            selectedRule.uuid === uuid ||
            (ruleLevel === 0 && !selectedRule.uuid)
              ? "primary.light"
              : isValid
                ? "success.light"
                : "error.light",
        }}
      >
        <RuleListToolbar
          ruleLevel={ruleLevel}
          uuid={uuid}
          isExpanded={isExpanded}
          operatorName={operatorName}
          archivedRules={archivedRules}
          schemas={schemas}
          schemaId={schemaId}
          schemaName={schemaName}
          handleSelectedRuleChange={handleSelectedRuleChange}
          handleAddRule={handleAddRule}
          handleDeleteRule={handleDeleteRule}
          handleExpandObject={handleExpandObject}
        />
      </ListItem>,
    );

    operators.forEach((operator) => {
      Object.entries(operator).forEach(([operatorName, operators]) => {
        if (operatorName !== "subrule") {
          let secondary = operators[0];
          if (operators[1] === "") {
            secondary = secondary + ': ""';
          } else if (typeof operators[1] !== "undefined") {
            secondary =
              secondary +
              `: ${operators[1].toString().length > 10 ? operators[1].toString().substring(0, 10) + "..." : operators[1]}`;
          }
          elements.push(
            <ListItem
              key={createUUID()}
              disablePadding
              sx={{
                display: isExpanded ? "block" : "none",
                width: "fit-content",
                height: "fin-content",
                p: -1,
                mt: -1,
              }}
            >
              <ListItemText
                key={createUUID()}
                primary={operatorName}
                secondary={secondary}
                sx={{ minWidth: 100, pl: ruleLevel }}
              />
            </ListItem>,
          );
        } else {
          // at this point operators is a subrule object, so we need to save it for the next recursion step
          const newPath = !path
            ? operators.operator
            : `${path}.${operators.operator}`;
          const newOperators = operators.rule[operators.operator] as object[];
          subOperators.push({
            operators: newOperators,
            path: newPath,
            operatorName: operators.operator,
            isValid: operators.isValid,
            uuid: operators.uuid,
          });
        }
      });
    }); // forEach level operator}
    ruleIndex++;

    // recursion for every sub object in this level
    subOperators.forEach((subOperator) => {
      elements.push(
        <List component="div" key={createUUID()} dense disablePadding>
          {createList(
            subOperator.operators,
            subOperator.path,
            ruleLevel + 1,
            subOperator.operatorName,
            subOperator.isValid,
            subOperator.uuid,
          )}
        </List>,
      );
    });

    return null;
  }; // createList

  if (topRule && topRule[topOperator]) {
    createList(
      topRule[topOperator] as object[],
      topOperator,
      0,
      topOperator,
      isTestValid,
      uuid,
    );
  }

  return (
    <List dense disablePadding>
      {elements}
    </List>
  );
}
