/*
  Author: André Kreienbring
*/
import { type JSX } from "react";
import { TextField, MenuItem, Stack, IconButton, Tooltip } from "@mui/material";
import { AddRounded, ClearRounded } from "@mui/icons-material";
import { createUUID } from "@src/components/utils/general";

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
 * A component used to select command / device combinations
 * @param {CommandDeviceProps} props
 * @param {string[]} props.commands - A list of commands as strings
 * @param {any[]} props.devices - A list of device objects
 * @param {CommandDevice[]} props.commandsDevices - A list of already existing command / device combinations
 * @param {Function} props.handleCommandChange - Called when a command was selected
 * @param {Function} props.handleDeviceChange - Called when a device was selected
 * @param {Function} props.handleAddCommand - Called when a command was added to a combination
 * @param {Function} props.handleDeleteCommand - Called when a command was deletet from a combination
 * @returns {JSX.Element}
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
  const isSelected = (value: string): boolean => {
    const index = commandsDevices.findIndex(
      (commandDevice) => commandDevice.device.value === value,
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
              <MenuItem key={createUUID()} value={command}>
                {command}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            variant="filled"
            select
            value={entry.device.value}
            name="device"
            onChange={(event) =>
              handleDeviceChange(event.target.value, cdIndex)
            }
            sx={{ width: 130 }}
          >
            {devices.map((device) => (
              <MenuItem
                key={createUUID()}
                disabled={isSelected(device.value)}
                value={
                  entry.device.value === device.value
                    ? entry.device.value
                    : device.value
                }
              >
                {entry.device.value === device.value
                  ? entry.device.name
                  : device.name}
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
