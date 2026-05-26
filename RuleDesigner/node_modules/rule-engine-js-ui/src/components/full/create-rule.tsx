/*
  Author: André Kreienbring
  One of the main components of the rule designer. Uses JSON schemas to select properties and finally create a rule
  Concept:
  Build the internal representation of a RuleExpression, where subrules are objects that hold information about the subrule.
  E.g. {and: [eq:[property, value]], [or:[neq:[property, value]]]} is internally maintained as {and: [eq:[property, value]], [subrule: [subrule.rule]]} 
  where subrule.rule is the or rule.
  When first created the rule is valid because: Depending on the JSON schema and the test object, only valid properties and operators are selected and set.
*/

import { type JSX, useState } from "react";
import { EvaluationResult, RuleExpression } from "rule-engine-js";
import RuleList from "./rule-list";
import PropertyList from "./property-list";
import CreateRuleToolbar from "./create-rule-toolbar";
import { createUUID } from "@src/components/utils/general";
import { buildRule } from "@src/components/utils/rule-utils-js";
import { validateProperty } from "@src/components/utils/property-utils";
import ObjectList from "./object-list";
import BorderBox from "./border-box";
import {
  findRule,
  validateRule,
  transformRule,
} from "@src/components/utils/rule-utils-ts";
import { List, Box, TextField, Stack } from "@mui/material";
import { DoNotDisturbOnRounded, VerifiedRounded } from "@mui/icons-material";

