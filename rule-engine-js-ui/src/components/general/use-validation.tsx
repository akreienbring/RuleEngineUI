/*
  Author: André Kreienbring
  This is a custom hook that provides validation functions for form inputs.
  It can be used in any component that requires input validation.
*/
import {
  getNoCompareOperators,
  getStateOperators,
} from "@src/components/utils/operator-utils";

type ValidationResult = {
  errorMsg?: string;
  newValue: string | number | boolean | number[] | string[];
};

/**
 * Called when the final value must be an array (comma seperated values).
 * If the value is valid it will be set on the property
 * @param {Property} property - The property where the final value will be set
 * @param {string} value - This value will be checked if it reqresents an array
 */
const checkArrayValue = (
  property: Property,
  valueToValidate: string,
): ValidationResult => {
  const result: ValidationResult = {
    errorMsg: undefined,
    newValue: valueToValidate,
  };
  result.newValue = valueToValidate.replace(", ", ",").trim();
  const newValue = result.newValue.split(",");

  if (
    result.newValue.endsWith(",") ||
    !Array.isArray(newValue) ||
    newValue.length < 2
  ) {
    result.errorMsg = `Please enter comma seperated ${property.type === "number" ? "numbers" : "values"}`;
  } else if (property.type === "number") {
    //is valid but convert contained numbers as string to numbers
    result.newValue = newValue.map((entry: any) => {
      if (!isNaN(entry)) {
        return Number(entry);
      } else {
        result.errorMsg = "Please enter comma seperated numbers";
        return entry;
      }
    });
  } else {
    result.newValue = newValue;
  }

  return result;
};

/**
 * A Ract-Hook that is used to validate properties.
 */
export const useValidation = () => {
  /**
   * Validates a property. Tries to correct values and sets error messages.
   * The given value is tested regarding the type of the property and the currently selected operator.
   * Is called every time a property is updated. Sets (modified) value and the error message  on the property.
   * @param {Property} property - The property to validate
   * @param {string} value - The value that was input as the value of the property
   */
  const validateProperty = (
    property: Property,
    valueToValidate: string,
  ): ValidationResult => {
    let isValueValid = true;
    let result: ValidationResult = {
      errorMsg: undefined,
      newValue: valueToValidate,
    };

    switch (property.type) {
      case "null":
        result.newValue = valueToValidate ? valueToValidate : "";
        break;
      case "number":
        if (
          property.operators[0] === "in" ||
          property.operators[0] === "notIn"
        ) {
          if (!Array.isArray(valueToValidate)) {
            result = checkArrayValue(property, valueToValidate.toString());
          }
        } else {
          isValueValid =
            valueToValidate === "-" ||
            (valueToValidate !== "" && !isNaN(Number(valueToValidate)));
          if (isValueValid) {
            valueToValidate === "-"
              ? (result.newValue = valueToValidate)
              : (result.newValue = Number(valueToValidate));
          } else {
            result.newValue = "";
            result.errorMsg = "Please enter a number";
          }
        }
        break;
      case "boolean":
        result.newValue = valueToValidate === "true";
        break;
      case "string":
        if (
          property.operators[0] === "in" ||
          property.operators[0] === "notIn"
        ) {
          if (!Array.isArray(valueToValidate)) {
            result = checkArrayValue(property, valueToValidate);
          } else {
            result.newValue = valueToValidate;
          }
        } else {
          result.newValue =
            valueToValidate === null || typeof valueToValidate === "undefined"
              ? ""
              : valueToValidate;
        }
        break;
      case "array":
        /*
        arrays can not be compared to anything.
        But this code is left here in case we want to allow comma seperated values as input for arrays in the future.
      */
        if (typeof valueToValidate !== "undefined") {
          if (!Array.isArray(valueToValidate)) {
            result = checkArrayValue(property, valueToValidate);
          } else {
            result.newValue = valueToValidate;
          }
        } else {
          result.errorMsg = "Please enter comma seperated values";
          result.newValue = valueToValidate;
        }

        break;
      default:
        result.newValue = valueToValidate;
    }

    return result;
  };

  /**
   * Used for form validation. Loops through all properties and validates them with validateProperty. Returns false if at least one property is invalid.
   * @param {PropertyBuffer} properties - The properties to validate
   * @returns {boolean} true if all properties are valid, false if at least one property is invalid
   */
  const validateProperties = (properties: PropertyBuffer): boolean => {
    let isValid = true;
    Object.values(properties).forEach((property) => {
      const isStateOperator = getStateOperators().includes(
        property.operators[0],
      );
      const isNoCompareOperator = getNoCompareOperators().includes(
        property.operators[0],
      );

      if (property.isChecked) {
        delete property.value1Error;
        delete property.value2Error;

        if (!isNoCompareOperator) {
          const result = validateProperty(property, property.value1.toString());
          property.value1Error = result.errorMsg;
          property.value1 = result.newValue;
        }

        if (
          (isStateOperator || property.operators[0] === "between") &&
          typeof property.value2 !== "undefined"
        ) {
          const result = validateProperty(property, property.value2.toString());
          property.value2Error = result.errorMsg;
          property.value2 = result.newValue;
        }

        if (
          typeof property.value1Error !== "undefined" ||
          typeof property.value2Error !== "undefined"
        )
          isValid = false;
      }
    });
    return isValid;
  };

  return { validateProperties, validateProperty };
};
