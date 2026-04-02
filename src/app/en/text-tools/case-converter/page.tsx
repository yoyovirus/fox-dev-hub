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
    Divider, alpha, useTheme, ButtonGroup
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function CaseConverterPage() {
    const [input, setInput] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Case Converter - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const toUpperCase = () => {
        setInput(input.toUpperCase());
    };

    const toLowerCase = () => {
        setInput(input.toLowerCase());
    };

    const toTitleCase = () => {
        setInput(input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
    };

    const toSentenceCase = () => {
        setInput(input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()));
    };

    const toCamelCase = () => {
        setInput(input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, ''));
    };

    const toPascalCase = () => {
        setInput(input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, ''));
    };

    const toSnakeCase = () => {
        setInput(input.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_'));
    };

    const toKebabCase = () => {
        setInput(input.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('-'));
    };

    const toAlternatingCase = () => {
        setInput(input.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''));
    };

    const toInverseCase = () => {
        setInput(input.split('').map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join(''));
    };

    const capitalizeFirst = () => {
        setInput(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase());
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
        a.download = "converted-text.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearEditor = () => {
        setInput("");
    };

    const loadSample = () => {
        setInput("hello world this is a sample text for case conversion");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Case Converter"
                toolColor={getToolColor("Case Converter")}
                description="Convert text between uppercase, lowercase, title case, and more."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={toUpperCase} sx={{ borderRadius: 2 }}>UPPER</Button>
                    <Button onClick={toLowerCase} sx={{ borderRadius: 2 }}>lower</Button>
                    <Button onClick={toTitleCase} sx={{ borderRadius: 2 }}>Title</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={toSentenceCase} sx={{ borderRadius: 2 }}>Sentence</Button>
                    <Button onClick={toCamelCase} sx={{ borderRadius: 2 }}>camelCase</Button>
                    <Button onClick={toPascalCase} sx={{ borderRadius: 2 }}>PascalCase</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={toSnakeCase} sx={{ borderRadius: 2 }}>snake_case</Button>
                    <Button onClick={toKebabCase} sx={{ borderRadius: 2 }}>kebab-case</Button>
                </ButtonGroup>
                <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    <Button onClick={toAlternatingCase} sx={{ borderRadius: 2 }}>aLtErNaTiNg</Button>
                    <Button onClick={toInverseCase} sx={{ borderRadius: 2 }}>InVeRsE</Button>
                    <Button onClick={capitalizeFirst} sx={{ borderRadius: 2 }}>Cap first</Button>
                </ButtonGroup>
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
                        <Editor value={input} placeholder="Paste your text here and click any conversion button above..." onChange={(val) => setInput(val || "")} />
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
