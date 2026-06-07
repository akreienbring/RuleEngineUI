/*
  see for comparison:
    used in this project: https://github.com/crafts69guy/rule-engine-js
    https://www.json-rule-editor.com, https://github.com/cachecontrol/json-rules-engine
    https://github.com/ali-master/rule-engine

  This application:
    https://www.npmjs.com/package/rule-engine-js-ui
    https://github.com/akreienbring/RuleEngineUI
*/

import { type JSX, useState } from "react";
import type {
  ArchivedRule,
  Addon,
  InputSchema,
  JSONSchema,
} from "@src/components/types/public";
import { createSchema } from "@omni-clm/genson-js";
import RuleEngineJSUI from "@src/components/rule-engine-js-ui";

import RuleView from "@src/designer/rule-view";
import Freddy from "@src/designer/freddy";
import CommandDevice from "@src/designer/command-device";
import { Tab, Tabs, Box } from "@mui/material";

//----------------Create some data for testing
const commands = ["TurnOFF", "TurnON"];
const devices = [
  { cname: "Küche", id: "1" },
  { cname: "Flur", id: "2" },
  { cname: "Bad", id: "3" },
];
const sourceObj = {
  name: "John Doe",
  age: 28,
  role: "admin",
  email: "john@company.com",
  permissions: ["read", "write", "delete"],
  sys: {
    up: 5,
    country: "Spain",
    third: { test: false, valid: "yoath" },
  },
  verdad: true,
  permission: "write",
  countries: ["Germany", "Spain", "Greece"],
  minAge: 12,
  maxAge: 30,
};

const NotifyEvent = {
  source: "Button",
  pressed: 1,
};

const NotifyStatus = {
  consumption: 4,
  connected: true,
};

const dogSchema = {
  type: "object",
  properties: {
    name: { const: "Freddy" },
    age: { type: "integer" },
    hobbies: { type: "array", items: { type: "string" } },
    dances: { enum: ["Salsa", "Kizomba", "Bachata"] },
    favoriteFood: {
      enum: [
        { name: "pizza", value: "1" },
        { name: "taco", value: "2" },
        { name: "fries", value: "3" },
      ],
    },
    hunger: { type: "number" },
  },
  required: ["name", "age"],
} as JSONSchema;

const schema1 = createSchema(NotifyEvent) as JSONSchema;
const schema2 = createSchema(NotifyStatus) as JSONSchema;
const schema3 = createSchema(sourceObj) as JSONSchema;

const schemas: InputSchema[] = [
  { name: "Event", description: "New", schema: schema1, schemaId: 0 },
  { name: "Status", description: "Old", schema: schema2, schemaId: 1 },
  { name: "Large Object", description: "Old", schema: schema3, schemaId: 2 },
  { name: "Dog", description: "degSchema", schema: dogSchema, schemaId: 3 },
];
//----------------

/**
 * Test application for rule-engine-js-ui.
 *
 * @returns {JSX.Element}
 */
