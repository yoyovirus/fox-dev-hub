/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, Alert, Snackbar,
    alpha, useTheme, Chip, IconButton, Tooltip, Divider
} from "@mui/material";
import { CheckCircle, ErrorOutline, DeleteOutline, ContentCopy, Download as DownloadIcon } from "@mui/icons-material";

export default function ValidatorPage() {
    const [input, setInput] = useState<string>("");
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    const handleInputChange = (val: string | undefined) => {
        const newValue = val || "";
        setInput(newValue);
        if (!newValue.trim()) {
            setValidationResult(null);
            return;
        }
        try {
            JSON.parse(newValue);
            setValidationResult({ isValid: true, message: "Valid JSON — no syntax errors found." });
        } catch (err: any) {
            setValidationResult({ isValid: false, message: err.message || "Invalid JSON syntax" });
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
        const blob = new Blob([input], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "json-validator.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadSample = () => {
        const sample = "{\n  \"name\": \"Alice\",\n  \"age\": 30,\n  \"active\": true,\n  \"roles\": [\"admin\", \"editor\"],\n  \"address\": {\n    \"city\": \"New York\",\n    \"zip\": \"10001\"\n  }\n}";
        handleInputChange(sample);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Page Header */}
            <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        bgcolor: alpha("#059669", 0.1),
                        border: `1px solid ${alpha("#059669", 0.2)}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", fontWeight: 800, color: "#059669",
                    }}>✓</Box>
                    <Typography variant="h5" fontWeight={800}>JSON Validator</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5 }}>
                    Quickly validate your JSON data to pinpoint syntax errors.
                </Typography>
            </Box>

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                {/* Validate button removed for real-time validation */}
                <Box sx={{ flexGrow: 1 }} />
                {/* Result badge */}
                {validationResult && (
                    <Chip
                        icon={validationResult.isValid ? <CheckCircle sx={{ fontSize: 16 }} /> : <ErrorOutline sx={{ fontSize: 16 }} />}
                        label={validationResult.isValid ? "Valid JSON" : "Invalid JSON"}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: alpha(validationResult.isValid ? "#059669" : "#DC2626", 0.1),
                            color: validationResult.isValid ? "#059669" : "#DC2626",
                            border: `1px solid ${alpha(validationResult.isValid ? "#059669" : "#DC2626", 0.25)}`,
                            mr: 0.5
                        }}
                    />
                )}
                <Button
                    variant="outlined"
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2, ml: 1 }}
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
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                        <Tooltip title="Clear">
                            <IconButton onClick={() => { setInput(""); setValidationResult(null); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                <DeleteOutline sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {/* Error / Success Message */}
            {validationResult && (
                <Alert
                    severity={validationResult.isValid ? "success" : "error"}
                    onClose={() => setValidationResult(null)}
                    sx={{ mb: 2, borderRadius: 2 }}
                >
                    {validationResult.message}
                </Alert>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />

            {/* Editor */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.08em", ml: 0.5 }}>
                    JSON Input
                </Typography>
                <Box sx={{
                    flexGrow: 1,
                    minHeight: { xs: 500, md: 450 },
                    borderRadius: 2.5,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                }}>
                    <Editor
                        value={input}
                        placeholder="Paste your JSON here to validate..."
                        onChange={handleInputChange}
                    />
                </Box>
            </Box>
        </Box>
    );
}
