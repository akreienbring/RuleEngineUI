import { type JSX } from "react";
import { RuleExpression } from "rule-engine-js";

/**
 * A TestObject has a name and an object. Test Objects are used to evaluate rules against them.
 * This helps create rules that later will be used in real world scenarios.
 * @property {string} name - The name of a test object
 * @property {object} testObject - The object that is used for rule evaluation.
 */
export type TestObject = {
  name: string;
  testObject: object;
};

/**
 * InputSchema defines the properties that are available when creating a rule. It uses JSONSchema to do so.
 * @property {string} name - The name of the input schema
 * @property {string} description - A description of the input schema
 * @property {JSONSchema} schema -  The JSONSchema that finally dertermines the available properties and their types.
 * @property {number} schemaId - A unique id of the input schema
 */
export type InputSchema = {
  name: string;
  description: string;
  schema: JSONSchema;
  schemaId: number;
};

/**
 * Addons can be used to extend the functionality of the simple rule UI.
 * @property {string} summary - A title that is presented in the simple rule UI
 * @property {string} [selected] -  used to prresent a currently selected value
 * @property {JSX.Element} deteils - Must be an MUI Accordion that is added to the simple rule UI
 */
export interface Addon {
  summary: string;
  selected?: string;
  details: JSX.Element;
}

/**
 * Archived rule is the result that is handed over to the implementing application
 * when working with rule-designer-js.
 * @property {number} ruleid - A unique id of the resulting rule.
 * @property {string} name - The name of the rule
 * @property {string} description - A description of the rule
 * @property {number} schemaId - A unique id of the used JSON Schema
 * @property {Operator} operator - The (top) operator of the rules (and, or, not)
 * @property {RuleExpression} rule - The rule. Compliant with rule-engine-js
 * @property {object} firstEval - If the rule contains stateful operators (e.g. changedFrom...), the stateful rulengin can be evaluated with this initial object
 *  to detect later changes.
 */
export interface ArchivedRule {
  ruleid: number;
  name: string;
  description: string;
  schemaId: number;
  operator: Operator;
  rule: RuleExpression;
  firstEval: object;
}

/**
 * The relevant parts of the JSON Schema specification used in rule-engine-js-ui
 * @property {string} type - the type of an object property  (e.g. string, integer, boolean...)
 * @property {JSONProperty[]} properties - A list of properties of the JSON Schema
 * @property {string[]} required - A list of properties marked a required in the JSON Schema
 */
export type JSONSchema = {
  type: string;
  properties: { [key: string]: JSONProperty };
  required: string[];
};
