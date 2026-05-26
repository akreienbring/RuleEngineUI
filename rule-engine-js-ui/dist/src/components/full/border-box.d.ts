import { ElementType } from 'react';
interface BorderBoxProps {
    icon?: ElementType;
    title?: string;
    isValid?: boolean;
    children: React.ReactNode;
}
export default function BorderBox({ icon, title, isValid, children, }: BorderBoxProps): import("react/jsx-runtime").JSX.Element;
export {};
