import { JSX } from 'react';
interface LogicSelectProps {
    operator: Operator;
    handleRuleOperatorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function LogicSelect({ operator, handleRuleOperatorChange, }: LogicSelectProps): JSX.Element;
export {};
