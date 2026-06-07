/*
  Author: André Kreienbring
*/
import { type JSX, useState } from "react";
import AddEmptyRule from "./add-empty-rule";
import RulesTable from "./rules-table";
import type { ArchivedRule } from "@src/components/types/public";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Tab,
  Tabs,
  Box,
} from "@mui/material";

interface AddRuleProps {
  isOpen: boolean;
  onClose: () => void;
  archivedRules: ArchivedRule[];
  schemaId: number;
  schemaName: string;
  handleAddEmptyRule: (operator: Operator) => void;
  handleLoadArchiveRule: (archivedRule: ArchivedRule) => void;
}

/**
 * A Dialog to add either empy rules or allready existing one to a rule
 * @param {RulesTableProps} props
 * @param {boolean} props.isOpen - If true the dialog is opened else closed
 * @param {Function} props.onClose - Called when the dialog must be or is closed
 * @param {ArchiveRule[]} props.archivedRules - A list of already exiting rules to select from when adding a  rule
 * @param {number} props.schemaId - The id of the currently selected schema
 * @param {string} props.schemaName - The name of the schema of the rule
 * @param {Function} props.handleAddEmptyRule - Called when an empty rule is added as a subrule
 * @param {Function} props.handleLoadArchiveRule - Called when an already existing rule is added as a subrule
 * @returns
 */
export default function AddRule({
  isOpen,
  onClose,
  archivedRules,
  schemaId,
  schemaName,
  handleAddEmptyRule,
  handleLoadArchiveRule,
}: AddRuleProps): JSX.Element {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  /**
   * Called when a tab panel was selected
   * @param {object} e The event
   * @param {number} value The index of the selected tab
   */
  const handleTabChange = (e: React.SyntheticEvent, value: number) => {
    setCurrentTabIndex(value);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <Box sx={{ m: 2, overflow: "auto" }}>
          <Tabs
            value={currentTabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Add new Rule" />
            <Tab label="Add saved Rule" />
          </Tabs>
          {currentTabIndex === 0 && (
            <AddEmptyRule handleAddEmptyRule={handleAddEmptyRule} />
          )}
          {currentTabIndex === 1 && (
            <RulesTable
              archivedRules={archivedRules}
              schemaId={schemaId}
              schemaName={schemaName}
              handleLoadArchiveRule={handleLoadArchiveRule}
            />
          )}
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
