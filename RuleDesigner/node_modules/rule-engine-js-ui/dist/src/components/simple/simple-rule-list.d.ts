import { JSX } from 'react';
import { RuleExpression } from 'rule-engine-js';
interface SimpleRuleList {
    topRule: RuleExpression;
    topOperator: Operator;
}
/**
 * Creates a visual presentation of the rule.
 * @param {RuleListProps} props
 * @param {RuleExpression} props.topRule - The rule that contains all the other operators and subrules
 * @param {Operator} props.topOperator - The operator of the top rule (and, or, not)
 * @returns {JSX.Element} A Hirarchy of all Elements of the rule.
 */
export default function SimpleRuleList({ topRule, topOperator, }: SimpleRuleList): JSX.Element;
export {};
