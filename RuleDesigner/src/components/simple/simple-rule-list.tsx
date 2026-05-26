/*
  Author: André Kreienbring
*/
import { type JSX, useState } from "react";
import { RuleExpression } from "rule-engine-js";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { AccountTreeRounded } from "@mui/icons-material";
import { createUUID } from "../utils/general";

interface SimpleRuleList {
  topRule: RuleExpression;
  topOperator: Operator;
}

/**
 * Creates a visual presentation of the rule.
 * @param {RuleListProps} props
 * @param {RuleExpression} props.topRule - The rule that contains all the other operators and subrules
 * @param {Operator} props.topOperator - The operator of the top rule (and, or, not)
 * @returns {JSX.Element} A Hirarchy of all Elements of the rule.
 */
export default function SimpleRuleList({
  topRule,
  topOperator,
}: SimpleRuleList): JSX.Element {
  const elements: JSX.Element[] = [];
  let ruleIndex = 0;

  /**
   * The simple rule interface does currently not create subrules. The recursion is left here for displaying
   * rules created with the more complex interface.
   * A function that is (recursively) called to create the rule list items.
   * It fills the 'elements' array with items.
   * @param {object[]} operators - An Array that contains RuleExpressions (eg. {eq: [name, "David"]}) and subrules.
   * @param {string} path - Is build during the recursion and can be something like "and.or.not" CURRENTLY UNUSED
   * @param {number} ruleLevel - Is indicating the level of recursion. Also used for the indication of a rule in the list.
   * @param {Operator} operatorName - the name of an operator (and, or, not, eq, neq...)
   * @returns
   */
  const createList = (
    operators: object[],
    path: string,
    ruleLevel: number,
    operatorName: Operator,
  ) => {
    const subOperators: {
      operators: object[];
      path: string;
      operatorName: Operator;
    }[] = [];

    elements.push(
      <ListItem
        key={createUUID()}
        sx={{
          p: 0,
          m: 0,
          height: "fit-content",
        }}
      >
        <ListItemIcon sx={{ pl: ruleLevel }}>
          <AccountTreeRounded />
        </ListItemIcon>
        <ListItemText primary={operatorName} sx={{ pl: ruleLevel }} />
      </ListItem>,
    );

    operators.forEach((operator, index) => {
      Object.entries(operator).forEach(([operatorName, operators], index) => {
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
          )}
        </List>,
      );
    });

    return null;
  }; // createList

  if (topRule && topRule[topOperator]) {
    createList(topRule[topOperator] as object[], topOperator, 0, topOperator);
  }

  return <List>{elements}</List>;
}
