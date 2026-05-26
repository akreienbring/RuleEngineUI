/*
  Author: André Kreienbring
  TODO / Questions:  
  rules.not(rules.contains('password', 'password'))
  rules.field.equals('password', 'confirmPassword'),
  rules.field.equals('content.author', 'user.id'),
  rules.validation
 
  Logical operators
  and(...expressions: RuleExpression[]): RuleExpression;
  or(...expressions: RuleExpression[]): RuleExpression;
  not(expression: RuleExpression): RuleExpression;
*/

// https://gist.github.com/hyusetiawan/0f79794086cb12baf101323e3b44ca8d
// https://github.com/crafts69guy/rule-engine-js/blob/87bb78217d4903aa3c54f3f1fea3c7664e1efa58/src/index.d.ts#L405

const generalOP: Operator[] = ["isNull", "isNotNull", "exists"];
const numberOP: Operator[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
  "in",
  "notIn",
];
const stringOP: Operator[] = [
  "eq",
  "neq",
  "isEmpty",
  "isNotEmpty",
  "contains",
  "startsWith",
  "endsWith",
  "regex",
  "in",
  "notIn",
];
const booleanOP: Operator[] = ["isTrue", "isFalse"];
const arrayOP: Operator[] = ["eq", "neq"];

/**
 * Return a list of operators to select from. The returned list depends on the property type.
 * @param {string} propertyType The type of the property
 * @returns {Operator[]}
 */
export const getOperators = (propertyType: PropertyType): Operator[] => {
  if (propertyType === "null")
    return generalOP.concat(numberOP, stringOP, booleanOP);

  switch (propertyType) {
    case "number":
      return generalOP.concat(numberOP);
    case "boolean":
      return generalOP.concat(booleanOP);
    case "string":
      return generalOP.concat(stringOP);
    case "array":
      return generalOP.concat(arrayOP);
    default:
      return generalOP;
  }
};

/**
 * Return a list of operators that do not require a comparison value (e.g. isNull, isEmpty, isTrue...)
 * @returns {Operator[]}
 *
 */
export const getNoCompareOperators = (): Operator[] => {
  return [
    "isNull",
    "isNotNull",
    "exists",
    "isEmpty",
    "isNotEmpty",
    "isTrue",
    "isFalse",
  ];
};

/**
 * CURRENTLY NOT USED
 * Return a list of state operators
 * @returns {Operator[]}
 */
export const getStateOperators = (): Operator[] => {
  return [
    "changedBy",
    "increased",
    "decreased",
    "changed",
    "changedFrom",
    "changedTo",
  ];
};

/**
 * Return an operator for a property based on type, testValue and already existing operators
 * @param {PropertyType} type The type of the property defined by the JSON schema
 * @param {Operator[]} operators The operators that were already added to the property
 * @param {any} [value] The corresponding value of the provided test data, if it exists else undefined
 * @returns {Operator} an operator that can be added to the property
 */
export const getOperatorByType = (
  type: PropertyType,
  operators: Operator[],
  value?: any,
): Operator => {
  if (operators.length === 0) {
    //return a suitable 'standard' operator as the first one
    const operator: Operator =
      type === "boolean"
        ? value
          ? "isTrue"
          : "isFalse"
        : type === "null"
          ? "isNull"
          : "eq";
    return operator;
  } else {
    /*
      Return an operator that can be used based on the given information
      and is not yet included in the existing operators.
      The user may select a different one from the list.
    */
    const availableOperators: Operator[] = getOperators(type);
    for (const operator of availableOperators) {
      if (!operators.includes(operator)) return operator;
    }
    return "eq";
  }
};
