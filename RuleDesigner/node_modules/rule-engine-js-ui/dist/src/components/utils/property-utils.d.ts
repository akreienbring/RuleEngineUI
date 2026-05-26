/**
 * Validates a property (value1). Tries to correct values and sets error messages.
 * The given value is tested regarding the type of the property and the currently selected operator.
 * Is called every time a property is updated
 * @param {Property} property - The property to validate
 * @param {string} value - The value that was input for the value1 of the property
 */
export declare const validateProperty: (property: Property, value: string) => void;
/**
 * Converts a JSON schema to a PropertyBuffer that will be used to create operators and inputs to create a rule
 * CURRENTLY ONLY USED BY SimpleRule
 * @param {JSONSchema} schema - The JSON schema to create the properties from
 * @param {ArchivedRule} [archivedRule] If given, initial values for the inputs can be created from the rule.
 * @returns {PropertyBuffer} An object that contains all properties (with additional info) from the JSON schema.
 */
export declare const createProperties: (schema: JSONSchema, archivedRule?: ArchivedRule) => PropertyBuffer;
