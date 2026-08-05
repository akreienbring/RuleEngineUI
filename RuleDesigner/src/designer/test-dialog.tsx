/*
  Author: André Kreienbring
  For demonstration purposes only. Presents a dialog for testing rules with a given test object.
  There is also a command obect that demonstrates how cumstom addons can be used to extend the functionality of the rule engine.
  Here, when the rule is tested, the commands are executed and the result is shown in the dialog.
*/
import { type JSX, useState, useEffect } from "react";
import type { TestObject } from "@src/components/types/public";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  DoNotDisturbOnRounded,
  VerifiedRounded,
  DeviceHubRounded,
} from "@mui/icons-material";
import { EvaluationResult } from "rule-engine-js";
import SimpleRuleList from "@src/components/simple/simple-rule-list";

import BorderBox from "@src/components/full/border-box";
import ObjectList from "@src/components/full/object-list";
import { evaluateRule } from "@src/components/utils/rule-utils-js";

const commands: CommandBuffer = {
  TurnOFF: function turnOff(name: string) {
    return `TurnOFF  ${name}`;
  },
  TurnON: function turnOn(name: string) {
    return `TurnON  ${name}`;
  },
};

interface TestDialogProps {
  isOpenTest: boolean;
  sCentalRule: SCentralRule;
  testObjects: TestObject[];
  onCloseTest: () => void;
}

/**
 * A dialog for testing rules with a given test object.
 * There is also a command obect that demonstrates how cumstom addons can be used to extend the functionality of the rule engine.
 * Here, when the rule is tested, the commands are executed and the result is shown in the dialog.
 * @param {TestDialogProps} props
 * @param {boolean} props.isOpenTest - If true, the dialog is open
 * @param {SCentralRule} props.sCentalRule - The SCentral rule that should be tested
 * @param {InputSchema[]} props.testObjects - A list of Test Objects
 * @param {Function} props.onCloseTest - Called when the dialog should be closed
 * @returns {JSX.Element}
 */
export default function TestDialog({
  isOpenTest,
  sCentalRule,

  testObjects,
  onCloseTest,
}: TestDialogProps): JSX.Element {
  const [testObjectId, setTestObjectId] = useState(0);
  const [isTestValid, setIsTestValid] = useState(false);

  let commandResults: string[] = [];
  if (isTestValid && typeof sCentalRule.commandsDevices !== "undefined") {
    commandResults = sCentalRule.commandsDevices.map((commandDevice) => {
      const commandFunc = commands[commandDevice.command];
      return commandFunc(commandDevice.device.name);
    });
  }

  /**
   * When the component is first loaded, the rule is evaluated against the first test object in the list.
   * Runs every time when the test object changes
   */
  useEffect(() => {
    evaluateRule(
      sCentalRule.rule,
      sCentalRule.operator,
      testObjects[testObjectId].testObject,
      sCentalRule.firstEval,
    ).then((result: EvaluationResult) => {
      setIsTestValid(result.success);
    });
  }, [testObjectId]);

  /**
   * Called from the toolbar when a different test object is selected.
   * and build a new rule based on the new schema.
   * @param {number} tObjId - The id of the newly selected test object
   */
  const handleTestObjectSelect = (tObjId: number) => {
    setTestObjectId(tObjId);
  };

  return (
    <Dialog open={isOpenTest} onClose={onCloseTest} maxWidth="md">
      <DialogTitle>
        <TextField
          size="small"
          select
          label="Select a Test Object"
          value={testObjectId}
          onChange={(event) =>
            handleTestObjectSelect(Number(event.target.value))
          }
          sx={{ width: 180, ml: 35 }}
        >
          {testObjects.map((testObject, index) => (
            <MenuItem key={`TO_${index}`} value={index}>
              {testObject.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <Stack>
            <BorderBox
              title={`Rule: ${sCentalRule.name}`}
              sx={{ pl: 3, height: 300 }}
            >
              <SimpleRuleList
                topRule={sCentalRule.rule}
                topOperator={sCentalRule.operator}
              />
            </BorderBox>
          </Stack>
          <Stack>
            <BorderBox
              title={`${testObjects[testObjectId].name}`}
              isValid={isTestValid}
              icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
              sx={{ pl: 3, height: 300 }}
            >
              <ObjectList obj={testObjects[testObjectId].testObject} />
            </BorderBox>
          </Stack>
          <Stack>
            <BorderBox
              title="Command Results"
              isValid={isTestValid}
              icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
              sx={{ pl: 3, height: 300 }}
            >
              <DeviceHubRounded />
              {commandResults.map((result, index) => (
                <Typography key={`CR_${index}`}>{result}</Typography>
              ))}
            </BorderBox>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseTest} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
