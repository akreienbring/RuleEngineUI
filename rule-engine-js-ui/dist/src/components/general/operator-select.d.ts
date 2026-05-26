import { JSX } from 'react';
interface OperatorSelectProps {
    property: Property;
    bufferKey: string;
    handlePropOperatorChange: (bufferKey: string, operator: Operator) => void;
}
/**
 * Allows to select an operator from a list (e.g. eq, neq...)
 * @param {OperatorSelectProps} props
 * @param {Propery} props.property - The property to select an operator for
 * @param {string} props.bufferKey - The key of the property in the PropertyBuffer
 * @param {Function} props.handlePropOperatorChange - called when the operator for the property was changed
 * @returns {JSX.Element} A compoonent that allows selecting an operator
 */
export default function OperatorSelect({ property, bufferKey, handlePropOperatorChange, }: OperatorSelectProps): JSX.Element;
export {};
