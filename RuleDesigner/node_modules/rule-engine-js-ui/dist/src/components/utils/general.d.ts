/**
 * UNUSED BUT LEFT FOR REFERENCE
 * Make a deep clone of an object.
 * @param {object} obj  - The object that must be deeply cloned
 * @returns {object} The cloned object
 */
export declare const deepCopy: (obj: object) => object;
/**
 * Checks if value1 of a property equals its original value.
 * Arrays are referene types and are checked for equality by comparing their values.
 * @param {Property} property - The property to check
 * @returns {boolean} true if the value is the original value, false if not.
 */
export declare const isOriginal: (property: Property) => boolean;
/**
 * Creates an UUID
 * @returns {string} The UUID
 */
export declare const createUUID: () => string;
