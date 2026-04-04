/**
 * Shared type definitions for the application.
 * Central source of truth for common interfaces.
 */

/** A tool entry for sidebar navigation */
export interface ToolEntry {
    name: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}

/** A category of tools for sidebar grouping */
export interface ToolCategory {
    name: string;
    icon: React.ReactNode;
    tools: ToolEntry[];
}

/** Props for tool category component in sidebar */
export interface ToolCategoryProps {
    name: string;
    icon: React.ReactNode;
    tools: ToolEntry[];
    isOpen: boolean;
    onToggle: () => void;
    pathname: string;
    open: boolean;
    theme: import("@mui/material").Theme;
    isFirst?: boolean;
}

/** Generic tool page state return */
export interface ToolPageState {
    input: string;
    output: string;
    error: string | null;
}
