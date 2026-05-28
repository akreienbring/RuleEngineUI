/*
  Author: André Kreienbring
  A UI to create rules for https://github.com/crafts69guy/rule-engine-js
  see for comparison:
  https://www.json-rule-editor.com, https://github.com/cachecontrol/json-rules-engine
  https://github.com/ali-master/rule-engine
*/

import { type JSX, useState } from "react";
import type {
  ArchivedRule,
  Addon,
  InputSchema,
} from "@src/components/types/public";
import CreateRule from "./full/create-rule";
import SimpleRule from "./simple/simple-rule";
import {
  CreateRuleErrorFallback,
  SimpleRuleErrorFallback,
} from "@src/components/general/error";
import { RuleExpression } from "rule-engine-js";
import { ErrorBoundary } from "react-error-boundary";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";

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
export default function RuleEngineJSUI({
  schemas,
  isSaveRule,
  handleSaveRule,
  handleUpdateRule,
  isOpenCreateRule,
  onCloseCreateRule,
  maxLevel,
  testObj,
  archivedRules,
  archivedRule,
  addons,
}: RuleEngingJSUIProps): JSX.Element {
  const [ruleToSave, setRuleToSave] = useState<ArchivedRule | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  /**
   * The Textfields that allow entering a name and a description
   * are controlled input elements. These functions are called on every change.
   * @param {Event} event - The ReactChangeEvent is fired when an input was changed.
   */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setRuleName(name);
    setIsFormValid(name !== "" && ruleDescription !== "");
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const description = event.target.value;
    setRuleDescription(description);
    setIsFormValid(description !== "" && ruleName !== "");
  };

  /**
   * Prepare the handover of a rule to the implementing application
   * Function is called from the create-root Toolbar and opens a dialog
   * to input name and description if isSaveRule is true.
   * @param {RuleExpression} rule - The rule that must be saved
   * @param {Operator} operator - The top operator of the rule (and, or, not)
   * @param {number} schemaIndex - The index of the schema that was used to build the rule
   */
  const prepareSaveRule = (
    rule: RuleExpression,
    operator: Operator,
    schemaIndex: number,
  ) => {
    if (isSaveRule) {
      //this will open the dialog that provides inputs for name and description
      setRuleToSave({
        ruleid: 0,
        name: "",
        description: "",
        schema: schemas[schemaIndex].name,
        schemaIndex,
        operator,
        rule,
      });
    } else {
      //here the rule is saved without name and description
      const archivedRule: ArchivedRule = {
        ruleid: 0,
        name: "",
        description: "",
        schema: schemas[ruleToSave!.schemaIndex].name,
        schemaIndex: ruleToSave!.schemaIndex,
        operator: ruleToSave!.operator,
        rule: ruleToSave!.rule,
      };
      handleSaveRule(archivedRule);
    }
  };

  /**
   * Closes the save rule dialog
   */
  const handleClose = () => {
    setRuleToSave(null);
  };

  /**
   * Finalize the rule that will be saved with name and description from the dialog.
   * Call the method from the implementing application to hand over the rule
   * Function is called from the create-root Toolbar
   * @param {Event} event - The SubmitEvent is fired when the form is submitted.
   */
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const name = formJson.name;
    const description = formJson.description;

    const archivedRule: ArchivedRule = {
      ruleid: 0,
      name,
      description,
      schema: schemas[ruleToSave!.schemaIndex].name,
      schemaIndex: ruleToSave!.schemaIndex,
      operator: ruleToSave!.operator,
      rule: ruleToSave!.rule,
    };
    handleSaveRule(archivedRule);
    handleClose();
  };

  return (
    <Box sx={{ m: 2 }}>
      {typeof testObj !== "undefined" &&
      typeof archivedRules !== "undefined" ? (
        <ErrorBoundary FallbackComponent={CreateRuleErrorFallback}>
          <CreateRule
            schemas={schemas}
            testObj={testObj}
            maxLevel={maxLevel}
            archivedRules={archivedRules}
            prepareSaveRule={prepareSaveRule}
          />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary FallbackComponent={SimpleRuleErrorFallback}>
          <SimpleRule
            isOpenRule={
              typeof isOpenCreateRule !== "undefined" ? isOpenCreateRule : true
            }
            onCloseRule={
              typeof onCloseCreateRule !== "undefined"
                ? onCloseCreateRule
                : () => {}
            }
            schemas={schemas}
            isSaveRule={isSaveRule}
            addons={addons}
            handleSaveRule={handleSaveRule}
            handleUpdateRule={handleUpdateRule}
            archivedRule={archivedRule}
          />
        </ErrorBoundary>
      )}
      <Dialog
        open={ruleToSave !== null}
        onClose={handleClose}
        disableRestoreFocus
      >
        <DialogTitle>Save Rule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a name and a description for this rule!
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              value={ruleName}
              onChange={handleNameChange}
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              fullWidth
              variant="filled"
            />
            <TextField
              value={ruleDescription}
              onChange={handleDescriptionChange}
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              fullWidth
              variant="filled"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!isFormValid}
            type="submit"
            form="subscription-form"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
