import { JSX } from 'react';
interface PropertyItemProps {
    isExpanded: boolean;
    level: number;
    propName: string;
    properties: PropertyBuffer;
    bufferKey: string;
    handlePropCheck: (bufferKey: string) => void;
    handlePropOperatorChange: (bufferKey: string, value: any) => void;
    handleValueChange: (bufferKey: string, value: string, second: boolean, isPropertySelect: boolean, path: string) => void;
    handleResetProperty: (bufferKey: string) => void;
    handleAddOperator: (bufferKey: string) => void;
    handleDeleteOperator: (bufferKey: string, index: number) => void;
    handleSelectOperator: (bufferKey: string, index: number) => void;
}
/**
 * A PropertyItem represents a singele property of the JSON schema.
 * It allows the user to select an operator and a value to compare the property with.
 * @param {PropertyItemProps} props
 * @param {boolean} props.isExpanded If true all subproperties of the property are shown, otherwise they are hidden
 * @param {number} props.level The level of the property in the schema (determines indentation)
 * @param {PropertyBuffer} props.properties The (object) buffer containing the properties of the JSON schema
 * @param {string} props.bufferKey The key of the property in the buffer
 * @param {Function} props.handlePropCheck Called when the checkbox of the property is toggled
 * @param {Function} props.handlePropOperatorChange Called when the operator of the property is changed
 * @param {Function} props.handleValueChange Called when the value of the property is changed
 * @param {Function} props.handleResetProperty Called when the property must be reset to its original state
 * @param {Function} props.handleAddOperator Called when the user wants to add an additional operator to the property
 * @param {Function} props.handleDeleteOperator Called when the user wants to delete an operator from the property
 * @param {Function} props.handleSelectOperator Called when the user wants to select an operator of the property
 * @returns {JSX.Element | null}
 */
export default function PropertyItem({ isExpanded, level, properties, bufferKey, handlePropCheck, handlePropOperatorChange, handleValueChange, handleResetProperty, handleAddOperator, handleDeleteOperator, handleSelectOperator, }: PropertyItemProps): JSX.Element | null;
export {};
