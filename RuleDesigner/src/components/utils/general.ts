/*
  Author: André Kreienbring
*/

/**
 * UNUSED BUT LEFT FOR REFERENCE
 * Make a deep clone of an object.
 * @param {object} obj  - The object that must be deeply cloned
 * @returns {object} The cloned object
 */
export const deepCopy = (obj: object): object => {
  //return JSON.parse(JSON.stringify(obj));
  return structuredClone(obj);
  //return cloneDeep(obj);  (lodash.cloneDeep)
};

/**
 * Checks if value1 of a property equals its original value.
 * Arrays are referene types and are checked for equality by comparing their values.
 * @param {Property} property - The property to check
 * @returns {boolean} true if the value is the original value, false if not.
 */
export const isOriginal = (property: Property): boolean => {
  if (property.value1 === "" && property.origValue1 === "") return true;

  if (property.type === "array") {
    if (Array.isArray(property.value1) && Array.isArray(property.origValue1)) {
      const origValue1 = property.origValue1 as any[];
      return (
        property.value1.length === origValue1.length &&
        property.value1.every((v: any, i: number) => v === origValue1[i])
      );
    } else {
      return false;
    }
  } else {
    return property.value1 === property.origValue1;
  }
};

/**
 * Creates an UUID
 * @returns {string} The UUID
 */
export const createUUID = (): string => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    // eslint-disable-next-line no-bitwise
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  );
};
