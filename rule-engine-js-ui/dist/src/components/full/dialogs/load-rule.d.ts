import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface LoadRuleProps {
    isOpen: boolean;
    onClose: () => void;
    archivedRules: ArchivedRule[];
    handleLoadArchiveRule: (rule: RuleExpression, operator: Operator, schemaIndex: number) => void;
}
/**
 * A Dialog to select an alereay existing rule as the new top rule
 * @param {LoadRuleProps} props
 * @param {boolean} props.isOpen - If true the dialog is opened else closed
 * @param {Function} props.onClose - Called when the dialog must be or is closed
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when loading a rule
 * @param {Function} props.handleLoadArchiveRule - Called when an rule was selected
 * @returns {JSX.Element}
 */
export default function LoadRule({ isOpen, onClose, archivedRules, handleLoadArchiveRule, }: LoadRuleProps): JSX.Element;
export {};
