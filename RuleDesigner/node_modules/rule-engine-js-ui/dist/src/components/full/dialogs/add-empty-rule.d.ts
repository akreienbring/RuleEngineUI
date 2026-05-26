import { JSX } from 'react';
interface AddEmptyRuleProps {
    handleAddEmptyRule: (operator: Operator) => void;
}
/**
 * A list with options (and, or, not). Used to add a new rule as a subrule
 * @param {AddEmptyRuleProps} props
 * @param {Function} props.handleAddEmptyRule - Called when an empty rule is added as a subrule
 * @returns
 */
export default function AddEmptyRule({ handleAddEmptyRule, }: AddEmptyRuleProps): JSX.Element;
export {};
