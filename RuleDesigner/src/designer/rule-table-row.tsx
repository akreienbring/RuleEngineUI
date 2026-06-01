/*
  Author: André Kreienbring
  Presents a single row in the rue table with a menu for editing and deleting the rule.
  Hirarchy:
  RuleDesigner
  |_CreateUser
  |_UserTableToolbar
  |_UserTableHead
  |_UserTable
    |_TableNoData
    |_TableEmptyRow
    |_UserTableRow
      |_RuleEngineJSUI
*/
import { type JSX, useState } from "react";
import {
  MoreVertRounded,
  EditRounded,
  DeleteRounded,
  HelpRounded,
  RuleRounded,
} from "@mui/icons-material";
import {
  Typography,
  Menu,
  TableRow,
  Checkbox,
  MenuItem,
  ListItemIcon,
  TableCell,
  IconButton,
} from "@mui/material";

interface RuleTableRowProps {
  rule: SCentralRule;
  schemaName: string;
  selected: boolean;
  handleClick: () => void;
  handleDeleteRule: (ruleid: number) => void;
  handleOpenRule: (rule: SCentralRule) => void;
  handleTestRule: (rule: SCentralRule) => void;
}

/**
  Presents a single row in the user table
  @param {RuleTableRowProps} props
  @param {SCentralRule} props.rule with the values of the current row
  @param {string} props.schemaName - The name of the schema of the rule
  @param {boolean} props.selected true if the row is selected
  @param {Function} props.handleClick Called when clicking the checkbox of a rule entry
  @param {Function} props.handleDeleteRule Called when a rule must be deleted
  @param {Function} props.handleOpenRule Called when a rule must be opened
  @param {Function} props.handleTestRule Called when a rule must be tested
  @returns {JSX.Element}
*/
export default function UserTableRow({
  rule,
  schemaName,
  selected,
  handleClick,
  handleDeleteRule,
  handleOpenRule,
  handleTestRule,
}: RuleTableRowProps): JSX.Element {
  const [openMenue, setOpenMenue] = useState<HTMLButtonElement | null>(null);
  const [showReallyDelete, setShowReallyDelete] = useState(false);

  /**
    Open the create rule dialog.
  */
  const handleOpenUpdate = () => {
    handleCloseMenu();
    handleOpenRule(rule);
  };

  const handleTest = (rule: SCentralRule) => {
    handleCloseMenu();
    handleTestRule(rule);
  };

  /**
    Open the Menue of the user tabel row
    @param {object} e is the click event
  */
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenue(e.currentTarget);
    setShowReallyDelete(false);
  };
  /**
    Close the Menue of the rule table row
  */
  const handleCloseMenu = () => {
    setOpenMenue(null);
  };

  /**
    Add Really Delete to the Menue
  */
  const handleShowReally = () => {
    setShowReallyDelete(true);
  };

  const handleDeleteReally = (ruleid: number) => {
    setOpenMenue(null);
    handleDeleteRule(ruleid);
  };

  return (
    <>
      <TableRow
        data-testid="user_tablerow_component"
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>
          <Typography>{rule.name}</Typography>
        </TableCell>

        <TableCell>
          <Typography>{rule.description}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{schemaName}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{rule.operator}</Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertRounded />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        open={!!openMenue}
        anchorEl={openMenue}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 170, maxWidth: "100%" },
          },
        }}
      >
        <MenuItem onClick={() => handleOpenUpdate()}>
          <ListItemIcon>
            <EditRounded />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleTest(rule)}>
          <ListItemIcon>
            <RuleRounded />
          </ListItemIcon>
          Apply
        </MenuItem>

        <MenuItem onClick={handleShowReally} sx={{ color: "warning.main" }}>
          <ListItemIcon>
            <DeleteRounded color="warning" />
          </ListItemIcon>
          Delete
        </MenuItem>

        {showReallyDelete && (
          <MenuItem
            onClick={() => handleDeleteReally(rule.ruleid)}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <HelpRounded color="error" />
            </ListItemIcon>
            Really delete?
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
