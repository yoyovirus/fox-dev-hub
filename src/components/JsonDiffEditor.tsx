"use client";

import { DiffEditor } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { useThemeContext } from "@/components/AppThemeProvider";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface JsonDiffEditorProps {
    original: string;
    modified: string;
    originalPlaceholder?: string;
    modifiedPlaceholder?: string;
    onChangeOriginal?: (val: string) => void;
    onChangeModified?: (val: string) => void;
}

export function JsonDiffEditor({ original, modified, originalPlaceholder, modifiedPlaceholder, onChangeOriginal, onChangeModified }: JsonDiffEditorProps) {
    const [mounted, setMounted] = useState(false);
    const [origCursor, setOrigCursor] = useState({ line: 1, column: 1, position: 0 });
    const [modCursor, setModCursor] = useState({ line: 1, column: 1, position: 0 });
    const { mode } = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const originalCharCount = original.length;
    const originalLineCount = original ? original.split(/\r\n|\r|\n/).length : 0;

    const modifiedCharCount = modified.length;
    const modifiedLineCount = modified ? modified.split(/\r\n|\r|\n/).length : 0;

    const handleEditorDidMount = (editor: any) => {
        editor.updateOptions({
            renderSideBySide: !isMobile
        });
        const origEditor = editor.getOriginalEditor();
        const modEditor = editor.getModifiedEditor();

        origEditor.onDidChangeModelContent(() => {
            if (onChangeOriginal) onChangeOriginal(origEditor.getValue());
        });

        modEditor.onDidChangeModelContent(() => {
            if (onChangeModified) onChangeModified(modEditor.getValue());
        });

        origEditor.onDidChangeCursorPosition((e: any) => {
            const position = e.position;
            const model = origEditor.getModel();
            if (model) {
                const offset = model.getOffsetAt(position);
                setOrigCursor({ line: position.lineNumber, column: position.column, position: offset });
            }
        });

        modEditor.onDidChangeCursorPosition((e: any) => {
            const position = e.position;
            const model = modEditor.getModel();
            if (model) {
                const offset = model.getOffsetAt(position);
                setModCursor({ line: position.lineNumber, column: position.column, position: offset });
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
        <Box sx={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
            position: "relative",
        }}>
            {/* Mobile Consolidated Placeholder */}
            {isMobile && !original && !modified && (
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 10, color: "text.disabled", fontFamily: "var(--font-mono), monospace", fontSize: 13, textAlign: "center", width: "80%" }}>
                    Paste original and modified JSON to see differences
                </Box>
            )}

            {/* Desktop Placeholders */}
            {!isMobile && originalPlaceholder && !original && (
                <Box sx={{ position: "absolute", top: "50%", left: "25%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 10, color: "text.disabled", fontFamily: "var(--font-mono), monospace", fontSize: 14, textAlign: "center" }}>
                    {originalPlaceholder}
                </Box>
            )}
            {!isMobile && modifiedPlaceholder && !modified && (
                <Box sx={{ position: "absolute", top: "50%", left: "75%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 10, color: "text.disabled", fontFamily: "var(--font-mono), monospace", fontSize: 14, textAlign: "center" }}>
                    {modifiedPlaceholder}
                </Box>
            )}
            <DiffEditor
                key={isMobile ? "inline" : "side-by-side"}
                height="100%"
                language="json"
                theme={mode === "dark" ? "vs-dark" : "vs-light"}
                original={original}
                modified={modified}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "var(--font-mono), monospace",
                    wordWrap: "on",
                    lineNumbers: "on",
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    renderSideBySide: !isMobile,
                    originalEditable: true,
                    automaticLayout: true,
                    renderMarginRevertIcon: false,
                    diffWordWrap: "off",
                    ignoreTrimWhitespace: false,
                    renderOverviewRuler: false,
                    enableSplitViewResizing: false,
                    splitViewDefaultRatio: 0.5,
                }}
                loading={<Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>Loading diff editor...</Box>}
                onMount={handleEditorDidMount}
            />
            {original.length > 0 && (
                <Box sx={{
                    position: "absolute",
                    bottom: 0,
                    right: "calc(50% + 18px)",
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
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>ORIGINAL —</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>length: {originalCharCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>lines: {originalLineCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Ln: {origCursor.line}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Col: {origCursor.column}</Typography>
                </Box>
            )}
            {modified.length > 0 && (
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
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>MODIFIED —</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>length: {modifiedCharCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>lines: {modifiedLineCount}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Ln: {modCursor.line}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", fontWeight: 700 }}>Col: {modCursor.column}</Typography>
                </Box>
            )}
        </Box>
    );
}
