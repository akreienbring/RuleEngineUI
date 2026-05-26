import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface AddRuleProps {
    isOpen: boolean;
    onClose: () => void;
    archivedRules: ArchivedRule[];
    schemaIndex: number;
    handleAddEmptyRule: (operator: Operator) => void;
    handleLoadArchiveRule: (rule: RuleExpression, operator: Operator, schemaIndex: number) => void;
}
/**
 * A Dialog to add either empy rules or allready existing one to a rule
 * @param {RulesTableProps} props
 * @param {boolean} props.isOpen - If true the dialog is opened else closed
 * @param {Function} props.onClose - Called when the dialog must be or is closed
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a  rule
 * @param {number} props.schemaIndex - The index of the currently selected schema
 * @param {Function} props.handleAddEmptyRule - Called when an empty rule is added as a subrule
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function AddRule({ isOpen, onClose, archivedRules, schemaIndex, handleAddEmptyRule, handleLoadArchiveRule, }: AddRuleProps): JSX.Element;
export {};
