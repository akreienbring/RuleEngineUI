import { RuleExpression } from 'rule-engine-js';
interface RulesTableProps {
    archivedRules: ArchivedRule[];
    schemaIndex: number | null;
    handleLoadArchiveRule: (rule: RuleExpression, operator: Operator, schemaIndex: number) => void;
}
/**
 *
 * @param {RulesTableProps} props
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {number} props.schemaIndex - The index of the currently selected schema
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function RulesTable({ archivedRules, schemaIndex, handleLoadArchiveRule, }: RulesTableProps): import("react/jsx-runtime").JSX.Element;
export {};
