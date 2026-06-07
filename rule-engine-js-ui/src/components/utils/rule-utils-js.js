/*
  Author: André Kreienbring
  Currently these utilities are implemented in Javascript.
  The reason is that the interface EvaluationContext, which represents an object, 
  apperantly can not be generated dynamically in Typescript
  Any help with this is apreciated!
*/

import { createRuleEngine, StatefulRuleEngine } from "rule-engine-js";
import { getNoCompareOperators } from "@src/components/utils/operator-utils";

const ruleEngine = createRuleEngine();
const statefulRuleEngine = new StatefulRuleEngine(ruleEngine);

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
 * Test the rule against the given object.
 * TODO: achieve the same in Typescript
 * @async
 * @param {object} obj - the object to test
 * @param {RuleExpression} rule - the rule used to evaluate the object
 * @param {boolean} isStatfulRule - If true the rule contains at least one stateful operator
 * @returns {Promise<EvaluationResult>} The result with information about the evaluation (e.g. success, error...)
 */
export const evaluateRule = async (obj, rule, isStatfulRule) => {
  if (isStatfulRule) {
    return statefulRuleEngine.evaluate("topRule", rule, obj).then((result) => {
      console.log(`Stateful engine returned: ${JSON.stringify(result)}`);
      return result;
    });
  } else {
    const result = ruleEngine.evaluateExpr(rule, obj);
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
