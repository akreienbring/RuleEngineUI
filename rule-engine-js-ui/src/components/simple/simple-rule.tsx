/*
  Author: André Kreienbring
  This "assistant" guides the user through the process of creating a simple rule.
  It offers far less functions then the full blown create rule UI.
*/
import { type JSX, useState, useEffect } from "react";
import { RuleExpression } from "rule-engine-js";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchemaSelect from "@src/components/general/schema-select";
import LogicSelect from "@src/components/general/logic-select";
import SimplePropertyList from "./simple-property-list";
import SimpleRuleList from "./simple-rule-list";
import { createProperties } from "@src/components/utils/property-utils";
import { buildRule } from "@src/components/utils/rule-utils-js";
import { validateProperty } from "@src/components/utils/property-utils";
import { restoreSubrules } from "@src/components/utils/rule-utils-ts";

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
export default function SimpleRule({
  isOpenRule,
  onCloseRule,
  schemas,
  isSaveRule,
  addons,
  handleSaveRule,
  handleUpdateRule,
  archivedRule,
}: SimpleRuleProps): JSX.Element {
  const [schemaIndex, setSchemaIndex] = useState(
    typeof archivedRule !== "undefined" ? archivedRule.schemaIndex : 0,
  );
  const [properties, setProperties] = useState<PropertyBuffer>(
    typeof archivedRule !== "undefined"
      ? createProperties(schemas[schemaIndex].schema, archivedRule)
      : createProperties(schemas[schemaIndex].schema),
  );
  const [topRule, setTopRule] = useState<RuleExpression>(
    typeof archivedRule !== "undefined"
      ? { [archivedRule.operator]: archivedRule.rule[archivedRule.operator] }
      : {
          and: [],
        },
  );
  const [topOperator, setTopOperator] = useState<Operator>(
    typeof archivedRule !== "undefined" ? archivedRule.operator : "and",
  );
  const [ruleName, setRuleName] = useState(
    typeof archivedRule !== "undefined" ? archivedRule.name : "",
  );
  const [ruleDescription, setRuleDescription] = useState(
    typeof archivedRule !== "undefined" ? archivedRule.description : "",
  );
  const [isPropertiesValid, setIsPropertiesValid] = useState(
    typeof archivedRule !== "undefined" ? true : false,
  );
  const [isFormValid, setIsFormValid] = useState(
    typeof archivedRule !== "undefined" ? true : false,
  );

  useEffect(() => {
    onOpen();
  }, [archivedRule]);

  /**
   * When the archivedRule changes, then the dialog is opened and the states are set according to the archived rule.
   * As the rule may contain subrules, these are restored with the restoreSubrules function to the internal rule format with subrules.
   * If no archived rule is given, then the states are set to the default values for creating a new rule.
   */
  const onOpen = () => {
    if (isOpenRule) {
      if (typeof archivedRule === "undefined") {
        console.log(`Setting states for a new rule`);
        setSchemaIndex(0);
        setProperties(createProperties(schemas[schemaIndex].schema));
        setRuleName("");
        setRuleDescription("");
        setIsPropertiesValid(false);
        setIsFormValid(false);
        setTopOperator("and");
        setTopRule({
          and: [],
        });
      } else {
        console.log(`Setting states for rule ${archivedRule.name}`);
        setSchemaIndex(archivedRule.schemaIndex);
        setProperties(
          createProperties(
            schemas[archivedRule.schemaIndex].schema,
            archivedRule,
          ),
        );
        setRuleName(archivedRule.name);
        setRuleDescription(archivedRule.description);
        setIsPropertiesValid(true);
        setIsFormValid(true);
        const subOperators = restoreSubrules(
          archivedRule.rule[archivedRule.operator] as object[],
          [],
        );
        const loadedRule: RuleExpression = {
          [archivedRule.operator]: subOperators,
        };
        setTopOperator(archivedRule.operator);
        setTopRule(loadedRule);
      }
    }
  };

  /**
   * If the Rule Dialog is closed, this function is called. It resets the properties
   * and closes the dialog.
   */
  const onClose = () => {
    console.log("Resetting states");
    setSchemaIndex(0);
    setProperties(createProperties(schemas[schemaIndex].schema));
    setRuleName("");
    setRuleDescription("");
    setIsPropertiesValid(false);
    setIsFormValid(false);
    setTopOperator("and");
    setTopRule({
      and: [],
    });
    onCloseRule();
  };

  /**
   * The Textfield that allow entering a name and a description
   * are controlled input elements. These functions are called on every change.
   * @param event
   */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setRuleName(name);
    setIsFormValid((name !== "" || ruleName !== "") && ruleDescription !== "");
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const description = event.target.value;
    setRuleDescription(description);
    setIsFormValid(
      (description !== "" || ruleDescription !== "") && ruleName !== "",
    );
  };

  /**
   * Closes the dialog and hands over the created rule to the calling application.
   * Calls the method from the implementing application to hand over the rule.
   * The id is not yet existant and hence set to 0
   */
  const handleSave = () => {
    //no need to transform the rule. The simple interface does'nt create subrules
    const createdRule: ArchivedRule = {
      ruleid: 0,
      name: ruleName,
      description: ruleDescription,
      schema: schemas[schemaIndex].name,
      schemaIndex: schemaIndex,
      operator: topOperator,
      rule: topRule,
    };
    handleSaveRule(createdRule);
    onClose();
  };

  /**
   * Closes the dialog and hands over the updated rule to the calling application.
   * So that it can be updated in the array of archived rules
   * @param {number} ruleid - The id of the rule to update
   */
  const handleUpdate = (ruleid: number) => {
    const archivedRule: ArchivedRule = {
      ruleid,
      name: ruleName,
      description: ruleDescription,
      schema: schemas[schemaIndex].name,
      schemaIndex: schemaIndex,
      operator: topOperator,
      rule: topRule,
    };
    handleUpdateRule(archivedRule);
    onClose();
  };

  /**
   * When the schema is changed, then the property buffer must be rebuild
   * @param {number} schemaIndex - The new schema index.
   */
  const handleSchemaSelect = (schemaIndex: number) => {
    setSchemaIndex(schemaIndex);
    setProperties(createProperties(schemas[schemaIndex].schema));
    setTopRule({
      and: [],
    });
  };

  /**
   * Called when a property is added/removed/changed. (Including its operator)
   * Builds the rule based the properties and the top operator
   * @param {PropertyBuffer} properties - The changed properties
   */
  const updateProperties = (properties: PropertyBuffer) => {
    let valid = true;
    Object.values(properties).forEach((property) => {
      if (property.checked) {
        if (property.checked) {
          validateProperty(property, property.value1.toString());

          if (
            typeof property.value1Error !== "undefined" ||
            (property.operators[0] === "between" &&
              typeof property.value2Error !== "undefined")
          )
            valid = false;
        }
      }
    });
    setIsPropertiesValid(valid);

    setProperties(properties);
    const newTopRule = buildRule(properties, topOperator) as RuleExpression;
    setTopRule(newTopRule);
  };

  /**
   * Changes the operator of the rule. (and, or, not)
   * @param {Event} event - The event with the new operarator.
   */
  const handleRuleOperatorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newOperator = event.target.value as Operator;

    //copy all operators from the old rule to the new rule with the new operator
    const newRule: RuleExpression = { [newOperator]: [] };
    newRule[newOperator] = topRule[topOperator];
    setTopRule(newRule);
    setTopOperator(newOperator);
  };

  let accordions: Addon[] = [];

  if (typeof addons !== "undefined" && addons.length > 0) {
    accordions = accordions.concat(addons);
  }

  if (isSaveRule) {
    accordions.push({
      summary: "Add Name and Description",
      selected: "",
      details: (
        <Stack>
          <TextField
            value={ruleName}
            onChange={handleNameChange}
            autoFocus
            required
            size="small"
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
            size="small"
            id="description"
            name="description"
            label="Description"
            fullWidth
            variant="filled"
          />
        </Stack>
      ),
    });
  }

  return (
    <Dialog open={isOpenRule} onClose={onClose} maxWidth="md">
      <DialogTitle>
        {typeof archivedRule !== "undefined" ? "Edit" : "Create"} Rule
      </DialogTitle>
      <DialogContent>
        <Accordion defaultExpanded>
          <AccordionSummary>
            <Typography component="span">What is the Trigger?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SchemaSelect
              schemas={schemas}
              schemaIndex={schemaIndex}
              handleSchemaSelect={handleSchemaSelect}
            />
            <SimplePropertyList
              properties={properties}
              updateProperties={updateProperties}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          disabled={topRule[topOperator].length === 0 || !isPropertiesValid}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction="row"
              sx={{ width: 1, justifyContent: "space-between" }}
            >
              <Typography>All, One or None?</Typography>
              <Typography>
                {topOperator === "and"
                  ? "All"
                  : topOperator === "or"
                    ? "One"
                    : "None"}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction="row"
              sx={{ width: 1, justifyContent: "space-between" }}
            >
              <LogicSelect
                operator={topOperator}
                handleRuleOperatorChange={handleRuleOperatorChange}
              />
              <SimpleRuleList topRule={topRule} topOperator={topOperator} />
            </Stack>
          </AccordionDetails>
        </Accordion>
        {accordions.map((accordion, index) => (
          <Accordion
            disabled={topRule[topOperator].length === 0 || !isPropertiesValid}
            key={`AC_${index}`}
          >
            <AccordionSummary
              key={`AS_${index}`}
              expandIcon={<ExpandMoreIcon />}
            >
              <Stack
                direction="row"
                sx={{ width: 1, justifyContent: "space-between" }}
              >
                <Typography>{accordion.summary}</Typography>
                <Typography>{accordion.selected}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails key={`AD_${index}`}>
              {accordion.details}
            </AccordionDetails>
          </Accordion>
        ))}
        <Accordion
          defaultExpanded
          disabled={
            topRule[topOperator].length === 0 ||
            !isPropertiesValid ||
            (!isFormValid && isSaveRule)
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">
              {typeof archivedRule !== "undefined"
                ? "Update the Rule"
                : "Save the Rule"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                color:
                  topRule[topOperator].length === 0 ||
                  !isPropertiesValid ||
                  (!isFormValid && isSaveRule)
                    ? "text.disabled"
                    : "text.enabled",
              }}
            >
              {typeof archivedRule !== "undefined"
                ? "to save your changes"
                : "By saving the rule it will be available for further usage"}
            </Typography>
          </AccordionDetails>
          <AccordionActions>
            {typeof archivedRule !== "undefined" ? (
              <Button
                disabled={
                  topRule[topOperator].length === 0 ||
                  !isPropertiesValid ||
                  (!isFormValid && isSaveRule)
                }
                onClick={() => handleUpdate(archivedRule.ruleid)}
              >
                Update
              </Button>
            ) : (
              <Button
                disabled={
                  topRule[topOperator].length === 0 ||
                  !isPropertiesValid ||
                  (!isFormValid && isSaveRule)
                }
                onClick={handleSave}
              >
                Save
              </Button>
            )}
          </AccordionActions>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
