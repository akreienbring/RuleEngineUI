/*
  Author: André Kreienbring
*/

import { type JSX } from "react";
import { IconButton, Tooltip, Stack } from "@mui/material";
import {
  UndoRounded,
  AddRounded,
  ClearRounded,
  BallotRounded,
  KeyboardRounded,
} from "@mui/icons-material";
import { isOriginal } from "@src/components/utils/general";
import { getOperators } from "../utils/operator-utils";

interface PropertyToolbarProps {
  property: Property;
  bufferKey: string;
  isPropertySelect: boolean;
  isNoCompareOperator: boolean;
  handleResetProperty: (bufferKey: string) => void;
  handleAddOperator: (bufferKey: string) => void;
  handleDeleteOperator: (bufferKey: string, index: number) => void;
  handlePropertySelection: (isPropertySelect: boolean) => void;
}

/**
 * A toolbar for selecting property actions.
 * @param {PropertyToolbarProps} props
 * @param {Property} props.property - The property object containing current and original values and operators.
 * @param {string} props.bufferKey - The key used to identify the property in the (object) buffer.
 * @param {boolean} props.isPropertySelect - Flag indicating if the property selection mode (compare property with another property) is active.
 * @param {boolean} props.isNoCompareOperator - Indicates if the selectes operator allows to compare the property with another value
 * @param {Function} props.handleResetProperty - Allows the user to reset the property to its original value
 * @param {Function} props.handleAddOperator - A property can have more then one operator in a rule.
 * @param {Function}  props.handleDeleteOperator - Allows to delete an added operator from a property
 * @param {Fumction} props.handlePropertySelection - Called to switch between property - value and property - property comparison
 * @returns {JSX.Element}
 */
export default function PropertyToolbar({
  property,
  bufferKey,
  isPropertySelect,
  isNoCompareOperator,
  handleResetProperty,
  handleAddOperator,
  handleDeleteOperator,
  handlePropertySelection,
}: PropertyToolbarProps): JSX.Element {
  return (
    <Stack direction="row" spacing={1} sx={{ pt: 1.5 }}>
      {isPropertySelect ? (
        <Tooltip title="Input Value">
          <IconButton
            onClick={() => handlePropertySelection(false)}
            sx={{ p: 0, m: 0, height: "fit-content" }}
          >
            <KeyboardRounded />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Select Property">
          <span>
            <IconButton
              disabled={
                isNoCompareOperator ||
                property.type === "array" ||
                typeof property.enum !== "undefined" ||
                property.isConst
              }
              onClick={() => handlePropertySelection(true)}
              sx={{ p: 0, m: 0, height: "fit-content" }}
            >
              <BallotRounded />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <Tooltip title={`Reset`}>
        <span>
          <IconButton
            disabled={
              isOriginal(property) &&
              property.operators[0] === property.origOperator
            }
            onClick={() => handleResetProperty(bufferKey)}
            sx={{ p: 0, ml: 0, mr: 0, height: "fit-content" }}
          >
            <UndoRounded />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Add operator">
        <span>
          <IconButton
            disabled={
              property.operators.length ===
                getOperators(
                  property.type,
                  typeof property.enum !== "undefined",
                ).length || property.isConst
            }
            onClick={() => handleAddOperator(bufferKey)}
            sx={{ p: 0, m: 0, height: "fit-content" }}
          >
            <AddRounded />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Delete operator">
        <span>
          <IconButton
            disabled={property.operators.length === 1}
            onClick={() => handleDeleteOperator(bufferKey, 0)}
            sx={{ p: 0, ml: 0, mr: 0, height: "fit-content" }}
          >
            <ClearRounded />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
