/*
  Author: André Kreienbring
  Utilities to work with rules. Implemented in Typescript
  https://github.com/crafts69guy/rule-engine-js/issues/4
  https://gist.github.com/hyusetiawan/0f79794086cb12baf101323e3b44ca8d
*/
import { createUUID, deepCopy } from "@src/components/utils/general";
import { evaluateRule } from "./rule-utils-js";

import {
  createRuleHelpers,
  createRuleEngine,
  RuleExpression,
  EvaluationResult,
} from "rule-engine-js";

const ruleEngine = createRuleEngine();
const ruleHelpers = createRuleHelpers();

/**
 * Uses a recursion to transform the rule-engine.js presentation of a rule to the internal format by inserting subrules
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @param {RuleExpression[]} result - An array to build the resulting rule without subrole keys
 * @returns {RuleExpression[]} An object usable for the internal presentation of a rule
 */
export const restoreSubrules = (
  operators: object[],
  result: any[],
): object[] => {
  const ruleOperators: { operator: Operator; value: RuleExpression[] }[] = [];

  operators.forEach((operator, operatorIndex) => {
    Object.entries(operator).forEach(([operatorName, value]) => {
      if (
        operatorName === "and" ||
        operatorName === "or" ||
        operatorName === "not"
      ) {
        //value is an array with all the operators of the rule
        ruleOperators.push({ operator: operatorName, value });
      } else {
        //operator !== and, or, not. Push to result
        result.push(operator as RuleExpression);
      }
    });
  });

  ruleOperators.forEach((ruleOperator) => {
    const subrule: Subrule = {
      uuid: createUUID(),
      operator: ruleOperator.operator,
      isValid: false,
      rule: { [ruleOperator.operator]: [] },
    };
    //push the subrule to the result
    result.push({ ["subrule"]: subrule });

    const subOperators = ruleOperator.value;
    //and start the recursion which will fill the operator array of the subrule
    //result = result.concat(
    restoreSubrules(
      subOperators as object[],
      subrule.rule[ruleOperator.operator],
    );
    //);
  });

  return result as RuleExpression[];
};

/**
 * Uses a recursion to transform the internal presentation of a rule (e.g. and:[eq: [prop, value]], subrule) to the format usable by the rule engine
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @param {RuleExpression[]} result - An array to build the resulting rule without subrole keys
 * @returns {RuleExpression[]} An object usable by the rule engine
 */
export const replaceSubrules = (
  operators: object[],
  result: RuleExpression[],
): RuleExpression[] => {
  const subrules: Subrule[] = [];

  operators.forEach((operator, operatorIndex) => {
    Object.entries(operator).forEach(([operatorName, value]) => {
      if (operatorName === "subrule") {
        subrules.push(value);
      } else {
        //operator !== subrule. Push to result
        result.push(operator as RuleExpression);
      }
    });
  });

  subrules.forEach((subrule) => {
    const subOperators = subrule.rule[subrule.operator] as object[];
    const subOperator = { [subrule.operator]: [] };
    //push the subrule with an empty rule array to the result
    result.push(subOperator);

    //and start the recursion which will fill subrule array
    //result = result.concat(
    replaceSubrules(subOperators, subOperator[subrule.operator]);
    //);
  });

  return result as RuleExpression[];
};

/**
 * Searches a subrule of the top rule by the uuid given to the subrule when it was created. Uses a recursion to achiev this.
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators a rule with subrules
 * @param {string} uuid - The unique Id to search for
 * @returns {RuleSearchResult} An object with information about the found rule or null if the rule was not found
 */
export const findRule = (
  operators: object[],
  uuid: string,
): RuleSearchResult | null => {
  let result: RuleSearchResult | null = null;
  operators.forEach((operator, operatorIndex) => {
    Object.entries(operator)
      .filter(([operatorName, operators]) => operatorName === "subrule")
      .forEach(([operatorName, subrule], index) => {
        // check the subrule for the given uuid
        if (subrule.uuid === uuid) {
          result = { operators, operatorIndex, subrule: subrule };
        } else {
          const foundRule = findRule(
            subrule.rule[subrule.operator] as object[],
            uuid,
          );
          if (foundRule) {
            result = foundRule;
          }
        }
      });
  }); // forEach level operator}

  return result;
};

/**
 * Transforms the internal representation (with subrules) of a rule to the format that is testable by the ruleEngine.
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {RuleExpression} rule - The rule (contains subrule objects)
 * @returns {RuleExpression} The transformed rule (does NOT contain subrule objects)
 */
export const transformRule = (
  operator: Operator,
  rule: RuleExpression,
): RuleExpression => {
  const operators = replaceSubrules(rule[operator] as object[], []);

  const transformedRule = {
    [operator]: operators,
  };

  return transformedRule;
};

/**
 * Transforms the internal representation (with subrules) of a rule to the format that is testable by the ruleEngine
 * and evaluates it.
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {object} obj - The object to test the rule on
 * @param {RuleExpression} rule - The rule (contains subrule objects)
 * @returns {EvaluationResult} The result of the test performed by the ruleEngine
 */
export const validateRule = (
  operator: Operator,
  obj: object,
  rule: RuleExpression,
): EvaluationResult => {
  const transformedRule = transformRule(operator, rule);
  const testResult = evaluateRule(obj, transformedRule);
  return testResult;
};
