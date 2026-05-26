/*
  Author: André Kreienbring
*/
import { getOperatorByType } from "@src/components/utils/operator-utils";

/**
 * Validates a property (value1). Tries to correct values and sets error messages.
 * The given value is tested regarding the type of the property and the currently selected operator.
 * Is called every time a property is updated
 * @param {Property} property - The property to validate
 * @param {string} value - The value that was input for the value1 of the property
 */
export const validateProperty = (property: Property, value: string) => {
  delete property.value1Error;
  delete property.value2Error;
  let isValueValid = true;

  switch (property.type) {
    case "null":
      property.value1 = value ? value : "";
      break;
    case "number":
      if (property.operators[0] === "in" || property.operators[0] === "notIn") {
        property.value1 = value.replace(", ", ",").trim();
        const newValue = property.value1.split(",");
        if (
          property.value1.endsWith(",") ||
          !Array.isArray(newValue) ||
          newValue.length < 2
        ) {
          property.value1Error = "Please enter comma seperated values";
        } else {
          //is valid but convert contained numbers as string to numbers
          property.value1 = newValue.map((entry: any) => {
            if (!isNaN(Number(entry))) {
              return Number(entry);
            } else {
              return entry;
            }
          });
        }
      } else {
        isValueValid = value !== "" && !isNaN(Number(value));
        if (isValueValid) {
          property.value1 = Number(value);
        } else {
          property.value1 = "";
          property.value1Error = "Please enter a number";
        }
      }
      break;
    case "boolean":
      property.value1 = value;
      break;
    case "string":
      if (property.operators[0] === "in" || property.operators[0] === "notIn") {
        property.value1 = value.replace(", ", ",").trim();
        const newValue = property.value1.split(",");
        if (
          property.value1.endsWith(",") ||
          !Array.isArray(newValue) ||
          newValue.length < 2
        ) {
          property.value1Error = "Please enter comma seperated values";
        }
      } else {
        property.value1 = value === null ? "" : value;
      }
      break;
    case "array":
      property.value1 = value.replace(", ", ",").trim();
      const newValue = property.value1.split(",");
      if (
        property.value1.endsWith(",") ||
        !Array.isArray(newValue) ||
        newValue.length < 2
      ) {
        property.value1Error = "Please enter comma seperated values";
        property.value1 = value;
      } else {
        property.value1 = newValue;
      }

      break;
    default:
      property.value1 = value;
  }
  //check also value2 in case operator is 'between'
  if (
    typeof property.value2 !== "undefined" &&
    property.operators[0] === "between" &&
    (property.value2.toString().trim() === "" || isNaN(Number(property.value2)))
  ) {
    property.value2Error = "Please enter a number";
  }
};

/**
 * Converts a JSON schema to a PropertyBuffer that will be used to create operators and inputs to create a rule
 * CURRENTLY ONLY USED BY SimpleRule
 * @param {JSONSchema} schema - The JSON schema to create the properties from
 * @param {ArchivedRule} [archivedRule] If given, initial values for the inputs can be created from the rule.
 * @returns {PropertyBuffer} An object that contains all properties (with additional info) from the JSON schema.
 */
export const createProperties = (
  schema: JSONSchema,
  archivedRule?: ArchivedRule,
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

        //convert 'integer' from JSON Schema to 'number'
        const propType: PropertyType = !propInfo.type
          ? "null"
          : propInfo.type === "integer"
            ? "number"
            : propInfo.type;

        /*
          If a rule was passed, check it for the used property name and value
          This way the properties can be recreated from a given rule
        */
        let value: any = "";
        let checked = false;
        let operator = getOperatorByType(propType, []);
        if (typeof archivedRule !== "undefined") {
          const operators = archivedRule.rule[
            archivedRule.operator
          ] as object[];
          operators.forEach((ruleOperator) => {
            Object.values(ruleOperator).forEach((comparison) => {
              if (comparison[0] === propName) {
                value = comparison[1];
                checked = true;
                operator = getOperatorByType(propType, [], value);
              }
            });
          });
        }

        const property: Property = {
          key: propName,
          origValue1: value,
          value1: value,
          value2: "",
          type: propType,
          operators: [operator],
          origOperator: operator,
          checked,
          origChecked: checked,
          level,
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
