import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface RuleListToolbarProps {
    uuid: string;
    ruleLevel: number;
    isExpanded: boolean;
    operatorName: Operator;
    archivedRules: ArchivedRule[];
    schemaIndex: number;
    handleSelectedRuleChange: (selectedRule: RuleIndex) => void;
    handleAddRule: (operator: Operator, rule: RuleExpression, uuid: string) => void;
    handleDeleteRule: (uuid: string) => void;
    handleExpandObject: (level: number) => void;
}
/**
 * Implements the possible actions for a rule (and, or, not) in the rule list.
 * @param {RuleListToolbarProps} props
 * @param {string} props.uuid - A unique Id to identify the (sub-) rule
 * @param {number} props.ruleLevel - The recursion level. Used to indent the rule in the tree of rules
 * @param {boolean} props.isExpanded - indicates if a rule is currently expanded or collapsed
 * @param {Operator} props.operatorName - (and, or, not) The operator of the rule
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {number} props.schemaIndex - The index of the currently selected schema
 * @param {Function} props.handleSelectedRuleChange - Called when the user selects a rule of the list
 * @param {Function} props.handleAddRule - Called when a subrule must be added to an existing rule
 * @param {Function} props.handleDeleteRule - Called when a subrule must be deleted from an existing rule
 * @param {Function} props.handleExpandObject - Called when a rule must be expanded or collapsed
 * @returns {JSX.Element} The toolbar with the possible actions
 */
export default function RuleListToolbar({ uuid, ruleLevel, isExpanded, operatorName, archivedRules, schemaIndex, handleSelectedRuleChange, handleAddRule, handleDeleteRule, handleExpandObject, }: RuleListToolbarProps): JSX.Element;
export {};
