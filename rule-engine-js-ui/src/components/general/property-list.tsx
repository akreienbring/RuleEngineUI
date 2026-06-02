/*
  Author: André Kreienbring
  Concept:
  This component takes a JSON schema and builds the initial object tree and internal representation of a rule. Including subrules and a Propertybuffer
  that contains information over the operators used for every property that is contained in the JSON schema AND the given test object.
  Hence the initial rule, also created by this component, is valid, regarding the test object.
*/
import { type JSX, useState } from "react";
import { List } from "@mui/material";
import ObjectItem from "../full/object-item";
import PropertyItem from "../full/property-item";
import SimplePropertyItem from "@src/components/simple/simple-property-item";
import { getOperatorByType } from "@src/components/utils/operator-utils";
import { useValidation } from "@src/components/general/use-validation";
import { createUUID } from "../utils/general";

interface PropertyListProps {
  isSimple: boolean;
  properties: PropertyBuffer;
  updateProperties: (properties: PropertyBuffer) => void;
  maxLevel?: number;
}

/**
 * Based on the given input parameters this component not only builds the HTML elements, but also the Properties and an initial rule that is
 * valid regarding the given test object.
 * @param {PropertyListProps} props
 * @param {boolean} props.isSimple - If true the simple property list (for SimpleRule) is rendered else the more complex one (for CreateRule)
 * @param {Function} props.properties - The current property buffer
 * @param {Function} props.updateProperties - Called every time when the property buffer was changed.
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 * @param {number} props.maxLevel - If provided, the JSON schema is only analized up to the given
 */
export default function PropertyList({
  isSimple,
  maxLevel,
  properties,
  updateProperties,
}: PropertyListProps): JSX.Element {
  const { validateProperty } = useValidation();
  const [expandedObjects, setExpandedObjects] = useState<boolean[]>([]);

  const elements: JSX.Element[] = [];
  const createdExpanded: boolean[] = [];

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
      getOperatorByType(
        property.type,
        typeof property.enum !== "undefined",
        property.operators,
        property.value1,
      ),
    );

    updateProperties(newProperties);
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
  };

  /**
   * Builds the HTML elements for all properties of the selected JSON schema.
   * @param {PropertyBuffer} properties - The current property buffer containing all properties of the JSON schema
   * @returns nothing - But fills the list of HTML elements with the MUI components.
   */
  const createList = (properties: PropertyBuffer) => {
    let lastLevel = -1;
    Object.entries(properties).forEach(([bufferKey, property]) => {
      if (typeof maxLevel !== "undefined" && property.level >= maxLevel)
        return elements;

      createdExpanded.push(true);
      const isExpanded =
        typeof expandedObjects[property.level] === "boolean"
          ? expandedObjects[property.level]
          : true;
      const indent = 3;

      let isObject = false;
      if (property.level === lastLevel + 1) {
        isObject = true;
        lastLevel++;
      }
      if (isSimple) {
        elements.push(
          <SimplePropertyItem
            property={property}
            bufferKey={bufferKey}
            handlePropCheck={handlePropCheck}
            handlePropOperatorChange={handlePropOperatorChange}
            handleValueChange={handleValueChange}
          />,
        );
      } else {
        elements.push(
          <>
            {isObject && (
              <ObjectItem
                key={createUUID()}
                level={property.level}
                indent={indent}
                path={property.level > 0 ? bufferKey : ""}
                isExpanded={isExpanded}
                handleExpandObject={handleExpandObject}
              />
            )}
            <PropertyItem
              isExpanded={isExpanded}
              level={property.level}
              propName={property.key}
              properties={properties}
              bufferKey={bufferKey}
              handlePropCheck={handlePropCheck}
              handlePropOperatorChange={handlePropOperatorChange}
              handleValueChange={handleValueChange}
              handleDeleteOperator={handleDeleteOperator}
              handleAddOperator={handleAddOperator}
              handleResetProperty={handleResetProperty}
              handleSelectOperator={handleSelectOperator}
            />
          </>,
        );
      }
    });
  };

  createList(properties);
  return (
    <List dense disablePadding sx={{ p: -1 }}>
      {elements}
    </List>
  );
}