interface CreateRuleProps {
  schemas: InputSchema[];
  testObj: object;
  maxLevel?: number;
  archivedRules: ArchivedRule[];
  prepareSaveRule: (
    rule: RuleExpression,
    operator: Operator,
    schmemaIndex: number,
  ) => void;
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
export default function CreateRule({
  schemas,
  testObj,
  maxLevel,
  archivedRules,
  prepareSaveRule,
}: CreateRuleProps): JSX.Element {
  const [schemaIndex, setSchemaIndex] = useState(0);
  const [properties, setProperties] = useState<PropertyBuffer>({});
  const [topRule, setTopRule] = useState<RuleExpression>({
    and: [],
  });
  const [topOperator, setTopOperator] = useState<Operator>("and");
  const [selectedRule, setSelectedRule] = useState<RuleIndex>({
    uuid: "",
    operator: "and",
  });
  const [isShowRuleText, setIsShowRuleText] = useState(false);
  const [isTestValid, setIsTestValid] = useState(true);
  const [isLoadedRule, setIsLoadedRule] = useState(false);

  const handleSchemaSelect = (schemaIndex: number) => {
    setSchemaIndex(schemaIndex);
  };

  /**
   * Call the method from the implementing application to hand over the rule
   * Function is called from the create-root Toolbar
   */
  const handleSaveToprule = () => {
    transformRule(topOperator, topRule);
    prepareSaveRule(
      transformRule(topOperator, topRule),
      topOperator,
      schemaIndex,
    );
  };

  /**
   * Called from the toolbar.
   * Load a rule from the list of existing rules as the new top rule
   * @param {RuleExpression} rule - the top that replaces the top rule
   * @param {Operator} operator - the operator of the new top rule
   * @param {number} schemaIndex - The index of the schema the rule was created for
   */
  const handleLoadRule = (
    rule: RuleExpression,
    operator: Operator,
    schemaIndex: number,
  ) => {
    setSelectedRule({ uuid: "", operator: operator });
    setTopOperator(operator);
    setTopRule(rule);

    /*
      TODO: This is a somehow weird way to stop resetting the rule upon a schema change due to the 
      useEffect in PropertyList
    */
    setIsLoadedRule(true);
    handleSchemaSelect(schemaIndex);

    const testResult = validateRule(operator, testObj, rule);
    setIsTestValid(testResult.success);
  };

  /**
   * Upon a change of the schema the top rule is rebuild and reset by the useEffect in the PropertyList.
   * That means that all subrules will be deletet from the new top rule.
   * The reset is NOT done if a rule was loaded! (see TODO!)
   * @param {RuleExpression} rule - The new top rule with all added properties
   */
  const handleSchemaChange = (rule: RuleExpression) => {
    /*
      TODO: This is a somehow weird way to stop resetting the rule upon a schema change due to the 
      useEffect in PropertyList
    */
    if (!isLoadedRule) {
      setSelectedRule({ uuid: "", operator: "and" });
      setTopOperator("and");
      setTopRule(rule);
      setIsTestValid(true);
    } else {
      setIsLoadedRule(false);
    }
  };

  /**
   * Used in the toolbar to toggle between JSON / object presentation of the created rule
   */
  const toggleShowRuleText = () => {
    setIsShowRuleText(!isShowRuleText);
  };

  /**
   * If the currently selected rule was updated, update the rule (in the top rule).
   * The top rule and subrules must be treated differntly.
   * Tests the rule against the given test object
   * @param {RuleExpression} newRule
   */
  const updateSelectedRule = (
    newRule: RuleExpression,
    newTopOperator?: Operator,
  ) => {
    const newTopRule = { ...topRule };
    let testResult: EvaluationResult;

    if (!selectedRule.uuid) {
      setTopRule(newRule);
      if (typeof newTopOperator !== "undefined") {
        // the top oparator was changed
        testResult = validateRule(newTopOperator, testObj, newRule);
      } else {
        testResult = validateRule(topOperator, testObj, newRule);
      }

      setIsTestValid(testResult.success);
    } else {
      const searchResult = findRule(
        topRule[topOperator] as object[],
        selectedRule.uuid,
      ) as RuleSearchResult;

      const subrule = searchResult!.subrule;

      subrule.rule = newRule;
      testResult = validateRule(subrule.operator, testObj, subrule.rule);
      subrule.isValid = testResult.success;

      testResult = validateRule(topOperator, testObj, newTopRule);

      setIsTestValid(testResult.success);
    }
  };

  /**
   * If a rule is selected from the rule list
   * select / check only the properties that are used in the selected rule
   * @param {RuleIndex} selectedRule - The new selected Rule
   */
  const handleSelectedRuleChange = (selectedRule: RuleIndex) => {
    let ruleOperators: any[] = [];

    if (!selectedRule.uuid) {
      // get the operators of the top rule
      ruleOperators = topRule[topOperator];
    } else {
      const searchResult = findRule(
        topRule[topOperator] as object[],
        selectedRule.uuid,
      ) as RuleSearchResult;

      const parentRule = searchResult.subrule.rule;
      ruleOperators = parentRule[searchResult.subrule.operator];
    }

    //unselect all properties when selecting a different rule
    Object.values(properties).forEach((property) => {
      property.checked = false;
    });

    // check only the properties that are used in the selected rule
    ruleOperators.forEach((operator, index) => {
      Object.entries(operator as object).forEach(
        ([operatorName, operatorValue]) => {
          if (operatorName !== "subrule") {
            properties[operatorValue[0]].checked = true;
          }
        },
      );
    });
    setProperties(properties);
    setSelectedRule(selectedRule);
  };

  /**
   * Called from the toolbar of a subrule. Deletes the subrule, identified by its uuid from its parent rule.
   * Note: the top rule can not be deleted.
   * @param {string} uuid - A unique Id that identifies the rule to delete
   */
  const handleDeleteRule = (uuid: string) => {
    const newTopRule: RuleExpression = { ...topRule };

    const searchResult = findRule(
      newTopRule[topOperator] as object[],
      uuid,
    ) as RuleSearchResult;

    searchResult.operators.splice(searchResult.operatorIndex, 1);

    setTopRule(newTopRule);
    handleSelectedRuleChange({ uuid: "", operator: topOperator });

    const testResult = validateRule(topOperator, testObj, newTopRule);

    setIsTestValid(testResult.success);
  };

  /**
   * Add a subrule to a rule. Top rule and subrule must be treated differently.
   * @param {Operator} operator - The operator of the new subrule (and, or, not)
   * @param {string} uuid - The unique Id of the rule where the new subrule must be added.
   */
  const handleAddRule = (
    operator: Operator,
    rule: RuleExpression,
    uuid: string,
  ) => {
    const newTopRule: RuleExpression = { ...topRule };
    let selectedOperators: any[];

    if (uuid === "") {
      // the top rule has no uuid
      selectedOperators = newTopRule[topOperator];
    } else {
      const searchResult = findRule(
        newTopRule[topOperator] as object[],
        uuid,
      ) as RuleSearchResult;
      const parentRule: RuleExpression = searchResult.subrule.rule;
      selectedOperators = parentRule[searchResult.subrule.operator];
    }

    const subrule: Subrule = {
      uuid: createUUID(),
      operator,
      isValid: false,
      rule,
    };

    selectedOperators.push({
      ["subrule"]: subrule,
    });

    handleSelectedRuleChange({ uuid: subrule.uuid, operator });

    setTopRule(newTopRule);

    const testResult = validateRule(topOperator, testObj, newTopRule);
    setIsTestValid(testResult.success);
  };

  /**
   * Called from the toolbar of this component. Used to reset all properties of the JSON schema to its original values
   */
  const handleResetAll = () => {
    const newProperties: PropertyBuffer = { ...properties };
    Object.keys(newProperties).forEach((key) => {
      const property: Property = newProperties[key];
      property.value1 = property.origValue1;
      property.operators[0] = property.origOperator;
      property.checked = property.origChecked;
    });

    setProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Called from the toolbar of the component. Changes the operator of the currently selected rule.
   * Top rule and subrules must be handled differently.
   * @param {Event} event - The event with the new operarator.
   */
  const handleRuleOperatorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newOperator = event.target.value as Operator;
    selectedRule.operator = newOperator;
    setSelectedRule(selectedRule);

    //copy all operators from the old rule to the new rule with the new operator
    const newRule: RuleExpression = { [newOperator]: [] };

    if (!selectedRule.uuid) {
      newRule[newOperator] = topRule[topOperator];
      setTopOperator(newOperator);
      setTopRule(newRule);
      updateSelectedRule(newRule, newOperator);
    } else {
      const newTopRule: RuleExpression = { ...topRule };

      const searchResult = findRule(
        newTopRule[topOperator] as object[],
        selectedRule.uuid,
      ) as RuleSearchResult;
      const subrule = searchResult.subrule;
      newRule[newOperator] = subrule.rule[subrule.operator];
      subrule.rule = newRule;
      subrule.operator = newOperator;

      setTopRule(newTopRule);
      updateSelectedRule(newRule);
    }
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
        validateProperty(property, property.value1.toString());

        if (
          typeof property.value1Error !== "undefined" ||
          (property.operators[0] === "between" &&
            typeof property.value2Error !== "undefined")
        )
          valid = false;
      }
    });

    setProperties(properties);
  };

  return (
    <Box sx={{ width: "fit-content" }}>
      <CreateRuleToolbar
        schemas={schemas}
        schemaIndex={schemaIndex}
        operator={selectedRule.operator}
        isShowRuleText={isShowRuleText}
        archivedRules={archivedRules}
        handleSchemaSelect={handleSchemaSelect}
        handleResetAll={handleResetAll}
        handleRuleOperatorChange={handleRuleOperatorChange}
        toggleShowRuleText={toggleShowRuleText}
        handleSaveToprule={handleSaveToprule}
        handleLoadRule={handleLoadRule}
      />
      <Stack direction="row" spacing={1}>
        <Box
          sx={{
            border: "1px solid grey",
            height: 650,
            minWidth: 900,
            overflow: "auto",
            pt: 2,
            borderRadius: 1,
          }}
        >
          <PropertyList
            schemas={schemas}
            schemaIndex={schemaIndex}
            testObj={testObj}
            maxLevel={maxLevel}
            properties={properties}
            selectedRule={selectedRule}
            updateProperties={updateProperties}
            handleSchemaChange={handleSchemaChange}
            updateSelectedRule={updateSelectedRule}
          />
        </Box>
        <BorderBox title="Rule">
          <Box
            sx={{
              width: "fit-content",
              overflow: "auto",
            }}
          >
            {isShowRuleText ? (
              <TextField
                variant="standard"
                multiline
                name="topRule"
                value={JSON.stringify(
                  transformRule(topOperator, topRule),
                  undefined,
                  2,
                )}
                sx={{ mb: 2, p: 1 }}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            ) : (
              <List dense disablePadding sx={{ p: 1 }}>
                <RuleList
                  key="RL_top"
                  topRule={topRule}
                  topOperator={topOperator}
                  selectedRule={selectedRule}
                  isTestValid={isTestValid}
                  uuid={""}
                  archivedRules={archivedRules}
                  schemaIndex={schemaIndex}
                  handleSelectedRuleChange={handleSelectedRuleChange}
                  handleAddRule={handleAddRule}
                  handleDeleteRule={handleDeleteRule}
                />
              </List>
            )}
          </Box>
        </BorderBox>

        <BorderBox
          icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
          title="Test Object"
          isValid={isTestValid}
        >
          <Box
            sx={{
              width: "fit-content",
              overflow: "auto",
            }}
          >
            <ObjectList obj={testObj} />
          </Box>
        </BorderBox>
      </Stack>
    </Box>
  );
}
