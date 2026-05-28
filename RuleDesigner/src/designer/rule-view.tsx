/*
  Author: André Kreienbring
  see: https://stackoverflow.com/questions/38548039/can-you-store-javascript-in-a-db-and-then-execute-it-later-time
*/
import { type JSX, useState } from "react";
import type {
  ArchivedRule,
  Addon,
  InputSchema,
} from "@src/components/types/public";
import {
  Card,
  Table,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  Stack,
  Button,
} from "@mui/material";

import TableNoData from "./table-no-data";
import RuleTableRow from "./rule-table-row";
import RuleTableHead from "./rule-table-head";
import TableEmptyRows from "./table-empty-rows";
import RuleTableToolbar from "./rule-table-toolbar";
import { applyRuleFilter } from "./rule-table-utils";
import { emptyRows, getComparator } from "@src/utils/sort-array";
import RuleEngineJSUI from "@src/components/rule-engine-js-ui";
//import { RuleEngineJSUI } from "rule-engine-js-ui";
import TestDialog from "./test-dialog";

interface RuleViewProps {
  testObj: object;
  schemas: InputSchema[];
  addons: Addon[];
  archivedRules: SCentralRule[];
  handleSaveRule: (archivedRule: ArchivedRule) => void;
  handleDeleteRule: (ruleid: number) => void;
  handleUpdateRule: (archivedRule: ArchivedRule) => void;
}

/**
 * Offers function to create, save end edit rules used for automation
 * @param {RuleViewProps} props
 * @param {object} props.testObj - An object, used to be evaluated with a given rule
 * @param {InputSchema[]} props.schemas - A list of schemas used for the creation of rules
 * @param {Addon[]} props.addons - A list of addons (customizations) that can be added to the create rule dialog.
 * @param {SCentralRule[]} props.archivedRules - A list of already existing rules to show in a table
 * @param {Function} props.handleSaveRule - Called when a rule must be saved
 * @param {Function} props.handleDeleteRule - Called when a rule must be deleted
 * @param {Function} props.handleUpdateRule - Called when a rule must be updated
 * @returns {JSX.Element} */
export default function RuleView({
  testObj,
  schemas,
  addons,
  archivedRules,
  handleSaveRule,
  handleDeleteRule,
  handleUpdateRule,
}: RuleViewProps): JSX.Element {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState("");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const [rowCount, setRowCount] = useState(archivedRules.length - 1);
  const [isOpenRule, setIsOpenRule] = useState<{
    open: boolean;
    rule?: SCentralRule;
  }>({
    open: false,
    rule: undefined,
  });
  const [isOpenTest, setIsOpenTest] = useState<{
    open: boolean;
    rule?: SCentralRule;
  }>({
    open: false,
    rule: undefined,
  });

  /**
   * Opens the simple rule dialog either with an already existing rule to update it
   * or, if rule is undefined, to create a new rule.
   * @param {SCentralRule} [rule] - If given, the rule can be updated.
   */
  const handleOpenRule = (rule?: SCentralRule) => {
    setIsOpenRule({ open: true, rule });
  };

  const handleTestRule = (rule: SCentralRule) => {
    setIsOpenTest({ open: true, rule });
  };

  const onCloseTest = () => {
    setIsOpenTest({ open: false, rule: undefined });
  };

  /**
    Controls the really delete button in the table toolbar
    @param {boolean} show Show the 'really delete' menue item or not
  */
  const handleShowReallyDelete = (show: boolean) => {
    setShowReallyDelete(show);
  };

  /**
   * Close the create rule dialog.
   */
  const onCloseCreateRule = () => {
    setIsOpenRule({ open: false, rule: undefined });
  };

  /**
   * Sorts the table by a certain rule property clicked in the table head
   * @param {string} property The rule property to sort the table (e.g. name)
   */
  const handleTableSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    if (property !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    }
  };

  /**
    Add all rules to the selection. 
    @param {object} e The event of the clicked Checkbox
  */
  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = archivedRules.map((r) => r.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
    setShowReallyDelete(false);
  };

  /**
    When a checkbox of the rule table is clicked, 
    this function creates an array of selected names
    @param {string} name The name of a rule that must be added to the selection
  */
  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    setShowReallyDelete(false);
  };

  /**
    Called from within the table toolbar
    Delete all selected rules. The Admin is excluded!
    The server responds with an updated list of rules.
  */
  const handleDeleteSelected = () => {
    const ids = archivedRules
      .filter((r) => selected.includes(r.name))
      .map((r) => r.ruleid);
    setSelected([]);
  };

  /**
    The table supports paging of the rules.
    Handle the new page setting.
    @param {object} e The Mouse event
    @param {number} newPage The current page of the table
  */
  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  /**
   * Set the number of rule rows that is shown on one page
   * @param {object} e The change event when the number was changed
   */
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  /**
   * Applies a filter to the rules if text is entered in the search bar
   * @param {object} e The event triggered when text is entered
   */
  const handleFilterByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  /**
    Applies sorting and filtering on the rules array depending on the current search / filter input.
    TODO: find a way to choose a different field then name.
    dataFiltered is the resulting Array with the sorted and filterec rules
  */
  const dataFiltered: SCentralRule[] = applyRuleFilter({
    inputData: archivedRules,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        sx={{
          mt: 2,
          mb: 5,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Rules</Typography>
        <Button variant="contained" onClick={() => handleOpenRule()}>
          Create a new Rule
        </Button>
      </Stack>

      <Card>
        <RuleTableToolbar
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder="Search Rule"
          handleDeleteSelected={handleDeleteSelected}
          showReallyDelete={showReallyDelete}
          handleShowReallyDelete={handleShowReallyDelete}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }} size="small">
            <RuleTableHead
              order={order}
              orderBy={orderBy}
              rowCount={rowCount}
              numSelected={selected.length}
              handleTableSort={handleTableSort}
              handleSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rule: SCentralRule) => (
                  <RuleTableRow
                    key={rule.ruleid}
                    rule={rule}
                    selected={selected.indexOf(rule.name) !== -1}
                    handleClick={() => handleClick(rule.name)}
                    handleDeleteRule={handleDeleteRule}
                    handleOpenRule={handleOpenRule}
                    handleTestRule={handleTestRule}
                  />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, archivedRules.length)}
              />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={archivedRules.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `more than} ${to}`}`
          }
        />
      </Card>
      <RuleEngineJSUI
        isOpenCreateRule={isOpenRule.open}
        onCloseCreateRule={onCloseCreateRule}
        schemas={schemas}
        isSaveRule={true}
        addons={addons}
        handleSaveRule={handleSaveRule}
        handleUpdateRule={handleUpdateRule}
        archivedRule={isOpenRule.rule}
      />
      {archivedRules.length > 0 && typeof isOpenTest.rule !== "undefined" && (
        <TestDialog
          isOpenTest={isOpenTest.open}
          rule={isOpenTest.rule}
          testObj={testObj}
          onCloseTest={onCloseTest}
        />
      )}
    </Container>
  );
}
