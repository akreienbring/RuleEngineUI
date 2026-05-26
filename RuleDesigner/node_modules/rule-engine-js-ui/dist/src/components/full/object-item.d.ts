import { JSX } from 'react';
interface ObjectItemProps {
    level: number;
    indent: number;
    path: string;
    isExpanded: boolean;
    handleExpandObject: (level: number) => void;
}
export default function ObjectItem({ level, indent, path, isExpanded, handleExpandObject, }: ObjectItemProps): JSX.Element;
export {};
