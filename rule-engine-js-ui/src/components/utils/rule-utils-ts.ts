/*
  Author: André Kreienbring
  Utilities to work with rules. Implemented in Typescript
  https://github.com/crafts69guy/rule-engine-js/issues/4
  https://gist.github.com/hyusetiawan/0f79794086cb12baf101323e3b44ca8d
*/
import { createUUID } from "@src/components/utils/general";
import { evaluateRule } from "./rule-utils-js";
import { RuleExpression, EvaluationResult } from "rule-engine-js";
import { getStateOperators } from "./operator-utils";

const stateOperators: Operator[] = getStateOperators();

/**
 * Uses a recursion to check if the rule has operators that require the stateful rule engine
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @returns {boolean} true if the rule has at least state operator, false otherwise
 */
export function hasStateOperator(operators: object[]): boolean {
  let result = false;
  const ruleOperators: { operator: Operator; value: RuleExpression[] }[] = [];

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
        if (stateOperators.includes(operatorName as Operator)) {
          result = true;
        }
      }
    });
  });

  ruleOperators.forEach((ruleOperator) => {
    const subOperators = ruleOperator.value;
    //and start the recursion
    result = hasStateOperator(subOperators as object[]);
  });

  return result;
}

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
 * Copies subrules from old operators to new operators. This is needed when properties are changed
 * to maintain the subrules that are contained in the old rule operators.
 * @param {object[]} oldOperators - The list of operators from the old rule (may contain subrules)
 * @param {unknown[]} newOperators - The list of operators for the new rule (without subrules)
 * @returns {unknown[]} The updated list of operators for the new rule (with subrules from the old rule)
 */
export const copySubrules = (
  oldOperators: object[],
  newOperators: unknown[],
): unknown[] => {
  oldOperators.forEach((operator) => {
    Object.keys(operator).forEach((operatorName) => {
      if (operatorName === "subrule") {
        newOperators.push(operator);
      }
    });
  });
  return newOperators;
};

/**
 * Searches a subrule of the top rule by the uuid given to the subrule when it was created. Uses a recursion to achieve this.
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators a rule with subrules
 * @param {string} uuid - The unique Id to search for
 * @returns {RuleSearchResult} An object with
 * - operators, the operators of the found rule
 * - operatorIndex, the index of the found rule in the top rule
 * - subrule, the found subrule
 * or null if the rule was not found
 */
export const findSubrule = (
  operators: object[],
  uuid: string,
): RuleSearchResult | null => {
  let result: RuleSearchResult | null = null;
  operators.forEach((operator, operatorIndex) => {
    Object.entries(operator)
      .filter(([operatorName, operators]) => operatorName === "subrule")
      .forEach(([operatorName, subrule]) => {
        // check the subrule for the given uuid
        if (subrule.uuid === uuid) {
          /*
            operators are the parent operators of the found subrule
            operatorIndex is the index of the found subrule in parent operators list
            This way it can easily be deleeted or updated when the operator of the subrule is changed.
          */
          result = {
            operators,
            operatorIndex,
            subrule,
          };
        } else {
          const foundRule = findSubrule(
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
 * Validates a rule. Before the rule is validated, it is transformed to the format that is compliant with rule-engine-js
 * @async
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {object} obj - The object to test the rule on
 * @param {RuleExpression} rule - The rule (contains subrule objects)
 * @returns {Promise<EvaluationResult>} The result of the test performed by the ruleEngine
 */
export const validateRule = async (
  operator: Operator,
  obj: object,
  rule: RuleExpression,
): Promise<EvaluationResult> => {
  const transformedRule = transformRule(operator, rule);

  return evaluateRule(
    obj,
    transformedRule,
    hasStateOperator(rule[operator] as object[]),
  ).then((testResult) => {
    return testResult;
  });
};
