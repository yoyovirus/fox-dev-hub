/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import { JsonDiffEditor } from "@/components/JsonDiffEditor";
import { Box, Typography, Button, Stack, Tooltip, IconButton, alpha, useTheme, Divider, Snackbar, Alert } from "@mui/material";
import { SwapHoriz as SwapHorizIcon, Code as CodeIcon, DeleteOutline, ContentCopy, Download as DownloadIcon } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";

export default function DiffPage() {
    const [original, setOriginal] = useState<string>("");
    const [modified, setModified] = useState<string>("");
    const [origError, setOrigError] = useState<string | null>(null);
    const [modError, setModError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    useEffect(() => {
        document.title = "JSON Diff - FoX Dev Hub";
    }, []);

    useEffect(() => {
        if (!original.trim()) {
            setOrigError(null);
            return;
        }
        try {
            JSON.parse(original);
            setOrigError(null);
        } catch (e: any) {
            setOrigError(e.message);
        }
    }, [original]);

    useEffect(() => {
        if (!modified.trim()) {
            setModError(null);
            return;
        }
        try {
            JSON.parse(modified);
            setModError(null);
        } catch (e: any) {
            setModError(e.message);
        }
    }, [modified]);

    const swap = () => {
        const temp = original;
        setOriginal(modified);
        setModified(temp);
    };

    const loadSample = () => {
        setOriginal("{\n  \"name\": \"John Doe\",\n  \"age\": 30,\n  \"city\": \"New York\",\n  \"active\": false\n}");
        setModified("{\n  \"name\": \"John Doe\",\n  \"age\": 31,\n  \"city\": \"London\",\n  \"active\": true,\n  \"role\": \"admin\"\n}");
    };

    const clearEditors = () => {
        setOriginal("");
        setModified("");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(modified);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        const blob = new Blob([modified], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "json-diff.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON Diff"
                toolColor="#DC2626"
                description="Compare two JSON objects and highlight their differences."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Tooltip title="Swap original ↔ modified">
                    <Button
                        variant="outlined"
                        onClick={swap}
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
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {modified && (
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
                {(original || modified) && (
                    <Tooltip title="Clear">
                        <IconButton onClick={clearEditors} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Error Messages */}
            {(origError || modError) && (
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    {origError && (
                        <Alert severity="error" onClose={() => setOrigError(null)} sx={{ flex: 1, borderRadius: 2 }}>
                            Original JSON Error: {origError}
                        </Alert>
                    )}
                    {modError && (
                        <Alert severity="error" onClose={() => setModError(null)} sx={{ flex: 1, borderRadius: 2 }}>
                            Modified JSON Error: {modError}
                        </Alert>
                    )}
                </Box>
            )}

            {/* Diff Editor */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                flex: 1,
            }}>
                <Box sx={{ display: { xs: "none", md: "flex" }, mb: 1, gap: 0 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", width: "50%", pl: 0.5 }}>
                        Original JSON
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", width: "50%", pl: 2 }}>
                        Modified JSON
                    </Typography>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    borderRadius: 2.5,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: "background.paper",
                }}>
                    <JsonDiffEditor
                        original={original}
                        modified={modified}
                        originalPlaceholder="Paste original JSON here..."
                        modifiedPlaceholder="Paste modified JSON here..."
                        onChangeOriginal={setOriginal}
                        onChangeModified={setModified}
                    />
                </Box>
            </Box>
        </Box>
    );
}
