/*
  Author: André Kreienbring
  Currently these utilities are implemented in Javascript.
  The reason is that the interface EvaluationContext, which represents an object, 
  apperantly can not be generated dynamically in Typescript
  Any help with this is apreciated!
*/

import { createRuleEngine, StatefulRuleEngine } from "rule-engine-js";
import {
  getNoCompareOperators,
  getStateOperators,
} from "@src/components/utils/operator-utils";

const ruleEngine = createRuleEngine();
const statefulRuleEngine = new StatefulRuleEngine(ruleEngine);
const stateOperators = getStateOperators();

/**
 * Builds a NEW rule based on the (JSON schema) properties in the property buffer.
 * For each checked property an operator (e.g. eq, neq..) is generated and inserted in the rule
 * TODO: achieve the same in Typescript
 * @param {PropertyBuffer} properties - holds information of the properties
 * @param {Operator} operator - the operator used to build the rule (and, or, not)
 * @returns {RuleExpression} The renerated Rule
 */
export const buildRule = (properties, operator) => {
  const newRule = { [operator]: [] };

  Object.entries(properties).forEach(([key, property]) => {
    if (property.isChecked) {
      property.operators.forEach((op) => {
        const isNoCompareOperator = getNoCompareOperators().includes(op);

        if (op === "exists") {
          //convenience for 'not undefined'???
          newRule[operator].push({
            ["isNotNull"]: [key],
          });
          newRule[operator].push({
            ["neq"]: [key, ""],
          });
          //TODO: Does this make sense?
          newRule[operator].push({
            ["neq"]: [key, false],
          });
        } else if (op === "isNotEmpty" || op === "isEmpty") {
          //convenience for a comparison with ""
          newRule[operator].push({
            [op === "isNotEmpty" ? "neq" : "eq"]: [key, ""],
          });
        } else if (op === "isTrue" || op === "isFalse") {
          //conveniece for a comparison with true / false
          newRule[operator].push({
            ["eq"]: [key, op === "isTrue"],
          });
        } else if (isNoCompareOperator && op !== "between") {
          //check key, eg isNull
          newRule[operator].push({
            [op]: [key],
          });
        } else if (op !== "between") {
          //comparison
          newRule[operator].push({
            [op]: [key, property.value1],
          });
        } else {
          //between
          newRule[operator].push({
            [op]: [key, [property.value1, property.value2]],
          });
        }
      });
    }
  });

  return newRule;
};

/**
 * Uses a recursion to check if the rule has operators that require the stateful rule engine
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @returns {boolean} true if the rule has at least state operator, false otherwise
 */
export function hasStateOperator(operators) {
  let result = false;
  const ruleOperators = [];

  operators.forEach((operator) => {
    Object.entries(operator).forEach(([operatorName, value]) => {
      if (
        operatorName === "and" ||
        operatorName === "or" ||
        operatorName === "not"
      ) {
        //value is an array with all the (sub) operators of the rule
        ruleOperators.push({ operator: operatorName, value });
      } else {
        //operator !== and, or, not. Push to result
        if (stateOperators.includes(operatorName)) {
          result = true;
        }
      }
    });
  });

  ruleOperators.forEach((ruleOperator) => {
    const subOperators = ruleOperator.value;
    //and start the recursion
    result = hasStateOperator(subOperators);
  });

  return result;
}

/**
 * Test the rule against the given object.
 * TODO: achieve the same in Typescript
 * @async
 * @param {RuleExpression} rule - the rule used to evaluate the object
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {object} testObj - the object to test
 * @param {object} [firstEval] - An object for the first evaluation of a stateful rule. If given, the state of the stateful engine is reset befor the first evaluation
 * @returns {Promise<EvaluationResult>} The result with information about the evaluation (e.g. success, error...)
 */
export const evaluateRule = async (rule, operator, testObj, firstEval) => {
  const isStatefulRule = hasStateOperator(rule[operator]);

  if (isStatefulRule) {
    if (typeof firstEval !== "undefined") {
      statefulRuleEngine.clearState("topRule");
      statefulRuleEngine.evaluate("topRule", rule, firstEval).then((result) => {
        console.log(
          `First evaluation with Stateful Engine returned: ${JSON.stringify(result)}`,
        );
      });
    }

    return statefulRuleEngine
      .evaluate("topRule", rule, testObj)
      .then((result) => {
        console.log(
          `Second evaluation with Stateful Engine returned: ${JSON.stringify(result)}`,
        );
        return result;
      });
  } else {
    const result = ruleEngine.evaluateExpr(rule, testObj);
    return Promise.resolve(result);
  }
};

/**
 * Gets the value of a object property using the given path
 * TODO: achieve the same in Typescript
 * @param {object} obj - the object to get the value from
 * @param {string} path - the path in the object to the value
 * @returns {any | undefined} The property value at the given path if it exists. If not 'undefined' is returned
 */
export const getValueByPath = (obj, path) => {
  const resolvedPath = ruleEngine.resolvePath(obj, path);
  if (typeof resolvedPath === "symbol") {
    return undefined;
  }
  return resolvedPath;
};
