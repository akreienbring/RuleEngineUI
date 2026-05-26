import { JSX } from 'react';
interface RuleEngingJSUIProps {
    schemas: InputSchema[];
    isSaveRule: boolean;
    handleSaveRule: (archivedRule: ArchivedRule) => void;
    handleUpdateRule: (archivedRule: ArchivedRule) => void;
    isOpenCreateRule?: boolean;
    onCloseCreateRule?: () => void;
    maxLevel?: number;
    testObj?: object;
    archivedRules?: ArchivedRule[];
    archivedRule?: ArchivedRule;
    addons?: Addon[];
}
/** This is the component that provides two UI's.
 *  - A fully featured client that can be used to create complex rules (CreateRule)
 *  - A 'assisant like' simpler client with less features but the possibility to extend the interface (SimpleRule)
 * Each of these UI need some NOT ALL of the props.
 * If a test object is provided the full featured client will be rendered. If not the simpler dialog.
 * Rules that were created with the full featured client can also be loaded in the simpler client.
 * @param {RuleEngineJSUI} props
 * @param {boolean} [props.isOpenCreateRule] - Will be forwarded to the SimpleRule component to open / close the Create Rule Dialog
 * @param {Function} [props.onCloseCreateRule] - Will be called from the SimpleRule component to close the Create Rule Dialog.
 * @param {InputSchema[]} props.schemas - Different JSON schemas for selecting properties
 * @param {boolean} props.isSaveRule - If true, the final rule can be saved with name and descriptiion
 * @param {Function} props.handleSaveRule - Hand over the created rule to the application that is using this component
 * @param {number} [props.maxLevel] - If provided, the JSON schema is only analized up to the given depht
 * @param {object} [props.testObj] - A created rule will be tested against this object
 * @param {ArchiveRule[]} [props.archivedRules] - A list of already exiting rules to select from when adding a new rule
 * @param {Function} props.handleUpdateRule - Calls the function to update the rule in the list of "archived" rules
 * @param {ArchivedRule} [props.archivedRule] - If given, the user wants to edit an existing rule
 * @param {Addon[]} [props.addons] - A list of addons that can be used to customize the SimpleRule Dialog
 *
 * @returns {JSX.Element}
 */
export default function RuleEngineJSUI({ schemas, isSaveRule, handleSaveRule, handleUpdateRule, isOpenCreateRule, onCloseCreateRule, maxLevel, testObj, archivedRules, archivedRule, addons, }: RuleEngingJSUIProps): JSX.Element;
export {};
