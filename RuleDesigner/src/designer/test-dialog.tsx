/*
  Author: André Kreienbring
  For demonstration purposes only. Presents a dialog for testing rules with a given test object.
  There is also a command obect that demonstrates how cumstom addons can be used to extend the functionality of the rule engine.
  Here, when the rule is tested, the commands are executed and the result is shown in the dialog.
*/
import { type JSX } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import {
  DoNotDisturbOnRounded,
  VerifiedRounded,
  DeviceHubRounded,
} from "@mui/icons-material";
import {
  createRuleEngine,
  EvaluationResult,
  EvaluationContext,
} from "rule-engine-js";
import SimpleRuleList from "@src/components/simple/simple-rule-list";
// import { SimpleRuleList } from "rule-engine-js-ui";

import BorderBox from "@src/components/full/border-box";
//import { BorderBox } from "rule-engine-js-ui";
import ObjectList from "@src/components/full/object-list";
// import { ObjectList } from "rule-engine-js-ui";

const ruleEngine = createRuleEngine();

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
  rule: SCentralRule;
  testObj: object;
  onCloseTest: () => void;
}

/**
 * A dialog for testing rules with a given test object.
 * There is also a command obect that demonstrates how cumstom addons can be used to extend the functionality of the rule engine.
 * Here, when the rule is tested, the commands are executed and the result is shown in the dialog.
 * @param {TestDialogProps} props
 * @param {boolean} props.isOpenTest - If true, the dialog is open
 * @param {SCentralRule} props.rule - The rule that should be tested
 * @param {object} props.testObj - The object that should be used to test the rule
 * @param {Function} props.onCloseTest - Called when the dialog should be closed
 * @returns {JSX.Element}
 */
export default function TestDialog({
  isOpenTest,
  rule,
  testObj,
  onCloseTest,
}: TestDialogProps): JSX.Element {
  console.log("Rule:", JSON.stringify(rule));

  const evaluationResult = ruleEngine.evaluateExpr(
    rule.rule,
    testObj as EvaluationContext,
  ) as EvaluationResult;

  console.log("Evaluation Result:", JSON.stringify(evaluationResult));

  const isTestValid = evaluationResult.success;

  let commandResults: string[] = [];
  if (isTestValid && typeof rule.commandsDevices !== "undefined") {
    commandResults = rule.commandsDevices.map((command) => {
      const commandFunc = commands[command.command];
      return commandFunc(command.device.cname);
    });
  }

  return (
    <Dialog open={isOpenTest} onClose={onCloseTest} maxWidth="md">
      <DialogTitle id="alert-dialog-title">
        {`Apply rule: ${rule.name} (${rule.description})`}
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <Stack>
            <BorderBox title={`Rule (schema: ${rule.schema})`}>
              <Box sx={{ height: 300, p: 0, m: 0 }}>
                <SimpleRuleList
                  topRule={rule.rule}
                  topOperator={rule.operator}
                />
              </Box>
            </BorderBox>
          </Stack>
          <Stack>
            <BorderBox
              title="Applied to object"
              isValid={isTestValid}
              icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
            >
              <Box
                sx={{
                  height: 300,
                  p: 0,
                  m: 0,
                }}
              >
                <ObjectList obj={testObj} />
              </Box>
            </BorderBox>
          </Stack>
          <Stack>
            <BorderBox
              title="Command Results"
              isValid={isTestValid}
              icon={isTestValid ? VerifiedRounded : DoNotDisturbOnRounded}
            >
              <Box sx={{ height: 300, p: 0, m: 0 }}>
                <DeviceHubRounded />
                {commandResults.map((result, index) => (
                  <Typography key={`CR_${index}`}>{result}</Typography>
                ))}
              </Box>
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
