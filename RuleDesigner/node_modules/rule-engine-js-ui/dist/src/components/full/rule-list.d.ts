import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface RuleListProps {
    topRule: RuleExpression;
    topOperator: Operator;
    selectedRule: RuleIndex;
    isTestValid: boolean;
    uuid: string;
    archivedRules: ArchivedRule[];
    schemaIndex: number;
    handleSelectedRuleChange: (selectedRule: RuleIndex) => void;
    handleAddRule: (operator: Operator, rule: RuleExpression, uuid: string) => void;
    handleDeleteRule: (uuid: string) => void;
}
/**
 *
 * @param {RuleListProps} props
 * @param {RuleExpression} props.topRule - The rule that contains all the other operators and subrules
 * @param {Operator} props.topOperator - The operator of the top rule (and, or, not)
 * @param {RuleIndex} props.selectedRule - The currently selected rule. Contains the uuid of the rule and its operator
 * @param {boolean} props.isTestValid - Indicates if the given test object, tested againgst the top rule, is valid
 * @param {string} props.uuid - Used to identify a rule (and, or, not) in the list
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {number} props.schemaIndex - The index of the currently selected schema
 * @param {Function} props.handleSelectedRuleChange - Called when the user clicks on a rule in the list to make it the currently selected rule
 * @param {Function} props.handleAddRule - Used to add a subrule to an existing rule
 * @param {Function} props.handleDeleteRule - Used to delete a subrule from an existing rule
 * @returns {JSX.Element} A Hirarchy of all Elements of the rule with possible actions to perform.
 */
export default function RuleList({ topRule, topOperator, selectedRule, isTestValid, uuid, archivedRules, schemaIndex, handleSelectedRuleChange, handleAddRule, handleDeleteRule, }: RuleListProps): JSX.Element;
export {};
