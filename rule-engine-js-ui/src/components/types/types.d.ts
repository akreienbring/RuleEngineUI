import { RuleExpression } from "rule-engine-js";

declare global {
  type Operator =
    | "and"
    | "or"
    | "not"
    | "eq"
    | "neq"
    | "isNull"
    | "isNotNull"
    | "exists"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "isTrue"
    | "isFalse"
    | "isEmpty"
    | "isNotEmpty"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "regex"
    | "in"
    | "notIn"
    | "changedBy"
    | "increased"
    | "decreased"
    | "changed"
    | "changedFrom"
    | "changedTo";

  type PropertyType = "number" | "string" | "boolean" | "array" | "null";

  export type Property = {
    key: string;
    value1: any;
    origValue1: any;
    value2?: number | string;
    value1Error?: string;
    value2Error?: string;
    type: PropertyType;
    operators: Operator[];
    origOperator: Operator;
    checked: boolean;
    origChecked: boolean;
    level?: number;
  };

  export type PropertyBuffer = {
    [key: string]: Property;
  };

  export type InputSchema = {
    name: string;
    description: string;
    schema: JSONSchema;
    schemaId: number;
  };

  export type JSONSchema = {
    type: string;
    properties: object;
    required: string[];
  };

  export type Subrule = {
    uuid: string;
    operator: Operator;
    isValid: boolean;
    rule: RuleExpression;
  };

  export type RuleIndex = {
    uuid: string;
    operator: Operator;
  };

  export type RuleSearchResult = {
    operators: object[];
    operatorIndex: number;
    subrule: Subrule;
  };

  export interface ArchivedRule {
    ruleid: number;
    name: string;
    description: string;
    schema: string;
    schemaIndex: number;
    operator: Operator;
    rule: RuleExpression;
  }

  export interface Addon {
    summary: string;
    selected: string;
    details: JSX.Element;
  }
}

export {};
