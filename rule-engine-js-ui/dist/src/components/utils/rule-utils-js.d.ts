export function buildRuleHelpers(propertyBuffer: any, topOperator: any): import('rule-engine-js').RuleExpression;
export function buildRule(propertyBuffer: PropertyBuffer, operator: Operator): RuleExpression;
export function evaluateRule(obj: object, rule: RuleExpression): EvaluationResult;
export function getValueByPath(obj: object, path: string): unknown;
