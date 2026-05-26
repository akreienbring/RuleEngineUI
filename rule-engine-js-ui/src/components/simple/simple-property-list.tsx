/*
  Author: André Kreienbring
  Concept:
  This component takes a JSON schema and builds the initial object tree and internal representation of a rule. Including subrules and a Propertybuffer
  that contains information over the operators used for every property that is contained in the JSON schema AND the given test object.
  Hence the initial rule, also created by this component, is valid, regarding the test object.
*/
import { type JSX } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Checkbox,
} from "@mui/material";
import { getNoCompareOperators } from "@src/components/utils/operator-utils";
import OperatorSelect from "../general/operator-select";
import { validateProperty } from "@src/components/utils/property-utils";
import TextFieldValue1 from "../general/textfield-value1";
import TextFieldValue2 from "../general/textfield-value2";

interface SimplePropertyListProps {
  properties: PropertyBuffer;
  updateProperties: (properties: PropertyBuffer) => void;
}

/**
 * Based on the given input parameters this component not only builds the HTML elements, but also the Properties and an initial rule that is
 * valid regarding the given test object.
 * @param {SimplePropertyListProps} props
 * @param {PropertBuffer} props.properties - The current property buffer
 * @param {Function} props.updateProperties - Called every time when the property buffer was changed.
 * @returns {JSX.Element} The List with all properties from a JSON schema.
 */
export default function SimplePropertyList({
  properties,
  updateProperties,
}: SimplePropertyListProps): JSX.Element {
  let elements: JSX.Element[] = [];
  let propCount = -1;
  const inputWidth = 400;

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
   * The simple interface does currently not allow to select a value from another property.
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
   * Builds the HTML elements for all properties of the selected JSON schema.
   * @param {object} properties - An object or sub object described by the JSON schema
   * @returns null But fills the list of HTML elements with the MUI components.
   */
  const createList = (properties: PropertyBuffer) => {
    Object.entries(properties).forEach(([bufferKey, property]) => {
      propCount++;
      const isNoCompareOperator = getNoCompareOperators().includes(
        property.operators[0],
      );

      elements.push(
        <Stack
          key={`LIStack_${propCount}`}
          direction="row"
          sx={{ mt: -2, mb: -2, pt: -2, pb: -2 }}
        >
          <ListItem
            key={`LIProp_${propCount}`}
            dense
            disablePadding
            sx={{
              mt: -12,
              mb: -12,
              width: "fit-content",
            }}
          >
            <ListItemButton onClick={() => handlePropCheck(bufferKey)}>
              <Checkbox
                key={`CHK_${propCount}`}
                edge="start"
                checked={
                  typeof property.checked !== "undefined"
                    ? property.checked
                    : true
                }
                disableRipple
              />
              <ListItemText
                primary={property.key}
                secondary={property.type}
                sx={{ minWidth: 145 }}
              />
            </ListItemButton>
          </ListItem>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: 650,
              alignItems: "baseline-top",
              justifyContent: "flex-start",
              mb: 1,
              mt: 1,
              visibility: property.checked ? "visible" : "hidden",
            }}
          >
            <OperatorSelect
              property={property}
              bufferKey={bufferKey}
              handlePropOperatorChange={handlePropOperatorChange}
            />

            {!isNoCompareOperator && property?.checked && (
              <TextFieldValue1
                property={property}
                bufferKey={bufferKey}
                isPropertySelect={false}
                propertyMenuItems={[]}
                inputWidth={inputWidth}
                handleValueChange={handleValueChange}
              />
            )}

            {property.operators[0] === "between" && (
              <TextFieldValue2
                property={property}
                bufferKey={bufferKey}
                isPropertySelect={false}
                propertyMenuItems={[]}
                inputWidth={inputWidth}
                handleValueChange={handleValueChange}
              />
            )}
          </Stack>
        </Stack>,
      );
    }); // forEach level property
  };

  createList(properties);

  return <List>{elements}</List>;
}
