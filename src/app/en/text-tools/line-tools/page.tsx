/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Snackbar,
    Divider, alpha, useTheme, TextField, ButtonGroup
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function LineToolsPage() {
    const [input, setInput] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Line Tools - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const sortLines = (ascending = true) => {
        const lines = input.split('\n').filter(line => line.trim() !== '');
        const sorted = lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
        setInput(sorted.join('\n'));
    };

    const reverseLines = () => {
        const lines = input.split('\n');
        setInput(lines.reverse().join('\n'));
    };

    const shuffleLines = () => {
        const lines = input.split('\n');
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        setInput(lines.join('\n'));
    };

    const removeEmptyLines = () => {
        setInput(input.split('\n').filter(line => line.trim() !== '').join('\n'));
    };

    const trimLines = () => {
        setInput(input.split('\n').map(line => line.trim()).join('\n'));
    };

    const uniqueLines = () => {
        const lines = input.split('\n');
        const unique = [...new Set(lines)];
        setInput(unique.join('\n'));
    };

    const duplicateLines = () => {
        const lines = input.split('\n');
        setInput(lines.map(line => line + '\n' + line).join('\n'));
    };

    const numberLines = () => {
        const lines = input.split('\n');
        setInput(lines.map((line, i) => `${i + 1}. ${line}`).join('\n'));
    };

    const removeNumbers = () => {
        const lines = input.split('\n');
        setInput(lines.map(line => line.replace(/^\d+\.\s*/, '').replace(/\d+/g, '').trim()).filter(line => line !== '').join('\n'));
    };

    const prefixLines = (prefix: string) => {
        if (!prefix) return;
        const lines = input.split('\n');
        setInput(lines.map(line => prefix + line).join('\n'));
    };

    const suffixLines = (suffix: string) => {
        if (!suffix) return;
        const lines = input.split('\n');
        setInput(lines.map(line => line + suffix).join('\n'));
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
        a.download = "lines.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearEditor = () => {
        setInput("");
    };

    const loadSample = () => {
        setInput("banana\napple\ncherry\ndate\nelderberry\n\napple\nbanana");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Line Tools"
                toolColor={getToolColor("Line Tools")}
                description="Sort, reverse, shuffle, and manipulate text lines."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={() => sortLines(true)} sx={{ borderRadius: 2 }}>Sort A-Z</Button>
                    <Button onClick={() => sortLines(false)} sx={{ borderRadius: 2 }}>Sort Z-A</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={reverseLines} sx={{ borderRadius: 2 }}>Reverse</Button>
                    <Button onClick={shuffleLines} sx={{ borderRadius: 2 }}>Shuffle</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={removeEmptyLines} sx={{ borderRadius: 2 }}>No Empty</Button>
                    <Button onClick={trimLines} sx={{ borderRadius: 2 }}>Trim</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={duplicateLines} sx={{ borderRadius: 2 }}>Duplicate</Button>
                    <Button onClick={uniqueLines} sx={{ borderRadius: 2 }}>Unique</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={numberLines} sx={{ borderRadius: 2 }}>Number</Button>
                    <Button onClick={removeNumbers} sx={{ borderRadius: 2 }}>Remove Numbers</Button>
                </ButtonGroup>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                <TextField
                    size="small"
                    placeholder="Prefix"
                    sx={{ minWidth: 80 }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            prefixLines((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                />
                <TextField
                    size="small"
                    placeholder="Suffix"
                    sx={{ minWidth: 80 }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            suffixLines((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
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
                            Input / Output
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
                                <Tooltip title="Clear">
                                    <IconButton onClick={clearEditor} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={input} placeholder="Paste your text here and click any line manipulation button above..." onChange={(val) => setInput(val || "")} />
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
