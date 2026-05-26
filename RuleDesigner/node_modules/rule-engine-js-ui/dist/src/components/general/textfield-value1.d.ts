import { JSX } from 'react';
interface TextFieldValue1Props {
    property: Property;
    bufferKey: string;
    isPropertySelect: boolean;
    propertyMenuItems: string[];
    inputWidth: number;
    handleValueChange: (bufferKey: string, value: string, second: boolean, isPropertySelect: boolean, path: string) => void;
}
/**
 * Used in the property lists for the input of value1.
 * @param {TextFieldValue1Props} props
 * @param {Property} props.property The property for which the value1 is entered
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {boolean} props.isPropertySelect If true the value is selected from a list of properties, otherwise it is entered in a textfield
 * @param {string[]} props.propertyMenuItems If isPropertySelect is true, the list of properties to select from
 * @param {number} props.inputWidth The width of the input field(s)
 * @param {Function} props.handleValueChange Called when the value of the input field is changed
 * @returns {JSX.Element} The TextField for the value2 of a property
 */
export default function TextFieldValue1({ property, bufferKey, isPropertySelect, propertyMenuItems, inputWidth, handleValueChange, }: TextFieldValue1Props): JSX.Element;
export {};