export default function RuleDesigner(): JSX.Element {
  const [archivedRules, setArchivedRules] = useState<SCentralRule[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [commandsDevices, setCommandsDevices] = useState<CommandDevice[]>([
    {
      command: commands[0],
      device: devices[0],
    },
  ]);

  /**
   * Called from both, the full featured component and the simpler interface to save a rule.
   * This is the handover to the application that uses a rule that was created by the RuleEngineJS.
   * However, the rule is pushed into an array of already existing rules for reuse.
   * @param {ArchivedRule} createdRule - The rule that was created either by the full featured interface of the "assistant like" simpler UI
   */
  const handleSaveRule = (createdRule: ArchivedRule) => {
    const newArchivedRules = [...archivedRules];
    const scentralRule = createdRule as SCentralRule;
    scentralRule.ruleid = archivedRules.length;
    scentralRule.commandsDevices = commandsDevices;
    newArchivedRules.push(scentralRule);
    setArchivedRules(newArchivedRules);
  };

  /**
   * Called CURRENTLY ONLY from the simpler interface to update a rule.
   * The rule is updated in the array of already existing rules for reuse.
   * @param {ArchivedRule} rule - The rule that was updated by the "assistant like" simpler UI
   */
  const handleUpdateRule = (rule: ArchivedRule) => {
    const newArchivedRules = [...archivedRules];
    const scentralRule = rule as SCentralRule;
    scentralRule.commandsDevices = commandsDevices;
    newArchivedRules[rule.ruleid] = scentralRule;
    setArchivedRules(newArchivedRules);
  };

  /**
    Called from within the table row menue, when a rule
    must be deleted. 
    @param {number} ruleid The id of the rule that must be deleted
  */
  const handleDeleteRule = (ruleid: number) => {
    const newArchivedRules = [...archivedRules];
    newArchivedRules.splice(ruleid - 1, 1);
    setArchivedRules(newArchivedRules);
  };

  /**
   * Called when a tab panel was selected
   * @param {object} e The event
   * @param {number} value The index of the selected tab
   */
  const handleTabChange = (e: React.SyntheticEvent, value: number) => {
    setCurrentTabIndex(value);
  };

  /**
   * When a command changes, it also must be changed in the list
   * of command / device combinations.
   * @param {string} command - The new command that must be changed
   * @param {number} cdIndex - The index in the list where the new command will be placed.
   */
  const handleCommandChange = (command: string, cdIndex: number) => {
    const newCommandsDevices = [...commandsDevices];
    newCommandsDevices[cdIndex].command = command;
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Changes a device in the list of command / device selections
   * @param {string} id - The id of the new device that must be put in the list.
   * @param {number} cdIndex - The index in the list, where the given device is placed
   */
  const handleDeviceChange = (id: string, cdIndex: number) => {
    const newCommandsDevices = [...commandsDevices];
    const selectedDevice = devices.find((device) => device.id === id);
    if (typeof selectedDevice !== "undefined")
      newCommandsDevices[cdIndex].device = selectedDevice;
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Adds a command / device combination to the corresponding list.
   * Adds only the devices that are not already selected.
   */
  const handleAddCommand = () => {
    const newCommandsDevices = [...commandsDevices];

    const leftDevices = devices.filter(
      (device) =>
        newCommandsDevices.findIndex(
          (commandDevice) => commandDevice.device.id === device.id,
        ) === -1,
    );

    newCommandsDevices.push({
      command: commands[0],
      device: leftDevices[0],
    });
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Deletes a command / device combination from the list.
   * @param {number} cdIndex - The index of the command / device entry to delete.
   */
  const handleDeleteCommand = (cdIndex: number) => {
    const newCommandsDevices = [...commandsDevices];
    newCommandsDevices.splice(cdIndex, 1);
    setCommandsDevices(newCommandsDevices);
  };

  const addons: Addon[] = [
    {
      summary: "Select the Actions",
      selected: `${commandsDevices[0].command} ${commandsDevices[0].device.cname}`,
      details: (
        <CommandDevice
          commands={commands}
          devices={devices}
          commandsDevices={commandsDevices}
          handleCommandChange={handleCommandChange}
          handleDeviceChange={handleDeviceChange}
          handleAddCommand={handleAddCommand}
          handleDeleteCommand={handleDeleteCommand}
        />
      ),
    },
  ];

  return (
    <Box sx={{ m: 2 }}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Simple" />
        <Tab label="Full" />
        <Tab label="Stateful Playground" />
      </Tabs>
      {currentTabIndex === 0 && (
        <RuleView
          testObj={NotifyEvent}
          schemas={schemas}
          addons={addons}
          archivedRules={archivedRules}
          handleSaveRule={handleSaveRule}
          handleDeleteRule={handleDeleteRule}
          handleUpdateRule={handleUpdateRule}
        />
      )}

      {currentTabIndex === 1 && (
        <RuleEngineJSUI
          schemas={schemas}
          testObj={sourceObj}
          maxLevel={3}
          isSaveRule={true}
          archivedRules={archivedRules}
          handleSaveRule={handleSaveRule}
          handleUpdateRule={handleUpdateRule}
        />
      )}

      {currentTabIndex === 2 && <Freddy />}
    </Box>
  );
}
