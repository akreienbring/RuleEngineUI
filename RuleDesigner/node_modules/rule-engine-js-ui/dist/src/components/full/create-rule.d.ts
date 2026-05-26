import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface CreateRuleProps {
    schemas: InputSchema[];
    testObj: object;
    maxLevel?: number;
    archivedRules: ArchivedRule[];
    prepareSaveRule: (rule: RuleExpression, operator: Operator, schmemaIndex: number) => void;
}
/**
 * Presents all utilities to create a rule useable with the JSON rule engine.
 * @param {CreateRuleProps} props
 * @param {InputSchema[]} props.schemas - A list of JSON schemas to build a rule for. Schemas must be provided by the user of the rule designer
 * @param {schemaIndex} props.schemaIndex - The index of the currently selected schema
 * @param {object} props.testObj - An object used to validate the created rule with. This helps visually testing the rule while it is created
 * @param {number} [props.maxLevel] - If provided, the JSON schema is only analized up to the given depht
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {Function} props.handleSchemaSelect - Called when a different schema must be selected
 * @param {Function} props.handleSaveRule - Hand over the created rule to the application that is using this component
 * @returns {JSX.Element} The UI used to creat a rule for a certain JSON schema
 */
export default function CreateRule({ schemas, testObj, maxLevel, archivedRules, prepareSaveRule, }: CreateRuleProps): JSX.Element;
export {};
