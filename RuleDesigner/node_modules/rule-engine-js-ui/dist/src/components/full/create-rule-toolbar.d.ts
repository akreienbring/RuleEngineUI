import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface CreateRuleToolbarProps {
    schemas: InputSchema[];
    schemaIndex: number;
    operator: Operator;
    isShowRuleText: boolean;
    archivedRules: ArchivedRule[];
    handleSchemaSelect: (schemaIndex: number) => void;
    handleResetAll: () => void;
    handleRuleOperatorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    toggleShowRuleText: () => void;
    handleSaveToprule: () => void;
    handleLoadRule: (rule: RuleExpression, operator: Operator, schemaIndex: number) => void;
}
/**
 * Implements the possible actions for the manipulation of the top rule (e.g. save, reset, select schema...)
 * @param {CreateRuleToolbarProps} props
 * @param {InputSchema[]} props.schemas - A list of JSON schemas used to build a list of properties for a rule
 * @param {number} props.schemaIndex - The index of the currently selected JSON schema
 * @param {Operator} props.operator - The operator (and, or, not) of the selected rule
 * @param {boelean} props.isShowRuleText - Indicates if the list of rules is presented as JSON or as object
 * @param {Function} props.handleSchemaSelect - Called when a different schema must be used
 * @param {Function} props.handleResetAll - Called when all properties of a rule must be reset to there original values
 * @param {Function} props.handleRuleOperatorChange - Called when the operator (and, or, not) of a rule must be changed
 * @param {Function} props.toggleShowRuleText - Used to toggle the presentation of the rule. (JSON or object)
 * @param {Function} props.handleSaveToprule - Hand over the created rule to the application that is using this component
 * @param {Function} props.handleLoadRule - Called when an rule was selected for loading
 * @returns {JSX.Element} The Toolbar with the possible actions
 */
export default function CreateRuleToolbar({ schemas, schemaIndex, operator, isShowRuleText, archivedRules, handleSchemaSelect, handleResetAll, handleRuleOperatorChange, toggleShowRuleText, handleSaveToprule, handleLoadRule, }: CreateRuleToolbarProps): JSX.Element;
export {};
