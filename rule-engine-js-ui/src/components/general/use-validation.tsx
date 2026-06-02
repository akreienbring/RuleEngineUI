/*
  Author: André Kreienbring
  This is a custom hook that provides validation functions for form inputs.
  It can be used in any component that requires input validation.
*/

export const useValidation = () => {
  /**
   * Validates a property. Tries to correct values and sets error messages.
   * The given value is tested regarding the type of the property and the currently selected operator.
   * Is called every time a property is updated. Sets the error message  on the property.
   * @param {Property} property - The property to validate
   * @param {string} value - The value that was input for the value1 of the property
   */
  const validateProperty = (property: Property, value: string) => {
    delete property.value1Error;
    delete property.value2Error;
    let isValueValid = true;

    switch (property.type) {
      case "null":
        property.value1 = value ? value : "";
        break;
      case "number":
        if (
          property.operators[0] === "in" ||
          property.operators[0] === "notIn"
        ) {
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
          isValueValid =
            value === "-" || (value !== "" && !isNaN(Number(value)));
          if (isValueValid) {
            value === "-"
              ? (property.value1 = value)
              : (property.value1 = Number(value));
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
        if (
          property.operators[0] === "in" ||
          property.operators[0] === "notIn"
        ) {
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
          property.value1 =
            value === null || typeof value === "undefined" ? "" : value;
        }
        break;
      case "array":
        /*
        arrays can not be compared to anything.
        But this code is left here in case we want to allow comma seperated values as input for arrays in the future.
      */
        if (typeof value !== "undefined") {
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
        } else {
          property.value1Error = "Please enter comma seperated values";
          property.value1 = value;
        }

        break;
      default:
        property.value1 = value;
    }
    //check also value2 in case operator is 'between'
    if (
      typeof property.value2 !== "undefined" &&
      property.operators[0] === "between" &&
      (String(property.value2).trim() === "" || isNaN(Number(property.value2)))
    ) {
      property.value2Error = "Please enter a number";
    }
  };

  /**
   * Used for form validation. Loops through all properties and validates them with validateProperty. Returns false if at least one property is invalid.
   * @param {PropertyBuffer} properties - The properties to validate
   * @returns {boolean} true if all properties are valid, false if at least one property is invalid
   */
  const validateProperties = (properties: PropertyBuffer): boolean => {
    let isValid = true;
    Object.values(properties).forEach((property) => {
      if (property.checked) {
        if (property.checked) {
          validateProperty(property, property.value1);

          if (
            typeof property.value1Error !== "undefined" ||
            (property.operators[0] === "between" &&
              typeof property.value2Error !== "undefined")
          )
            isValid = false;
        }
      }
    });
    return isValid;
  };

  return { validateProperties, validateProperty };
};
