/*
  Author: André Kreienbring
  Concept:
  This component takes a JSON schema and builds the initial object tree and internal representation of a rule. Including subrules and a Propertybuffer
  that contains information over the operators used for every property that is contained in the JSON schema AND the given test object.
  Hence the initial rule, also created by this component, is valid, regarding the test object.
*/
import { type JSX, useState, useEffect } from "react";
import { List } from "@mui/material";
import ObjectItem from "./object-item";
import PropertyItem from "./proptery-item";
import { RuleExpression } from "rule-engine-js";
import { buildRule, getValueByPath } from "@src/components/utils/rule-utils-js";
import { getOperatorByType } from "@src/components/utils/operator-utils";
import { validateProperty } from "@src/components/utils/property-utils";

interface PropertyListProps {
  schemas: InputSchema[];
  schemaIndex: number;
  testObj: object;
  maxLevel?: number;
  properties: PropertyBuffer;
  selectedRule: RuleIndex;
  updateProperties: (properties: PropertyBuffer) => void;
  handleSchemaChange: (rule: RuleExpression) => void;
  updateSelectedRule: (
    newRule: RuleExpression,
    newTopOperator?: Operator,
  ) => void;
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
export default function PropertyList({
  schemas,
  schemaIndex,
  testObj,
  maxLevel,
  properties,
  selectedRule,
  updateProperties,
  handleSchemaChange,
  updateSelectedRule,
}: PropertyListProps): JSX.Element {
  const [expandedObjects, setExpandedObjects] = useState<boolean[]>([]);

  let elements: JSX.Element[] = [];
  let propCount = -1;
  const createdProperties: PropertyBuffer = {};
  const createdExpanded: boolean[] = [];

  useEffect(() => {
    updateProperties(createdProperties);
    const createdRule: RuleExpression = buildRule(
      createdProperties,
      "and",
    ) as RuleExpression;
    handleSchemaChange(createdRule);
  }, [schemaIndex]);

  /**
   * Expands / Collapses an Object level of the property list
   * @param {number} level
   */
  const handleExpandObject = (level: number) => {
    let newExpanded = [...expandedObjects];
    if (newExpanded.length === 0) newExpanded = createdExpanded;
    const levelStatus = newExpanded[level];
    for (let i = level; i < newExpanded.length; i++) {
      newExpanded[i] = !levelStatus;
    }
    setExpandedObjects(newExpanded);
  };

  /**
   * When the (main) operator of a property was changed, the rule must be changed accordingly.
   * @param {string} bufferKey - Identifies the property where the (main) operator was changed
   * @param {Operator} operator - The new operator used with the property.
   */
  const handlePropOperatorChange = (bufferKey: string, operator: Operator) => {
    const newProperties: PropertyBuffer = { ...properties };

    const property: Property = newProperties[bufferKey];
    property.operators[0] = operator;
    if (property.type === "null") {
      property.value1 = property.value1 ? property.value1 : "";
      property.value2 = property.value2 ? property.value2 : "";
    }
    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Called from the toolbar of a property to add an additional operator.
   * @param {string} bufferKey Identifies the property where a new opeator must be added
   */
  const handleAddOperator = (bufferKey: string) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];

    // Insert the new operator at the beginning of the properties operator list
    property.operators.unshift(
      getOperatorByType(property.type, property.value1, property.operators),
    );

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Called from the toolbar of a property. Delets a previously added operator from the property
   * @param {string} bufferKey - Identifies the property in the property buffer
   * @param {number} operatorIndex - The index of the operator in the properties operators list
   */
  const handleDeleteOperator = (bufferKey: string, operatorIndex: number) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];

