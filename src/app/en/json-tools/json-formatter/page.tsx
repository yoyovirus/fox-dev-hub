/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Stack, Alert, Snackbar,
    Select, MenuItem, FormControl, InputLabel, Divider, alpha, useTheme, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, SwapHoriz as SwapHorizIcon } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";

const SAMPLE_JSON = `{
  "name": "Jane Doe",
  "age": 28,
  "skills": ["JavaScript", "React"],
  "address": {
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  }
}`;

export default function FormatterPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [indent, setIndent] = useState<number>(2);
    const theme = useTheme();

    useEffect(() => {
        if (!input.trim()) {
            setError(null);
            return;
        }
        try {
            JSON.parse(input);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    }, [input]);

    const formatJson = () => {
        try {
            if (!input.trim()) return;
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, indent);
            setOutput(formatted);
        } catch (err) {}
    };

    const minifyJson = () => {
        try {
            if (!input.trim()) return;
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
        } catch (err) {}
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output || input);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        const textToSave = output || input;
        if (!textToSave) return;
        const blob = new Blob([textToSave], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearEditor = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    const swapEditors = () => {
        const temp = input;
        setInput(output);
        setOutput(temp);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON Formatter"
                toolColor="#7C3AED"
                description="Beautify and minify JSON with customizable indentation."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Button
                    variant="contained"
                    onClick={formatJson}
                    startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Format
                </Button>
                <Button
                    variant="outlined"
                    onClick={minifyJson}
                    size="small"
                    sx={{
                        borderRadius: 2,
                        borderColor: "secondary.main",
                        color: "secondary.main",
                        "&:hover": { borderColor: "secondary.dark", bgcolor: alpha(theme.palette.secondary.main, 0.06) }
                    }}
                >
                    Minify
                </Button>
                <FormControl size="small" sx={{ minWidth: 110 }}>
                    <Select
                        value={indent}
                        onChange={(e) => setIndent(Number(e.target.value))}
                        sx={{ borderRadius: 2, fontSize: "0.8rem", height: 33 }}
                    >
                        <MenuItem value={2}>2 Spaces</MenuItem>
                        <MenuItem value={4}>4 Spaces</MenuItem>
                        <MenuItem value={8}>8 Spaces</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title="Swap input ↔ output">
                    <Button
                        variant="outlined"
                        onClick={swapEditors}
                        size="small"
                        startIcon={<SwapHorizIcon sx={{ fontSize: 16 }} />}
                        sx={{ borderRadius: 2 }}
                    >
                        Swap
                    </Button>
                </Tooltip>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={() => { setInput(SAMPLE_JSON); setOutput(""); setError(null); }}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {(input || output) && (
                    <>
                        <Tooltip title="Copy JSON">
                            <IconButton onClick={handleCopy} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopy sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download JSON">
                            <IconButton onClick={handleDownload} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center", ml: 1.5 }} />
                    </>
                )}
                {(input || output) && (
                    <Tooltip title="Clear">
                        <IconButton onClick={clearEditor} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2, borderRadius: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* Split Pane */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                {/* Input */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        JSON Input
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor value={input} placeholder="Paste your JSON here..." onChange={(val) => setInput(val || "")} />
                    </Box>
                </Box>

                {/* Output */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Formatted JSON
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor value={output} placeholder="Formatted JSON will appear here..." onChange={(val) => setOutput(val || "")} readOnly={true} />
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
