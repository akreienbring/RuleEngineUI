/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import type { InputSchema } from "@src/components/types/public";
import { TextField, MenuItem } from "@mui/material";
import { createUUID } from "@src/components/utils/general";

interface SchemaSelectProps {
  schemas: InputSchema[];
  schemaId: number;
  label: string;
  handleSchemaSelect: (schemaId: number) => void;
}
/**
 * Allows to select a schema from a list
 * @param {SchemaSelectProps} props
 * @param {number} props.schemaId - The id of the currently selected JSON schema
 * @param {InputSchema[]} props.schemas - Different JSON schemas for selecting properties
 * @param {string} props.label - The label of the schema select
 * @returns
 */
export default function SchemaSelect({
  schemas,
  schemaId,
  label,
  handleSchemaSelect,
}: SchemaSelectProps): JSX.Element {
  return (
    <TextField
      label={label}
      onChange={(event) => handleSchemaSelect(Number(event.target.value))}
      size="small"
      select
      value={schemaId}
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
