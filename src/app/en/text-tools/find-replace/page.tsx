/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Snackbar,
    Divider, alpha, useTheme, TextField, Checkbox, FormControlLabel, InputAdornment
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, Search, ChangeCircle, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function FindReplacePage() {
    const [input, setInput] = useState<string>("");
    const [findText, setFindText] = useState<string>("");
    const [replaceText, setReplaceText] = useState<string>("");
    const [matchCase, setMatchCase] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [matchCount, setMatchCount] = useState(0);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const [matches, setMatches] = useState<{ start: number; end: number; text: string }[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();
    const editorRef = useRef<any>(null);

    // Update page title
    useEffect(() => {
        document.title = "Find & Replace - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    // Find all matches when search text changes
    useEffect(() => {
        if (!findText || !input) {
            setMatchCount(0);
            setMatches([]);
            setCurrentMatchIndex(-1);
            return;
        }

        try {
            const flags = matchCase ? 'g' : 'gi';
            const pattern = useRegex ? findText : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(pattern, flags);
            const foundMatches: { start: number; end: number; text: string }[] = [];
            let match;

            while ((match = regex.exec(input)) !== null) {
                foundMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0]
                });
            }

            setMatches(foundMatches);
            setMatchCount(foundMatches.length);
            setCurrentMatchIndex(foundMatches.length > 0 ? 0 : -1);
        } catch (e) {
            setMatchCount(0);
            setMatches([]);
            setCurrentMatchIndex(-1);
        }
    }, [findText, input, matchCase, useRegex]);

    // Highlight current match in editor
    useEffect(() => {
        if (editorRef.current && currentMatchIndex >= 0 && matches.length > 0) {
            const match = matches[currentMatchIndex];
            // Convert offset to line/column position
            const position = editorRef.current.getModel().getPositionAt(match.start);
            const endPosition = editorRef.current.getModel().getPositionAt(match.end);
            
            // Set selection to highlight the match
            editorRef.current.setSelection({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: endPosition.lineNumber,
                endColumn: endPosition.column,
            });
            
            // Reveal the match in the viewport
            editorRef.current.revealPositionInCenter(position);
        }
    }, [currentMatchIndex, matches]);

    const handleEditorMount = (editor: any) => {
        editorRef.current = editor;
    };

    const findNext = () => {
        if (matches.length === 0) {
            setSnackbarMessage("No matches found");
            setSnackbarOpen(true);
            return;
        }
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    };

    const findPrevious = () => {
        if (matches.length === 0) {
            setSnackbarMessage("No matches found");
            setSnackbarOpen(true);
            return;
        }
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    const replace = () => {
        if (!findText || !input || currentMatchIndex < 0) return;
        try {
            const match = matches[currentMatchIndex];
            const newInput = input.substring(0, match.start) + replaceText + input.substring(match.end);
            setInput(newInput);
            setSnackbarMessage("Replaced occurrence");
            setSnackbarOpen(true);
            // Reset matches after replacement
            setMatches([]);
            setCurrentMatchIndex(-1);
        } catch (e: any) {
            setSnackbarMessage(`Error: ${e.message}`);
            setSnackbarOpen(true);
        }
    };

    const replaceAll = () => {
        if (!findText || !input || matches.length === 0) return;
        try {
            const flags = matchCase ? 'g' : 'gi';
            const pattern = useRegex ? findText : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(pattern, flags);
            const newInput = input.replace(regex, replaceText);
            setInput(newInput);
            setSnackbarMessage(`Replaced ${matches.length} occurrence${matches.length !== 1 ? 's' : ''}`);
            setSnackbarOpen(true);
            // Reset matches after replacement
            setMatches([]);
            setCurrentMatchIndex(-1);
        } catch (e: any) {
            setSnackbarMessage(`Error: ${e.message}`);
            setSnackbarOpen(true);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(input);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        if (!input) return;
        const blob = new Blob([input], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setInput("");
        setFindText("");
        setReplaceText("");
        setMatchCount(0);
    };

    const loadSample = () => {
        setInput("The quick brown fox jumps over the lazy dog. The fox was very quick.");
        setFindText("fox");
        setReplaceText("cat");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Find & Replace"
                toolColor={getToolColor("Find & Replace")}
                description="Search and replace text with support for regex."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ position: "relative", minWidth: 200 }}>
                    <TextField
                        size="small"
                        placeholder="Find..."
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />,
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                paddingRight: matches.length > 0 ? '60px' : '14px',
                            }
                        }}
                    />
                    {matches.length > 0 && (
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "text.secondary",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {currentMatchIndex + 1} / {matches.length}
                        </Typography>
                    )}
                </Box>
                <TextField
                    size="small"
                    placeholder="Replace with..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                        startAdornment: <ChangeCircle sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />,
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={findPrevious}
                    size="small"
                    disabled={matches.length === 0}
                    sx={{ borderRadius: 2, minWidth: "auto", px: 1 }}
                >
                    <KeyboardArrowUp sx={{ fontSize: 18 }} />
                </Button>
                <Button
                    variant="outlined"
                    onClick={findNext}
                    size="small"
                    disabled={matches.length === 0}
                    sx={{ borderRadius: 2, minWidth: "auto", px: 1 }}
                >
                    <KeyboardArrowDown sx={{ fontSize: 18 }} />
                </Button>
                <Button
                    variant="outlined"
                    onClick={replace}
                    size="small"
                    disabled={!findText || !replaceText || currentMatchIndex < 0}
                    sx={{ borderRadius: 2 }}
                >
                    Replace
                </Button>
                <Button
                    variant="contained"
                    onClick={replaceAll}
                    size="small"
                    disabled={!findText || !replaceText || matchCount === 0}
                    sx={{ borderRadius: 2 }}
                >
                    Replace All
                </Button>
                <FormControlLabel
                    control={<Checkbox checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} size="small" />}
                    label="Match case"
                    sx={{ fontSize: "0.875rem" }}
                />
                <FormControlLabel
                    control={<Checkbox checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} size="small" />}
                    label="Regex"
                    sx={{ fontSize: "0.875rem" }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
            </Box>

            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Text
                        </Typography>
                        {input && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={handleCopy} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={handleDownload} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear all">
                                    <IconButton onClick={clearAll} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                        <DeleteOutline sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor 
                            value={input} 
                            placeholder="Paste your text here..." 
                            onChange={(val) => setInput(val || "")}
                            onMount={handleEditorMount}
                        />
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
}
