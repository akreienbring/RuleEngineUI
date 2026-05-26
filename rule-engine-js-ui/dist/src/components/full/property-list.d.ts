import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface PropertyListProps {
    schemas: InputSchema[];
    schemaIndex: number;
    testObj: object;
    maxLevel?: number;
    properties: PropertyBuffer;
    selectedRule: RuleIndex;
    updateProperties: (properties: PropertyBuffer) => void;
    handleSchemaChange: (rule: RuleExpression) => void;
    updateSelectedRule: (newRule: RuleExpression, newTopOperator?: Operator) => void;
}
/**
 * Based on the given input parameters this component not only builds the HTML elements, but also the Properties and an initial rule that is
 * valid regarding the given test object.
 * @param {PropertyListProps} props
 * @param {InputSchema[]} props.schemas - A list of JSON schemas to build a rule for. Schemas must be provided by the user of the rule designer.
 * @param {schemaIndex} props.schemaIndex - The index of the currently selected schema
 * @param {object} props.testObj - An object used to validate the created rule with. This helps visually testing the rule while it is created.
 * @param {number} props.maxLevel - If provided, the JSON schema is only analized up to the given
 * @param {Function} props.properties - The current property buffer
 * @param {RuleIndex} props.selectedRule - The currently select (sub-) rule. Needed to apply possible action (like changing values or adding operators)
 * @param {Function} props.updateProperties - Called every time when the property buffer was changed.
 * @param {Function} props.handleSchemaChange - Called when the JSON schema was changed.
 * @param {Function} props.updateSelectedRule - Called when the currently selected rule (and, or, not) needs to be updated.
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 */
export default function PropertyList({ schemas, schemaIndex, testObj, maxLevel, properties, selectedRule, updateProperties, handleSchemaChange, updateSelectedRule, }: PropertyListProps): JSX.Element;
export {};
