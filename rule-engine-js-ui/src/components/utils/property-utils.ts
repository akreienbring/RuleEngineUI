/*
  Author: André Kreienbring
*/
import {
  getNoCompareOperators,
  getOperatorByType,
} from "@src/components/utils/operator-utils";
import { getValueByPath } from "@src/components/utils/rule-utils-js";
import type {
  ArchivedRule,
  JSONProperty,
  JSONSchema,
} from "@src/components/types/public";
/**
 * JSONSchema property object can have 3 kinds of keys: const, enum, and type. If the type is not given,
 * it can be detected by the type of the value of const or the type of the first entry in enum.
 * @param {JSONProperty} propInfo - The JSONSchema property object
 * @returns {PropertyType} - The detected property type
 */
const detectType = (propInfo: JSONProperty): PropertyType => {
  if (typeof propInfo.const !== "undefined") {
    return typeof propInfo.const as PropertyType;
  } else if (typeof propInfo.enum !== "undefined") {
    return typeof propInfo.enum[0] as PropertyType;
  } else {
    //convert 'integer' from JSON Schema to 'number'
    return !propInfo.type
      ? "null"
      : propInfo.type === "integer"
        ? "number"
        : (propInfo.type as PropertyType);
  }
};

/**
 * Converts a JSON schema to a PropertyBuffer that will be used to create operators and inputs to create a rule
 * @param {JSONSchema} schema - The JSON schema to create the properties from
 * @param {object} [testObj] - If given, initial values for the inputs can be created from the object.
 * @param {ArchivedRule} [archivedRule] If given, initial values for the inputs can be created from the rule.
 * @returns {PropertyBuffer} An object that contains all properties (with additional info) from the JSON schema.
 */
export const createProperties = (
  schema: JSONSchema,
  testObj: object | null,
  archivedRule: ArchivedRule | null,
): PropertyBuffer => {
  const properties: PropertyBuffer = {};

  /**
   * A recursive function that creates the PropertyBuffer
   * @param {object} obj - The JSON schema (or a subobject of it)
   * @param {string} path - The path to the property.
   * @param {number} level - The level of recursion. Can be used for indentation
   * @returns {PropertyBuffer}
   */
  const createList = (
    obj: object,
    path: string,
    level: number,
  ): PropertyBuffer => {
    const subObjects: { path: string; propName: string; obj: object }[] = [];

    Object.entries(obj).forEach(([propName, propInfo]) => {
      if (!propInfo.type || propInfo.type !== "object") {
        const bufferKey = path ? `${path}.${propName}` : propName;

        const propType = detectType(propInfo as JSONProperty);

        let value1: any;
        let value2: any;
        let checked = false;
        let operator = getOperatorByType(
          propType,
          typeof propInfo.enum !== "undefined",
          [],
        );
        if (archivedRule !== null) {
          /*
          If a rule was passed, check it for the used property name and value
          This way the properties can be recreated from a given rule
        */
          const operators = archivedRule.rule[
            archivedRule.operator
          ] as object[];
          operators.forEach((ruleOperator) => {
            Object.entries(ruleOperator).forEach(
              ([operatorName, comparison]) => {
                if (comparison[0] === propName) {
                  checked = true;
                  const isNoCompareOperator = getNoCompareOperators().includes(
                    operatorName as Operator,
                  );
                  if (isNoCompareOperator) {
                    operator = getOperatorByType(
                      propType,
                      typeof propInfo.enum !== "undefined",
                      [],
                    );
                  } else {
                    if (operatorName === "between") {
                      value1 = comparison[1][0];
                      value2 = comparison[1][1];
                      operator = "between";
                    } else {
                      value1 = comparison[1];
                      operator = getOperatorByType(
                        propType,
                        typeof propInfo.enum !== "undefined",
                        [],
                        value1,
                      );
                    }
                  }
                }
              },
            );
          });
        } else if (testObj !== null) {
          /*
          If a test object was passed, check it for the used property name and value
          */
          value1 = getValueByPath(testObj, bufferKey);

          if (typeof value1 !== "undefined") {
            checked = true;
            operator = getOperatorByType(
              propType,
              typeof propInfo.enum !== "undefined",
              [],
              value1,
            );
          }
        }

        const property: Property = {
          key: propName,
          origValue1: value1,
          value1: value1,
          value2,
          type: propType,
          operators: [operator],
          origOperator: operator,
          checked,
          origChecked: checked,
          level,
          /*
          If enum exists, add it to the property for later use in the operator select component.
          It can be used to restrict the possible values for the property and to display a select input instead of a text input for the value.
          */
          enum: propInfo.enum,
        };
        properties[bufferKey] = property;
      } else {
        subObjects.push({ path, propName, obj: propInfo.properties });
      }
    }); // forEach level property
    // recursion for every sub object in this level
    subObjects.forEach((subObject) => {
      const newPath = !subObject.path
        ? subObject.propName
        : `${path}.${subObject.propName}`;

      createList(subObject.obj, newPath, level + 1);
    });

    return properties;
  };

  return createList(schema.properties, "", 0);
};
