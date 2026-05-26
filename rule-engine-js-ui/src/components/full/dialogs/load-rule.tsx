/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import RulesTable from "./rules-table";
import { RuleExpression } from "rule-engine-js";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Box,
} from "@mui/material";

interface LoadRuleProps {
  isOpen: boolean;
  onClose: () => void;
  archivedRules: ArchivedRule[];
  handleLoadArchiveRule: (archivedRule: ArchivedRule) => void;
}

/**
 * A Dialog to select an alereay existing rule as the new top rule
 * @param {LoadRuleProps} props
 * @param {boolean} props.isOpen - If true the dialog is opened else closed
 * @param {Function} props.onClose - Called when the dialog must be or is closed
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when loading a rule
 * @param {Function} props.handleLoadArchiveRule - Called when an rule was selected
 * @returns {JSX.Element}
 */
export default function LoadRule({
  isOpen,
  onClose,
  archivedRules,
  handleLoadArchiveRule,
}: LoadRuleProps): JSX.Element {
  return (
    <Dialog open={isOpen}>
      <DialogTitle>Load a saved Rule</DialogTitle>
      <DialogContent>
        <Box sx={{ m: 2, overflow: "auto" }}>
          <RulesTable
            archivedRules={archivedRules}
            handleLoadArchiveRule={handleLoadArchiveRule}
          />
        </Box>{" "}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
