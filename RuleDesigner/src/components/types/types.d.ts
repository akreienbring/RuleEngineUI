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

  type PropertyType =
    | "number"
    | "string"
    | "boolean"
    | "array"
    | "null"
    | "object";

  type Property = {
    key: string;
    value1: string | number | boolean | number[] | string[];
    origValue1: string | number | boolean | number[] | string[];
    value2: string | number | boolean | number[] | string[];
    value1Error?: string;
    value2Error?: string;
    type: PropertyType;
    operators: Operator[];
    origOperator: Operator;
    isChecked: boolean;
    origChecked: boolean;
    level: number;
    enum?: string[] | number[] | object[];
    isConst: boolean;
  };

  type PropertyBuffer = {
    [key: string]: Property;
  };

  type Subrule = {
    uuid: string;
    operator: Operator;
    isValid: boolean;
    rule: RuleExpression;
  };

  type RuleIndex = {
    uuid: string;
    operator: Operator;
  };

  type RuleSearchResult = {
    operators: object[];
    operatorIndex: number;
    subrule: Subrule;
  };

  type JSONProperty = {
    type?: string;
    const?: string | number | boolean;
    enum?: (string | number | { name: string; value: string | number })[];
  };
}

export {};
