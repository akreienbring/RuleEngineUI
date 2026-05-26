import { JSX } from 'react';
interface SimpleRuleProps {
    isOpenRule: boolean;
    onCloseRule: () => void;
    schemas: InputSchema[];
    isSaveRule: boolean;
    addons?: Addon[];
    handleSaveRule: (createdRule: ArchivedRule) => void;
    handleUpdateRule: (rule: ArchivedRule) => void;
    archivedRule?: ArchivedRule;
}
/**
 * An assitant like dialog that provides a simple way to create a rule.
 * @param {SimpleRuleProps} props
 * @param {boolean} props.isOpenCreateRule - Will be forwarded to the SimpleRule component to open / close the Create Rule Dialog
 * @param {Function} props.onCloseCreateRule - Will be called from the SimpleRule component to close the Create Rule Dialog.
 * @param {InputSchema[]} props.schemas - Different JSON schemas for selecting properties
 * @param {boolean} props.isSaveRule - If true, the final rule can be saved with name and descriptiion
 * @param {Addon[]} [props.addons] - A list of custom accordions, that will be added to the standard ones.
 * @param {Function} props.handleSaveRule - Calls the function to save the rule and add it to a list of "archived" rules
 * @param {Function} props.handleUpdateRule - Calls the function to update the rule in the list of "archived" rules
 * @param {ArchivedRule} [props.archivedRule] - If given, the user wants to edit an existing rule
 * @returns {JSX.Element}
 */
export default function SimpleRule({ isOpenRule, onCloseRule, schemas, isSaveRule, addons, handleSaveRule, handleUpdateRule, archivedRule, }: SimpleRuleProps): JSX.Element;
export {};