    property.operators.splice(operatorIndex, 1);

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * When the comparison value of a property is changed the rule must be changed accordingly.
   * Checks also if the entered value is valid with regard to the type of the property
   * @param {string} bufferKey - Identifies the property that was changed
   * @param {string} value - The new value of the input
   * @param {boolean} isSecond - If true the input was changed on the second input. Used to handle the between operator.
   * @param {boolean} isPropertySelect - If true the property is compared with another property of the object. Otherwise with an input value.
   * @param {string} path - If isPropertySelect the path points to the property that is used to compare the property with.
   */
  const handleValueChange = (
    bufferKey: string,
    value: string,
    isSecond: boolean,
    isPropertySelect: boolean,
    path: string,
  ) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];

    if (isPropertySelect) {
      if (!isSecond) {
        property.value1 = path;
      } else {
        property.value2 = path;
      }
    } else {
      if (!isSecond) {
        validateProperty(property, value);
      } else {
        if (value !== "" && !isNaN(Number(value))) {
          property.value2 = Number(value);
        } else {
          property.value2 = "";
          property.value2Error = "Please enter a number";
        }
      }
    }

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Toggles the checked state of a property and updates the rule accordingly
   * @param {string} bufferKey - The key of the property in the PropertyBuffer to toggle
   */
  const handlePropCheck = (bufferKey: string) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];
    property.checked = !property.checked;

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Reset the given property to its original value
   * @param {string} bufferKey - Identifies the property that must be reset
   */
  const handleResetProperty = (bufferKey: string) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];
    property.value1 = property.origValue1;
    property.operators[0] = property.origOperator;

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * Moves the selected operator of a property to the first position of the properties operator list.
   * This way the operator can be edited (e.g. input a new value for comparison)
   * @param {string} bufferKey - Identifies the property to edit.
   * @param {number} index - The index of the selected operator
   */
  const handleSelectOperator = (bufferKey: string, index: number) => {
    const newProperties: PropertyBuffer = { ...properties };
    const property: Property = newProperties[bufferKey];

    // swap the operators. Move the selected to first position
    const operator = property.operators[0];
    property.operators[0] = property.operators[index];
    property.operators[index] = operator;

    updateProperties(newProperties);

    const newRule = buildRule(
      newProperties,
      selectedRule.operator,
    ) as RuleExpression;

    updateSelectedRule(newRule);
  };

  /**
   * The main / recursive function that build the HTML elements for all properties of the selected JSON schema.
   * - It also builds the initial rule by utilizing the provided test object.
   * - Builds the property buffer with all detected properties of the JSON schema.
   * @param {object} obj - An object or sub object described by the JSON schema
   * @param {string} path - Is build during the recursion to later identify a property in the property buffer.
   * @param {number} level - The level of recursion. Used to indent properties in the created list
   * @returns null But fills the list of HTML elements with the MUI components.
   */
  const createList = (obj: object, path: string, level: number) => {
    if (typeof maxLevel !== "undefined" && level >= maxLevel) return elements;
    createdExpanded.push(true);
    const isExpanded =
      typeof expandedObjects[level] === "boolean"
        ? expandedObjects[level]
        : true;
    const indent = 3;
    const subObjects: { path: string; propName: string; obj: object }[] = [];

    elements.push(
      <ObjectItem
        key={`OI_${level}`}
        level={level}
        indent={indent}
        path={path}
        isExpanded={isExpanded}
        handleExpandObject={handleExpandObject}
      />,
    );
    Object.entries(obj).forEach(([propName, propInfo]) => {
      if (!propInfo.type || propInfo.type !== "object") {
        propCount++;
        const bufferKey = path ? `${path}.${propName}` : propName;
        const testValue: unknown = getValueByPath(testObj, bufferKey);

        //convert 'integer' from JSON Schema to 'number'
        const propType: PropertyType = !propInfo.type
          ? "null"
          : propInfo.type === "integer"
            ? "number"
            : propInfo.type;

        const operator: Operator = getOperatorByType(propType, [], testValue);

        /*
          Create the initial property from the testValue.
          Don't check array types as the evaluation of the rule will fail for arrays
        */
        const property: Property = {
          key: propName,
          origValue1: testValue ? testValue : "",
          value1: testValue ? testValue : "",
          value2: "",
          type: propType,
          operators: [operator],
          origOperator: operator,
          checked: typeof testValue !== "undefined" && propType !== "array",
          origChecked: typeof testValue !== "undefined" && propType !== "array",
        };
        createdProperties[bufferKey] = property;

        elements.push(
          <PropertyItem
            key={`PI_${propCount}`}
            isExpanded={isExpanded}
            level={level}
            propName={propName}
            properties={properties}
            bufferKey={bufferKey}
            handlePropCheck={handlePropCheck}
            handlePropOperatorChange={handlePropOperatorChange}
            handleValueChange={handleValueChange}
            handleDeleteOperator={handleDeleteOperator}
            handleAddOperator={handleAddOperator}
            handleResetProperty={handleResetProperty}
            handleSelectOperator={handleSelectOperator}
          />,
        );
      } else {
        subObjects.push({ path, propName, obj: propInfo.properties });
      }
    }); // forEach level property
    // recursion for every sub object in this level
    subObjects.forEach((subObject) => {
      const newPath = !subObject.path
        ? subObject.propName
        : `${path}.${subObject.propName}`;

      elements = elements.concat(
        <List component="div" key={`L_${propCount}`} dense disablePadding>
          {createList(subObject.obj, newPath, level + 1)}
        </List>,
      );
    });

    return null;
  };

  createList(schemas[schemaIndex].schema.properties, "", 0);

  return (
    <List dense disablePadding sx={{ p: 1 }}>
      {elements}
    </List>
  );
}
