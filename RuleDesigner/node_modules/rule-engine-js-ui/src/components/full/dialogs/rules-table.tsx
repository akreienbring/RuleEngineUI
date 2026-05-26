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
import { RuleExpression } from "rule-engine-js";

interface RulesTableProps {
  archivedRules: ArchivedRule[];
  schemaIndex: number | null;
  handleLoadArchiveRule: (
    rule: RuleExpression,
    operator: Operator,
    schemaIndex: number,
  ) => void;
}

/**
 *
 * @param {RulesTableProps} props
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {number} props.schemaIndex - The index of the currently selected schema
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function RulesTable({
  archivedRules,
  schemaIndex,
  handleLoadArchiveRule,
}: RulesTableProps) {
  let validRules = archivedRules;
  if (schemaIndex !== null) {
    validRules = archivedRules.filter(
      (rule) => (rule.schemaIndex = schemaIndex),
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
          {validRules.map((row) => (
            <TableRow
              key={row.name}
              onClick={(event) =>
                handleLoadArchiveRule(row.rule, row.operator, row.schemaIndex)
              }
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.schema}</TableCell>
              <TableCell align="right">{row.operator}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {validRules.length === 0 && (
        <Box sx={{ width: 1, justifyContent: "center" }}>
          <Typography>There is no rule for the selected schema</Typography>
        </Box>
      )}
    </TableContainer>
  );
}
