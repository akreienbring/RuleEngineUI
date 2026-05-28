/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import type { InputSchema } from "@src/components/types/public";
import { TextField, MenuItem } from "@mui/material";
import { createUUID } from "@src/components/utils/general";

interface SchemaSelectProps {
  schemas: InputSchema[];
  schemaIndex: number;
  handleSchemaSelect: (schemaIndex: number) => void;
}
/**
 * Allows to select a schema from a list
 * @param {SchemaSelectProps} props
 * @param {number} props.schemaIndex - The index of the currently selected JSON schema
 * @param {InputSchema[]} props.schemas - Different JSON schemas for selecting properties
 * @returns
 */
export default function SchemaSelect({
  schemas,
  schemaIndex,
  handleSchemaSelect,
}: SchemaSelectProps): JSX.Element {
  return (
    <TextField
      label="Select a schema"
      onChange={(event) => handleSchemaSelect(Number(event.target.value))}
      size="small"
      variant="filled"
      select
      value={schemaIndex}
      sx={{ width: 200, zIndex: "tooltip" }}
    >
      {schemas.map((schema, index) => (
        <MenuItem key={createUUID()} value={index}>
          {schema.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
