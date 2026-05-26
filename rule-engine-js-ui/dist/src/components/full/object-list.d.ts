import { JSX } from 'react';
interface ObjectListProps {
    obj: object;
    maxLevel?: number;
}
/**
 * Converts a given object to a MUI list
 * @param {ObjectListProps} props
 * @param {object} props.obj - An object used to validate the created rule with. This helps visually testing the rule while it is created.
 * @param {number} props.maxLevel - If provided, the JSON schema is only analized up to the given
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 */
export default function ObjectList({ obj, maxLevel, }: ObjectListProps): JSX.Element;
export {};
