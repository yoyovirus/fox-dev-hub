/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { Editor } from "@/components/Editor";
import { Box, Typography, Button, alpha, useTheme, IconButton, Tooltip, Divider, Snackbar, Alert } from "@mui/material";
import { DeleteOutline, ContentCopy, Download as DownloadIcon } from "@mui/icons-material";
import { useThemeContext } from "@/components/AppThemeProvider";
import { ToolHeader } from "@/components/ToolHeader";

const SAMPLE_JSON = `{
  "project": "ToolMaster",
  "version": "2.0",
  "features": ["Formatter", "Validator", "Diff", "Visualizer"],
  "details": {
    "author": "Developer",
    "license": "MIT",
    "active": true
  }
}`;

export default function VisualizerPage() {
    const [input, setInput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { mode } = useThemeContext();
    const theme = useTheme();

    useEffect(() => {
        document.title = "JSON Visualizer - FoX Dev Hub";
    }, []);

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

    let parsedJson: object | null = null;
    try {
        parsedJson = JSON.parse(input);
    } catch (e) {
        parsedJson = null;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(input);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        const blob = new Blob([input], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "json-visualizer.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON Visualizer"
                toolColor="#0284C7"
                description="Explore JSON structures in an interactive, collapsible tree view."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={() => setInput(SAMPLE_JSON)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {input && (
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
                        <Tooltip title="Clear">
                            <IconButton onClick={() => setInput("")} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                <DeleteOutline sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {/* Error Message */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>
                    Invalid JSON: {error}
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
                        <Editor
                            value={input}
                            placeholder="Paste your JSON here..."
                            onChange={(val) => setInput(val || "")}
                        />
                    </Box>
                </Box>

                {/* Tree View */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Tree View
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "auto",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "background.paper",
                        p: 2,
                    }}>
                        {parsedJson ? (
                            <Box sx={{ ...(mode === "dark" ? darkTheme : {}), backgroundColor: "transparent" }}>
                                <JsonView value={parsedJson} style={{ backgroundColor: "transparent", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }} displayDataTypes={false} />
                            </Box>
                        ) : (
                            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                                    Enter valid JSON to see the tree view
                                </Typography>
                            </Box>
                        )}
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
