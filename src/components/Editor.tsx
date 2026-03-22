"use client";

import MonacoEditor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { useThemeContext } from "@/components/AppThemeProvider";
import { Box, Typography } from "@mui/material";

interface EditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
    placeholder?: string;
}

export function Editor({ value, onChange, language = "json", readOnly = false, placeholder }: EditorProps) {
    const [mounted, setMounted] = useState(false);
    const [cursorPos, setCursorPos] = useState({ line: 1, column: 1, position: 0 });
    const { mode } = useThemeContext();

    const charCount = value.length;
    const lineCount = value ? value.split(/\r\n|\r|\n/).length : 0;

    const handleEditorDidMount = (editor: any) => {
        editor.onDidChangeCursorPosition((e: any) => {
            const position = e.position;
            const model = editor.getModel();
            if (model) {
                const offset = model.getOffsetAt(position);
                setCursorPos({
                    line: position.lineNumber,
                    column: position.column,
                    position: offset
                });
            }
        });
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Box sx={{ width: "100%", height: "100%", bgcolor: "action.hover", borderRadius: 2 }} />;
    }

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            {placeholder && !value && (
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 10, color: "text.disabled", fontFamily: "var(--font-mono), monospace", fontSize: 14, textAlign: "center" }}>
                    {placeholder}
                </Box>
            )}
            <MonacoEditor
                height="100%"
                language={language}
                theme={mode === "dark" ? "vs-dark" : "vs-light"}
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "var(--font-mono), monospace",
                    wordWrap: "on",
                    lineNumbers: "on",
                    readOnly: readOnly,
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                }}
                loading={<Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>Loading editor...</Box>}
                onMount={handleEditorDidMount}
            />
            {value.length > 0 && (
                <Box sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 18,
                    bgcolor: "background.paper",
                    px: 1.5,
                    py: 0.5,
                    borderTopLeftRadius: 8,
                    borderLeft: 1,
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    gap: 1.5,
                    pointerEvents: "none",
                    zIndex: 10,
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>length: {charCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>lines: {lineCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Ln: {cursorPos.line}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Col: {cursorPos.column}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Pos: {cursorPos.position}</Typography>
                </Box>
            )}
        </Box>
    );
}
