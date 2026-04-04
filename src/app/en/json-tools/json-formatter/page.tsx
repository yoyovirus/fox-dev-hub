/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Stack, Alert, Snackbar,
    Select, MenuItem, FormControl, InputLabel, Divider, alpha, useTheme, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, SwapHoriz as SwapHorizIcon } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";
import { SAMPLE_JSON_FORMATTER } from "@/lib/sampleData";
import { useToolPage } from "@/lib/hooks";
import { formatJson, minifyJson } from "@/lib/utils";

export default function FormatterPage() {
    const theme = useTheme();
    const {
        input, setInput,
        output, setOutput,
        error, setError,
        handleCopy, handleDownload, handleClear, handleLoadSample,
        SnackbarProps,
    } = useToolPage({ validateJson: true });
    const [indent, setIndent] = useState<number>(2);

    const handleFormat = () => {
        try {
            if (!input.trim()) return;
            setOutput(formatJson(input, indent));
        } catch (err) {}
    };

    const handleMinify = () => {
        try {
            if (!input.trim()) return;
            setOutput(minifyJson(input));
        } catch (err) {}
    };

    const handleSwap = () => {
        const temp = input;
        setInput(output);
        setOutput(temp);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON Formatter"
                toolColor={getToolColor("JSON Formatter")}
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
                    onClick={handleFormat}
                    startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Format
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleMinify}
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
                        onClick={handleSwap}
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
                    onClick={() => handleLoadSample(SAMPLE_JSON_FORMATTER)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {(input || output) && (
                    <>
                        <Tooltip title="Copy JSON">
                            <IconButton onClick={() => handleCopy()} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopy sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download JSON">
                            <IconButton onClick={() => handleDownload(undefined, "formatted.json")} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center", ml: 1.5 }} />
                    </>
                )}
                {(input || output) && (
                    <Tooltip title="Clear">
                        <IconButton onClick={() => handleClear()} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                {...SnackbarProps}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
}
