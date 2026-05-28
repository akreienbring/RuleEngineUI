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

  type Property = {
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
    level: number;
    enum?: string[] | number[];
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
}

export {};
