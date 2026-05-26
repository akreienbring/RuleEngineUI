/**
 * Return a list of operators to select from. The returned list depends on the property type.
 * @param {string} propertyType The type of the property
 * @returns {Operator[]}
 */
export declare const getOperators: (propertyType: PropertyType) => Operator[];
/**
 * Return a list of operators that do not require a comparison value (e.g. isNull, isEmpty, isTrue...)
 * @returns {Operator[]}
 *
 */
export declare const getNoCompareOperators: () => Operator[];
/**
 * CURRENTLY NOT USED
 * Return a list of state operators
 * @returns {Operator[]}
 */
export declare const getStateOperators: () => Operator[];
/**
 * Return an operator for a property based on type, testValue and already existing operators
 * @param {PropertyType} type The type of the property defined by the JSON schema
 * @param {Operator[]} operators The operators that were already added to the property
 * @param {any} [value] The corresponding value of the provided test data, if it exists else undefined
 * @returns {Operator} an operator that can be added to the property
 */
export declare const getOperatorByType: (type: PropertyType, operators: Operator[], value?: any) => Operator;
