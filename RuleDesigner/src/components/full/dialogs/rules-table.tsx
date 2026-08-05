/*
  Author: André Kreienbring
  A table that presents stored rules
*/
import type { ArchivedRule, InputSchema } from "@src/components/types/public";
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  Box,
} from "@mui/material";
import { createUUID } from "@src/components/utils/general";
import { findSchemaById } from "@src/components/utils/property-utils";

interface RulesTableProps {
  archivedRules: ArchivedRule[];
  schemas: InputSchema[];
  schema?: InputSchema;
  handleLoadArchiveRule: (archivedRule: ArchivedRule) => void;
}

/**
 * A table that contains already existing rules that can be loaded. The rule may be loaded as a toprule or as a subrule.
 * For loading as a subrule, the given schemaId restricts the offered rules to the schema of the parent rule.
 * @param {RulesTableProps} props
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {InputSchema[]} props.schemas - A list of schemas
 * @param {InputSchema} [props.schema] - If given, indicates that the rule will be added to a parent rule as subrule.
 * @param {string} [props.schemaName] - If given, the name of the schema of the rule
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function RulesTable({
  archivedRules,
  schemas,
  schema,
  handleLoadArchiveRule,
}: RulesTableProps) {
  let validRules = archivedRules;
  if (typeof schema !== "undefined") {
    validRules = archivedRules.filter(
      (rule) => rule.schemaId === schema.schemaId,
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ maxWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Schema</TableCell>
            <TableCell align="right">Operator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {validRules.map((archivedRule) => {
            const ruleSchema = findSchemaById(schemas, archivedRule.schemaId);
            return (
              <TableRow
                key={createUUID()}
                onClick={(event) => handleLoadArchiveRule(archivedRule)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
              >
                <TableCell component="th" scope="row">
                  {archivedRule.name}
                </TableCell>
                <TableCell align="right">{archivedRule.description}</TableCell>
                <TableCell align="right">{ruleSchema?.name}</TableCell>
                <TableCell align="right">{archivedRule.operator}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {validRules.length === 0 && (
        <Box sx={{ width: 1, justifyContent: "center" }}>
          <Typography>
            {`There is no rule ${typeof schema.schemaId !== "undefined" ? "for the parentrule schema " + schema.name : ""}`}
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
}
