/*
  Author: André Kreienbring
  TODO / Questions:  
  rules.not(rules.contains('password', 'password'))
  rules.field.equals('password', 'confirmPassword'),
  rules.field.equals('content.author', 'user.id'),
  rules.validation
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
  "changed",
  "increased",
  "decreased",
  "changedBy",
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
  "changed",
];
const booleanOP: Operator[] = ["isTrue", "isFalse"];

// enum operetors can be uses for propertes with an emum restriction.
const enumOP: Operator[] = ["changedFrom", "changedTo"];

// looks like arrays can not be compared to anything!
//const arrayOP: Operator[] = ["eq", "neq"];

/**
 * Return a list of operators to select from. The returned list depends on the property type.
 * @param {string} propertyType The type of the property
 * @param {boolean} isEnum Whether the property has an enumaratiion with valid values.
 * @returns {Operator[]}
 */
export const getOperators = (
  propertyType: PropertyType,
  isEnum: boolean,
): Operator[] => {
  let operators: Operator[];
  switch (propertyType) {
    case "null":
      operators = generalOP.concat(numberOP, stringOP, booleanOP);
      break;
    case "number":
      operators = numberOP.concat(generalOP);
      break;
    case "boolean":
      operators = booleanOP.concat(generalOP);
      break;
    case "string":
      operators = stringOP.concat(generalOP);
      break;
    case "array":
      operators = generalOP; //.concat(arrayOP);
    default:
      operators = generalOP;
  }

  if (isEnum) {
    operators = operators.concat(enumOP);
  }
  return operators;
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
    "changed",
    "increased", //number only
    "decreased", //number only
  ];
};

/**
 * CURRENTLY NOT USED
 * Return a list of state operators.
 * State operators are operators that compare the current value of a property to its previous value and check if it was changed for specific test data.
 * changed, decreased, increased are noCompareOpeators.
 * changedBy allows for a free input of a comparison value (numeric only) while
 * changedFrom, changedTo are operators that require comparison with (ideally) only possibe (given) values. (Does property selection make sense?)
 * For example, for a property "status" with the following JSON schema:
 * {
 *   "type": "string",
 *   "enum": ["open", "closed", "pending"]
 * }
 * where enum restricts the allowed values.
 * The value is compared to the previous value of the property for the given test data.
 * see: https://github.com/crafts69guy/rule-engine-js/blob/production/docs/essentials/stateful-engine.mdx
 * @returns {Operator[]}
 */
export const getStateOperators = (): Operator[] => {
  return [
    "changedBy", //number only
    "increased", //number only
    "decreased", //number only
    "changed", //does this work for arrays?
    "changedFrom", //enum only
    "changedTo", //enum only
  ];
};

/**
 * Return an operator for a property based on type, testValue and already existing operators
 * @param {PropertyType} propertyType The type of the property defined by the JSON schema
 * @param {boolean} isEnum Whether the property has an enumaratiion with valid values.
 * @param {Operator[]} operators The operators that were already added to the property
 * @param {any} [value] The corresponding value of the provided test data, if it exists else undefined
 * @returns {Operator} an operator that can be added to the property
 */
export const getOperatorByType = (
  propertyType: PropertyType,
  isEnum: boolean,
  operators: Operator[],
  value?: any,
): Operator => {
  if (operators.length === 0) {
    //return a suitable 'standard' operator as the first one
    switch (propertyType) {
      case "null":
        return "isNull";
      case "boolean":
        return value && value === true ? "isTrue" : "isFalse";
      case "array":
        return "isNotNull";
      default:
        return "eq";
    }
  } else {
    /*
      Return an operator that can be used based on the given information
      and is not yet included in the existing operators.
      The user may select a different one from the list.
    */
    const availableOperators: Operator[] = getOperators(propertyType, isEnum);
    for (const operator of availableOperators) {
      if (!operators.includes(operator)) return operator;
    }
    return "eq";
  }
};
