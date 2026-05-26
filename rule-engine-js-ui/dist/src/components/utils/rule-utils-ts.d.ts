import { RuleExpression, EvaluationResult } from 'rule-engine-js';
/**
 * Uses a recursion to transform the rule-engine.js presentation of a rule to the internal format by inserting subrules
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @param {RuleExpression[]} result - An array to build the resulting rule without subrole keys
 * @returns {RuleExpression[]} An object usable for the internal presentation of a rule
 */
export declare const restoreSubrules: (operators: object[], result: any[]) => object[];
/**
 * Uses a recursion to transform the internal presentation of a rule (e.g. and:[eq: [prop, value]], subrule) to the format usable by the rule engine
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @param {RuleExpression[]} result - An array to build the resulting rule without subrole keys
 * @returns {RuleExpression[]} An object usable by the rule engine
 */
export declare const replaceSubrules: (operators: object[], result: RuleExpression[]) => RuleExpression[];
/**
 * Searches a subrule of the top rule by the uuid given to the subrule when it was created. Uses a recursion to achiev this.
 * TODO: use the type RuleExpression[] instead of object[]
 * @param {object[]} operators - The list of operators a rule with subrules
 * @param {string} uuid - The unique Id to search for
 * @returns {RuleSearchResult} An object with information about the found rule or null if the rule was not found
 */
export declare const findRule: (operators: object[], uuid: string) => RuleSearchResult | null;
/**
 * Transforms the internal representation (with subrules) of a rule to the format that is testable by the ruleEngine.
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {RuleExpression} rule - The rule (contains subrule objects)
 * @returns {RuleExpression} The transformed rule (does NOT contain subrule objects)
 */
export declare const transformRule: (operator: Operator, rule: RuleExpression) => RuleExpression;
/**
 * Transforms the internal representation (with subrules) of a rule to the format that is testable by the ruleEngine
 * and evaluates it.
 * @param {Operator} operator - the operator of the rule (and, or, not).
 * @param {object} obj - The object to test the rule on
 * @param {RuleExpression} rule - The rule (contains subrule objects)
 * @returns {EvaluationResult} The result of the test performed by the ruleEngine
 */
export declare const validateRule: (operator: Operator, obj: object, rule: RuleExpression) => EvaluationResult;
