import { JSX } from 'react';
interface PropertyToolbarProps {
    property: Property;
    bufferKey: string;
    isPropertySelect: boolean;
    isNoCompareOperator: boolean;
    handleResetProperty: (bufferKey: string) => void;
    handleAddOperator: (bufferKey: string) => void;
    handleDeleteOperator: (bufferKey: string, index: number) => void;
    handlePropertySelection: (isPropertySelect: boolean) => void;
}
/**
 * A toolbar for selecting property actions.
 * @param {PropertyToolbarProps} props
 * @param {Property} props.property - The property object containing current and original values and operators.
 * @param {string} props.bufferKey - The key used to identify the property in the (object) buffer.
 * @param {boolean} props.isPropertySelect - Flag indicating if the property selection mode (compare property with another property) is active.
 * @param {boolean} props.isNoCompareOperator - Indicates if the selectes operator allows to compare the property with another value
 * @param {Function} props.handleResetProperty - Allows the user to reset the property to its original value
 * @param {Function} props.handleAddOperator - A property can have more then one operator in a rule.
 * @param {Function}  props.handleDeleteOperator - Allows to delete an added operator from a property
 * @param {Fumction} props.handlePropertySelection - Called to switch between property - value and property - property comparison
 * @returns {JSX.Element}
 */
export default function PropertyToolbar({ property, bufferKey, isPropertySelect, isNoCompareOperator, handleResetProperty, handleAddOperator, handleDeleteOperator, handlePropertySelection, }: PropertyToolbarProps): JSX.Element;
export {};
