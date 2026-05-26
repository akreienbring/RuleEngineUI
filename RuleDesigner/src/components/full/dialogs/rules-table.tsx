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

interface RulesTableProps {
  archivedRules: ArchivedRule[];
  handleLoadArchiveRule: (archivedRule: ArchivedRule) => void;
}

/**
 * A table that contains already existing rules that can be loaded.
 * @param {RulesTableProps} props
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a new rule
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function RulesTable({
  archivedRules,
  handleLoadArchiveRule,
}: RulesTableProps) {
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
          {archivedRules.map((archivedRule) => (
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
              <TableCell align="right">{archivedRule.schema}</TableCell>
              <TableCell align="right">{archivedRule.operator}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {archivedRules.length === 0 && (
        <Box sx={{ width: 1, justifyContent: "center" }}>
          <Typography>There is no rule</Typography>
        </Box>
      )}
    </TableContainer>
  );
}
