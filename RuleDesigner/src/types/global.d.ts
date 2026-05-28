import { RuleExpression } from "rule-engine-js";
import type { ArchivedRule } from "@src/components/types/public";

declare global {
  interface SCentralRule extends ArchivedRule {
    commandsDevices: CommandDevice[];
  }

  type CommandDevice = {
    command: string;
    device: { cname: string; id: string };
  };

  type CommandBuffer = {
    [key: string]: Function;
  };

  type SortOrder = "asc" | "desc";
}

export {};
