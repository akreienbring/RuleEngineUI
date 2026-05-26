/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import { TextField, MenuItem, Stack, IconButton, Tooltip } from "@mui/material";
import { AddRounded, ClearRounded } from "@mui/icons-material";

type CommandDevice = {
  command: string;
  device: { cname: string; id: string };
};

interface CommandDeviceProps {
  commands: string[];
  devices: any[];
  commandsDevices: CommandDevice[];
  handleCommandChange: (value: string, cdIndex: number) => void;
  handleDeviceChange: (value: string, cdIndex: number) => void;
  handleAddCommand: () => void;
  handleDeleteCommand: (cdIndex: number) => void;
}
/**
 * Allows to select a schema from a list
 * @param {CommandDeviceProps} props
 * @param {number} props.schemaIndex - The index of the currently selected JSON schema
 * @param {InputSchema[]} props.schemas - Different JSON schemas for selecting properties
 * @returns
 */
export default function CommandDevice({
  commands,
  devices,
  commandsDevices,
  handleCommandChange,
  handleDeviceChange,
  handleAddCommand,
  handleDeleteCommand,
}: CommandDeviceProps): JSX.Element {
  /**
   * Checks if a device is already existing in the list of commands and devices.
   * If yes it can't be selected again.
   * @param {string} id - the id of a devices
   * @returns {boolean} true if the devices was already selected, false otherwise.
   */
  const isSelected = (id: string): boolean => {
    const index = commandsDevices.findIndex(
      (commandDevice) => commandDevice.device.id === id,
    );
    return index !== -1;
  };

  return (
    <Stack>
      {commandsDevices.map((entry, cdIndex) => (
        <Stack
          key={`STCD_${cdIndex}`}
          spacing={2}
          direction="row"
          sx={{ alignItems: "center" }}
        >
          <TextField
            size="small"
            variant="filled"
            select
            value={entry.command}
            name="command"
            onChange={(event) =>
              handleCommandChange(event.target.value, cdIndex)
            }
            sx={{ width: 130 }}
          >
            {commands.map((command) => (
              <MenuItem value={command}>{command}</MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            variant="filled"
            select
            value={entry.device.id}
            name="device"
            onChange={(event) =>
              handleDeviceChange(event.target.value, cdIndex)
            }
            sx={{ width: 130 }}
          >
            {devices.map((device) => (
              <MenuItem
                disabled={isSelected(device.id)}
                value={
                  entry.device.id === device.id ? entry.device.id : device.id
                }
              >
                {entry.device.id === device.id
                  ? entry.device.cname
                  : device.cname}
              </MenuItem>
            ))}
          </TextField>

          <Tooltip title="Add Command">
            <span>
              <IconButton
                disabled={devices.length === commandsDevices.length}
                onClick={() => handleAddCommand()}
                sx={{ p: 0, m: 0, height: "fit-content" }}
              >
                <AddRounded />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Command">
            <span>
              <IconButton
                disabled={commandsDevices.length === 1}
                onClick={() => handleDeleteCommand(cdIndex)}
                sx={{ p: 0, ml: 0, mr: 0, height: "fit-content" }}
              >
                <ClearRounded />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
}
