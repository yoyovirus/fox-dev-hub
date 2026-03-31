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
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, alpha, useTheme, Chip, TextField, IconButton, Tooltip, Snackbar, Divider, Alert, InputAdornment
} from "@mui/material";
import { Search as SearchIcon, Download as DownloadIcon, ContentCopy as ContentCopyIcon, Clear as ClearIcon, DeleteOutline } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";
import { SAMPLE_JSON_TO_TABLE } from "@/lib/sampleData";

export default function ToTablePage() {
    const [input, setInput] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
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

    let parsedData: any = null;
    let headers: string[] = [];

    try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed) && parsed.length > 0) {
            parsedData = parsed;
            headers = Array.from(new Set(parsed.flatMap((item) => Object.keys(item))));
        } else if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
            parsedData = [parsed];
            headers = Object.keys(parsed);
        }
    } catch (e) {
        parsedData = null;
    }

    if (parsedData && searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        parsedData = parsedData.filter((row: any) =>
            headers.some((h) => String(row[h] ?? "").toLowerCase().includes(lowerQuery))
        );
    }

    const exportCsv = () => {
        if (!parsedData || parsedData.length === 0) return;
        const csvContent = [
            headers.join(","),
            ...parsedData.map((row: any) =>
                headers.map((h) => 
                    typeof row[h] === "object" ? `"${JSON.stringify(row[h]).replace(/"/g, '""')}"` : `"${String(row[h] ?? "").replace(/"/g, '""')}"`
                ).join(",")
            )
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyMarkdown = async () => {
        if (!parsedData || parsedData.length === 0) return;
        const headerRow = `| ${headers.join(" | ")} |`;
        const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
        const dataRows = parsedData.map((row: any) => 
            `| ${headers.map(h => typeof row[h] === "object" ? JSON.stringify(row[h]) : String(row[h] ?? "")).join(" | ")} |`
        ).join("\n");
        const mdText = `${headerRow}\n${dividerRow}\n${dataRows}`;
        
        try {
            await navigator.clipboard.writeText(mdText);
            setSnackbarMessage("Markdown copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) {}
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON to Table"
                toolColor={getToolColor("JSON to Table")}
                description="Convert JSON arrays into clean, readable tables instantly."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                {parsedData ? (
                    <TextField
                        size="small"
                        label="Search Table"
                        placeholder="Search in any column..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 18, color: "primary.main" }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery ? (
                                <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ mr: -1 }}>
                                    <ClearIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            ) : null,
                            sx: { borderRadius: 2, fontSize: "0.875rem" }
                        }}
                        sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            "& .MuiFormLabel-root": { fontSize: "0.875rem" }
                        }}
                    />
                ) : (
                    <Box sx={{ flexGrow: 1 }} />
                )}
                <Box sx={{ flexGrow: 0, width: 8 }} />
                {parsedData && (
                    <Chip
                        label={`${parsedData.length} rows · ${headers.length} columns`}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: "primary.main",
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    />
                )}
                <Button
                    variant="outlined"
                    onClick={() => setInput(SAMPLE_JSON_TO_TABLE)}
                    size="small"
                    sx={{ borderRadius: 2, ml: parsedData ? 1.5 : 0 }}
                >
                    Sample
                </Button>
                {parsedData && (
                    <>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center", ml: 1.5 }} />
                        <Tooltip title="Export CSV">
                            <IconButton onClick={exportCsv} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy MD">
                            <IconButton onClick={copyMarkdown} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopyIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
                {input && (
                    <>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center", ml: parsedData ? 0.5 : 0 }} />
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
                {/* Input Editor */}
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
                            placeholder='Paste a JSON array like [{"id": 1, "name": "Alice"}]...'
                            onChange={(val) => setInput(val || "")}
                        />
                    </Box>
                </Box>

                {/* Table Output */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Table Output
                    </Typography>
                    <TableContainer
                        component={Paper}
                        variant="outlined"
                        sx={{
                            flexGrow: 1,
                            minHeight: 0,
                            overflow: "auto",
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: "background.paper",
                        }}
                    >
                        {parsedData && parsedData.length > 0 ? (
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {headers.map((h, i) => (
                                            <TableCell
                                                key={i}
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.78rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em",
                                                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                                                    color: "primary.main",
                                                    borderBottom: `2px solid ${theme.palette.divider}`,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parsedData.map((row: any, i: number) => (
                                        <TableRow
                                            key={i}
                                            hover
                                            sx={{
                                                "&:last-child td": { borderBottom: 0 },
                                                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                                            }}
                                        >
                                            {headers.map((h, j) => (
                                                <TableCell
                                                    key={j}
                                                    sx={{ fontSize: "0.82rem" }}
                                                >
                                                    {typeof row[h] === "boolean"
                                                        ? (
                                                            <Chip
                                                                label={String(row[h])}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: "0.68rem",
                                                                    fontWeight: 700,
                                                                    bgcolor: row[h] ? alpha("#059669", 0.1) : alpha("#DC2626", 0.1),
                                                                    color: row[h] ? "#059669" : "#DC2626",
                                                                }}
                                                            />
                                                        )
                                                        : typeof row[h] === "object"
                                                            ? JSON.stringify(row[h])
                                                            : String(row[h] ?? "")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "text.secondary", gap: 1, p: 3 }}>
                                <Typography sx={{ fontSize: "0.875rem", textAlign: "center" }}>
                                    Provide a valid JSON array to generate a table
                                </Typography>
                            </Box>
                        )}
                    </TableContainer>
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

