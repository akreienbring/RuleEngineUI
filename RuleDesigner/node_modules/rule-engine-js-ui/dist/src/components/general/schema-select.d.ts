import { JSX } from 'react';
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
export default function SchemaSelect({ schemas, schemaIndex, handleSchemaSelect, }: SchemaSelectProps): JSX.Element;
export {};
