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
import type {
  ArchivedRule,
  InputSchema,
  TestObject,
} from "@src/components/types/public";
import { EvaluationResult, RuleExpression } from "rule-engine-js";
import RuleList from "./rule-list";
import PropertyList from "../general/property-list";
import CreateRuleToolbar from "./create-rule-toolbar";
import { createUUID } from "@src/components/utils/general";
import {
  buildRule,
  hasStateOperator,
} from "@src/components/utils/rule-utils-js";
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
import {
  createProperties,
  createFirstEval,
  findSchemaById,
} from "@src/components/utils/property-utils";
import { useValidation } from "@src/components/general/use-validation";

interface CreateRuleProps {
  schemas: InputSchema[];
  testObjects: TestObject[];
  maxLevel?: number;
  archivedRules: ArchivedRule[];
  prepareSaveRule: (
    rule: RuleExpression,
    operator: Operator,
    schemaId: number,
    firstEval: object,
  ) => void;
}

/**
 * Presents all utilities to create a rule useable with the JSON rule engine.
 * @param {CreateRuleProps} props
 * @param {InputSchema[]} props.schemas - A list of JSON schemas to build a rule for. Schemas must be provided by the user of the rule designer
 * @param {object} props.testObjects - A created rule will be tested against one of these objects
 * @param {number} [props.maxLevel] - If provided, the JSON schema is only analized up to the given depht
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {Function} props.prepareSaveRule - Hand over the created rule to the application that is using this component
 * @returns {JSX.Element} The UI used to creat a rule for a certain JSON schema
 */
