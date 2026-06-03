import { type JSX } from "react";
import { RuleExpression } from "rule-engine-js";

export type InputSchema = {
  name: string;
  description: string;
  schema: JSONSchema;
  schemaId: number;
};

export interface Addon {
  summary: string;
  selected: string;
  details: JSX.Element;
}

export interface ArchivedRule {
  ruleid: number;
  name: string;
  description: string;
  schemaId: number;
  operator: Operator;
  rule: RuleExpression;
}

export type JSONSchema = {
  type: string;
  properties: { [key: string]: JSONProperty };
  required: string[];
};
