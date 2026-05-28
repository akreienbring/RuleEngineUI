/*
  Author: André Kreienbring
  One of the main components of the rule designer. Uses JSON schemas to select properties and finally create a rule
  Concept:
  Build the internal representation of a RuleExpression, where subrules are objects that hold information about the subrule.
  E.g. {and: [eq:[property, value]], [or:[neq:[property, value]]]} is internally maintained as {and: [eq:[property, value]], [subrule: [subrule.rule]]} 
  where subrule.rule is the or rule.
  When first created the rule is valid because: Depending on the JSON schema and the test object, only valid properties and operators are selected and set.
*/

import { type JSX, useState, useEffect } from "react";
import type { ArchivedRule, InputSchema } from "@src/components/types/public";
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
  findSubrule,
  validateRule,
  transformRule,
  copySubrules,
} from "@src/components/utils/rule-utils-ts";
import { List, Box, TextField, Stack } from "@mui/material";
import { DoNotDisturbOnRounded, VerifiedRounded } from "@mui/icons-material";
import { createProperties } from "@src/components/utils/property-utils";

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
  const [properties, setProperties] = useState<PropertyBuffer>(
    createProperties(schemas[schemaIndex].schema, testObj, null),
  );
  const [topRule, setTopRule] = useState<RuleExpression>({
    and: [],
  });
  const [topOperator, setTopOperator] = useState<Operator>("and");
  const [selectedRule, setSelectedRule] = useState<RuleIndex>({
    uuid: "",
    operator: "and",
  });
  const [isShowRuleText, setIsShowRuleText] = useState(false);
  const [isTestValid, setIsTestValid] = useState(false);

  /**
   * When the component is first loaded, a rule is created and tested based on the initial selected JSON schema and the given test object.
   * Runs only once when the component is loaded for the first time, because the dependencies of the useEffect are empty.
   */
  useEffect(() => {
    const newRule = buildRule(properties, "and") as RuleExpression;
    setTopRule(newRule);

    const testResult = validateRule("and", testObj, newRule);
    setIsTestValid(testResult.success);
  }, []);

  /**
   * Called from the toolbar when a different schema is selected.
   * Sets the new schema index. This will update the property list due to the useEffect in PropertyList
   * and build a new rule based on the new schema.
   * @param {number} schemaIndex - The index of the newly selected schema
   */
  const handleSchemaSelect = (schemaIndex: number) => {
    setSchemaIndex(schemaIndex);
    const newProperties = createProperties(
      schemas[schemaIndex].schema,
      testObj,
      null,
    );
    setProperties(newProperties);

    const newRule = buildRule(newProperties, "and") as RuleExpression;
    setTopRule(newRule);
    setTopOperator("and");
    setSelectedRule({ uuid: "", operator: "and" });

    const testResult = validateRule("and", testObj, newRule);

    setIsTestValid(testResult.success);
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
   * @param {ArchivedRule} archivedRule - the archived rule to load
   */
  const handleLoadRule = (archivedRule: ArchivedRule) => {
    setSelectedRule({ uuid: "", operator: archivedRule.operator });
    setTopOperator(archivedRule.operator);
    setTopRule(archivedRule.rule);
    setProperties(
      createProperties(
        schemas[archivedRule.schemaIndex].schema,
        null,
        archivedRule,
      ),
    );
    setSchemaIndex(archivedRule.schemaIndex);

    const testResult = validateRule(
      archivedRule.operator,
      testObj,
      archivedRule.rule,
    );
    setIsTestValid(testResult.success);
  };

  /**
   * Used in the toolbar to toggle between JSON / object presentation of the created rule
   */
  const toggleShowRuleText = () => {
    setIsShowRuleText(!isShowRuleText);
  };

  /**
   * If the currently selected rule was updated, update the rule (in the top rule).
   * The top rule and subrules must be treated differently.
   * Tests the rule against the given test object
   * @param {RuleExpression} newRule
   * @param {Operator} [newTopOperator] - Only needed if the top rule was updated and the operator of the top rule was changed.
   */
  const updateSelectedRule = (
    newRule: RuleExpression,
    newTopOperator?: Operator,
  ) => {
    const newTopRule = { ...topRule };
    let testResult: EvaluationResult;
    const finalTopOperator =
      typeof newTopOperator !== "undefined" ? newTopOperator : topOperator;

    if (!selectedRule.uuid) {
      //copy all subrules from the old toprule to the new toprule with the new operator
      const oldOperators = topRule[topOperator] as object[];
      const newOperators: unknown[] = copySubrules(
        oldOperators,
        newRule[selectedRule.operator],
      );

      const newTopRule: RuleExpression = { [finalTopOperator]: newOperators };
      console.log(
        "new toprule after adding subrules",
        JSON.stringify(newTopRule),
      );

      setTopRule(newTopRule);

      testResult = validateRule(finalTopOperator, testObj, newTopRule);
      setIsTestValid(testResult.success);
    } else {
      const searchResult = findSubrule(
        topRule[topOperator] as object[],
        selectedRule.uuid,
      ) as RuleSearchResult;

      const subrule = searchResult!.subrule;

      //copy all subrules from the old subrule to the new subrule with the new operator
      const oldOperators = subrule.rule[subrule.operator] as object[];
      const newOperators: unknown[] = copySubrules(
        oldOperators,
        newRule[selectedRule.operator],
      );

      const newSubRule: RuleExpression = {
        [selectedRule.operator]: newOperators,
      };
      console.log(
        "new subrule after adding subrules",
        JSON.stringify(newSubRule),
      );

      subrule.rule = newSubRule;
      testResult = validateRule(subrule.operator, testObj, newSubRule);
      subrule.isValid = testResult.success;

      testResult = validateRule(finalTopOperator, testObj, newTopRule);

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
      const searchResult = findSubrule(
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
          if (
            operatorName !== "subrule" &&
            typeof properties[operatorValue[0]] !== "undefined"
          ) {
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

    const searchResult = findSubrule(
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
      const searchResult = findSubrule(
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

    const newRule: RuleExpression = { [newOperator]: [] };
    let testResult: EvaluationResult;

    if (!selectedRule.uuid) {
      //copy all operators from the old rule to the new rule with the new operator
      newRule[newOperator] = topRule[topOperator];
      setTopOperator(newOperator);
      setTopRule(newRule);

      testResult = validateRule(newOperator, testObj, newRule);
      setIsTestValid(testResult.success);
    } else {
      const searchResult = findSubrule(
        topRule[topOperator] as object[],
        selectedRule.uuid,
      ) as RuleSearchResult;

      const subrule = searchResult.subrule;
      //copy all operators from the old rule to the new rule with the new operator
      newRule[newOperator] = subrule.rule[subrule.operator];
      subrule.rule = newRule;
      subrule.operator = newOperator;

      //even if the operator of a subrule changes, it must be copied to the top rule to update the rule text and test result
      const newTopRule: RuleExpression = { ...topRule };
      setTopRule(newTopRule);

      testResult = validateRule(subrule.operator, testObj, subrule.rule);
      subrule.isValid = testResult.success;

      testResult = validateRule(topOperator, testObj, topRule);
      setIsTestValid(testResult.success);
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
        validateProperty(property, property.value1);

        if (
          typeof property.value1Error !== "undefined" ||
          (property.operators[0] === "between" &&
            typeof property.value2Error !== "undefined")
        )
          valid = false;
      }
    });

    setProperties(properties);

    const newRule = buildRule(
      properties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
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
            height: 600,
            minWidth: 900,
            overflow: "auto",
            p: 2,
            borderRadius: 1,
          }}
        >
          <PropertyList
            testObj={testObj}
            maxLevel={maxLevel}
            properties={properties}
            updateProperties={updateProperties}
          />
        </Box>
        <BorderBox title="Rule" sx={{ pl: 2 }}>
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
                  key={createUUID()}
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
          sx={{ pl: 3 }}
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