export default function CreateRule({
  schemas,
  testObjects,
  maxLevel,
  archivedRules,
  prepareSaveRule,
}: CreateRuleProps): JSX.Element {
  const { validateProperties } = useValidation();
  const [schema, setSchema] = useState(schemas[0]);
  const [properties, setProperties] = useState<PropertyBuffer>(
    createProperties(schemas[0].jsonSchema, testObjects[0].testObject, null),
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
  const [isStatefulRule, setIsStatefulRule] = useState(false);
  const [testObjectId, setTestObjectId] = useState(0);

  /**
   * When the component is first loaded, a rule is created and tested based on the initial selected JSON schema and the given test object.
   * Runs only once when the component is loaded for the first time, because the dependencies of the useEffect are empty.
   */
  useEffect(() => {
    const newRule = buildRule(properties, "and") as RuleExpression;
    setTopRule(newRule);

    checkTopRule("and", newRule, 0);
  }, []);

  /**
   * Checks if the top rule is valid regarding the given test object.
   * Also checks if the top rule is a stateful rule.
   * @param {Operator} operator - The operator of the top rule
   * @param {RuleExpression} rule - The top rule
   * @param {number} tObjId - The id of the test object
   * @param {PropertyBuffer} [newProperties] - If given, uses this properties instead the state properties (If a rule was loaded)
   */
  const checkTopRule = (
    operator: Operator,
    rule: RuleExpression,
    tObjId: number,
    newProperties?: PropertyBuffer,
  ) => {
    const isStatefulRule = hasStateOperator(rule[operator] as RuleExpression[]);
    setIsStatefulRule(isStatefulRule);

    if (isStatefulRule) {
      /*
        Create the object for the first evaluation of a stateful rule.
        Stateful rules need a first evaluation to detect changes.
        NOTE: this also works if firstEvel is an empty object {}
      */
      const firstEval = newProperties
        ? createFirstEval(newProperties)
        : createFirstEval(properties);

      validateRule(
        rule,
        operator,
        testObjects[tObjId].testObject,
        firstEval,
      ).then((testResult) => {
        setIsTestValid(testResult.success);
      });
    } else {
      validateRule(rule, operator, testObjects[tObjId].testObject).then(
        (testResult) => {
          setIsTestValid(testResult.success);
        },
      );
    }
  };

  /**
   * Called from the toolbar when a different test object is selected.
   * and build a new rule based on the new schema.
   * @param {number} tObjId - The id of the newly selected test object
   */
  const handleTestObjectSelect = (tObjId: number) => {
    setTestObjectId(tObjId);
    const newProperties = createProperties(
      schema.jsonSchema,
      testObjects[tObjId].testObject,
      null,
    );
    setProperties(newProperties);

    const newRule = buildRule(newProperties, topOperator) as RuleExpression;
    setTopRule(newRule);

    checkTopRule(topOperator, newRule, tObjId);
  };

  /**
   * Called from the toolbar when a different schema is selected.
   * Sets the new schema index. This will build a new rule based on the new schema.
   * @param {number} schemaId - The id of the newly selected schema
   */
  const handleSchemaSelect = (schemaId: number) => {
    const newSchema = findSchemaById(schemas, schemaId);
    setSchema(newSchema);
    const newProperties = createProperties(
      newSchema.jsonSchema,
      testObjects[testObjectId].testObject,
      null,
    );
    setProperties(newProperties);

    const newRule = buildRule(newProperties, "and") as RuleExpression;
    setTopRule(newRule);
    setTopOperator("and");
    setSelectedRule({ uuid: "", operator: "and" });

    checkTopRule("and", newRule, testObjectId);
  };

  /**
   * Call the method from the implementing application to hand over the rule
   * Function is called from the create-root Toolbar
   */
  const handleSaveToprule = () => {
    /*
      If the rule is a statfule rule, construct an object from the given values for the first evaluation.
    */
    let firstEval: any = {};
    if (isStatefulRule) {
      //create the object for the first evaluation of a stateful rule
      firstEval = createFirstEval(properties);
    }

    prepareSaveRule(
      transformRule(topOperator, topRule),
      topOperator,
      schema.schemaId,
      firstEval,
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
    const newSchema = findSchemaById(schemas, archivedRule.schemaId);
    const newProperties = createProperties(
      newSchema.jsonSchema,
      null,
      archivedRule,
    );
    setProperties(newProperties);
    setSchema(newSchema);

    checkTopRule(
      archivedRule.operator,
      archivedRule.rule,
      testObjectId,
      newProperties,
    );
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
      /*
      console.log(
        "new toprule after adding subrules",
        JSON.stringify(newTopRule),
      );
      */

      setTopRule(newTopRule);
      checkTopRule(finalTopOperator, newTopRule, testObjectId);
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
      /*
      console.log(
        "new subrule after adding subrules",
        JSON.stringify(newSubRule),
      );
      */

      subrule.rule = newSubRule;
      validateRule(
        newSubRule,
        subrule.operator,
        testObjects[testObjectId].testObject,
      ).then((testResult) => {
        subrule.isValid = testResult.success;
      });

      checkTopRule(finalTopOperator, newTopRule, testObjectId);
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
      property.isChecked = false;
    });

    // check only the properties that are used in the selected rule
    ruleOperators.forEach((operator, index) => {
      Object.entries(operator as object).forEach(
        ([operatorName, operatorValue]) => {
          if (
            operatorName !== "subrule" &&
            typeof properties[operatorValue[0]] !== "undefined"
          ) {
            properties[operatorValue[0]].isChecked = true;
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

    checkTopRule(topOperator, newTopRule, testObjectId);
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
    checkTopRule(topOperator, newTopRule, testObjectId);
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
      property.isChecked = property.origChecked;
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

      checkTopRule(newOperator, newRule, testObjectId);
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

      validateRule(
        subrule.rule,
        subrule.operator,
        testObjects[testObjectId].testObject,
      ).then((testResult) => {
        subrule.isValid = testResult.success;
      });

      checkTopRule(topOperator, topRule, testObjectId);
    }
  };

  /**
   * Called when a property is added/removed/changed. (Including its operator)
   * Builds the rule based the properties and the top operator
   * @param {PropertyBuffer} properties - The changed properties
   */
  const updateProperties = (properties: PropertyBuffer) => {
    validateProperties(properties);

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
        schema={schema}
        testObjects={testObjects}
        testObjectId={testObjectId}
        operator={selectedRule.operator}
        isShowRuleText={isShowRuleText}
        archivedRules={archivedRules}
        handleSchemaSelect={handleSchemaSelect}
        handleTestObjectSelect={handleTestObjectSelect}
        handleResetAll={handleResetAll}
        handleRuleOperatorChange={handleRuleOperatorChange}
        toggleShowRuleText={toggleShowRuleText}
        handleSaveToprule={handleSaveToprule}
        handleLoadRule={handleLoadRule}
      />
      <Stack direction="row" spacing={1}>
        <BorderBox
          title="Schema Properties"
          sx={{
            height: 700,
            minWidth: 950,
            overflow: "auto",
            p: 2,
          }}
        >
          <PropertyList
            isSimple={false}
            maxLevel={maxLevel}
            properties={properties}
            updateProperties={updateProperties}
          />
        </BorderBox>
        <BorderBox
          title={isStatefulRule ? "Stateful Rule" : "Rule"}
          sx={{ pl: 2, height: 700, width: "fit-content", overflow: "auto" }}
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
                schemas={schemas}
                schema={schema}
                handleSelectedRuleChange={handleSelectedRuleChange}
                handleAddRule={handleAddRule}
                handleDeleteRule={handleDeleteRule}
              />
            </List>
          )}
        </BorderBox>

        <BorderBox
          icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
          title={testObjects[testObjectId].name}
          isValid={isTestValid}
          sx={{ height: 700, pl: 3, miWidth: 160, overflow: "auto" }}
        >
          <ObjectList obj={testObjects[testObjectId].testObject} />
        </BorderBox>
      </Stack>
    </Box>
  );
}
