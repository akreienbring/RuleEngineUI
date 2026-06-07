/*
  Author: André Kreienbring
*/
import { getOperatorByType } from "@src/components/utils/operator-utils";
import { getValueByPath } from "@src/components/utils/rule-utils-js";
import type { ArchivedRule, JSONSchema } from "@src/components/types/public";

/**
 * JSONSchema property object can have 3 kinds of keys: const, enum, and type. If the type is not given,
 * it can be detected by the type of the value of const or the type of the first entry in enum.
 * @param {JSONProperty} propInfo - The JSONSchema property object
 * @returns {PropertyType} - The detected property type
 */
const detectTypeValue = (
  propInfo: JSONProperty,
): { propType: PropertyType; propValue: string } => {
  if (typeof propInfo.const !== "undefined") {
    return {
      propType: typeof propInfo.const as PropertyType,
      propValue: propInfo.const as string,
    };
  } else if (typeof propInfo.enum !== "undefined") {
    let propType = typeof propInfo.enum[0] as PropertyType;
    let propValue = propInfo.enum[0] as string;

    if (propType === "object") {
      /*
        If the enum is an array of objects, the type and value can be detected by the first entry in the enum array that has a 'value' key. 
        The type is then the type of the value of this key and the value is the value of this key. 
        This allows to use enums with name and value, where name can be used for display and value as value for a dropdown box.
        Example for a working JSON schema property:
          favoriteFood: {
            enum: [
              { name: "pizza", value: "1" },
              { name: "taco", value: "2" },
              { name: "fries", value: "3" },
           ],
         }
      */
      const enumObject = Object.entries(propInfo.enum[0]).forEach(
        ([key, value]) => {
          if (key === "value") {
            propType = typeof value as PropertyType;
            propValue = value;
          }
        },
      );
    }
    return { propType, propValue };
  } else {
    //convert 'integer' from JSON Schema to 'number'
    return {
      propType: !propInfo.type
        ? "null"
        : propInfo.type === "integer"
          ? "number"
          : (propInfo.type as PropertyType),
      propValue: "",
    };
  }
};

/**
 * Stateful rules need an object for the first evaluation to detect changes.
 * The initial values for this object are saved in the value2 of a property with a stateful operator.
 * This function creates the object for the first evaluation of a stateful rule.
 * @param {PropertyBuffer} properties - The properties created during rule creation.
 * @returns {object} The object that can be used for the first evaluation of a stateful rule
 */
export const createFirstEval = (properties: PropertyBuffer): object => {
  const firstEval: any = {};
  Object.entries(properties).forEach(([key, property]) => {
    if (property.operators[0] !== "between" && property.value2 !== "") {
      firstEval[key] = property.value2;
    }
  });

  return firstEval;
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

        const propTypeValue = detectTypeValue(propInfo as JSONProperty);
        let value1 =
          typeof propTypeValue.propValue !== "undefined"
            ? propTypeValue.propValue
            : "";
        let value2 = "";
        let isChecked = false;
        let operator = getOperatorByType(
          propTypeValue.propType,
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
                if (comparison[0] === bufferKey) {
                  isChecked = true;
                  operator = operatorName as Operator;
                  if (operatorName === "between") {
                    value1 = comparison[1][0];
                    value2 = comparison[1][1];
                    operator = "between";
                  } else {
                    value1 = comparison[1];
                  }
                }
              },
            );
          });

          /*
            If the firstEval object has a key of propName, set it as value2
          */
          Object.entries(archivedRule.firstEval).forEach(
            ([evalPropName, evalValue]) => {
              if (evalPropName === propName) value2 = evalValue;
            },
          );
        } else if (testObj !== null) {
          /*
          If a test object was passed, check it for the used property name and value
          */
          const testValue1 = getValueByPath(testObj, bufferKey);

          if (typeof testValue1 !== "undefined") {
            isChecked = true;
            value1 = testValue1;
            operator = getOperatorByType(
              propTypeValue.propType,
              typeof propInfo.enum !== "undefined",
              [],
              testValue1,
            );
          }
        }

        const property: Property = {
          key: propName,
          origValue1: value1,
          value1: value1,
          value2,
          type: propTypeValue.propType,
          operators: [operator],
          origOperator: operator,
          isChecked,
          origChecked: isChecked,
          level,
          /*
          If enum exists, add it to the property for later use in the operator select component.
          It can be used to restrict the possible values for the property and to display a select input instead of a text input for the value.
          */
          enum: propInfo.enum,
          isConst: typeof propInfo.const !== "undefined",
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
