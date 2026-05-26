import { JSX } from 'react';
interface SimplePropertyListProps {
    properties: PropertyBuffer;
    updateProperties: (properties: PropertyBuffer) => void;
}
/**
 * Based on the given input parameters this component not only builds the HTML elements, but also the Properties and an initial rule that is
 * valid regarding the given test object.
 * @param {SimplePropertyListProps} props
 * @param {PropertBuffer} props.properties - The current property buffer
 * @param {Function} props.updateProperties - Called every time when the property buffer was changed.
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 */
export default function SimplePropertyList({ properties, updateProperties, }: SimplePropertyListProps): JSX.Element;
export {};
