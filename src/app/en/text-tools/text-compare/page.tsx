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
    Box, Typography, Button, IconButton, Tooltip, Stack, Alert, Snackbar,
    Divider, alpha, useTheme, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, SwapHoriz as SwapHorizIcon } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function TextComparePage() {
    const [text1, setText1] = useState<string>("");
    const [text2, setText2] = useState<string>("");
    const [differences, setDifferences] = useState<{ line: number; text1: string; text2: string }[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Text Compare - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    useEffect(() => {
        if (!text1.trim() || !text2.trim()) {
            setDifferences([]);
            return;
        }

        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const diffs: { line: number; text1: string; text2: string }[] = [];

        const maxLines = Math.max(lines1.length, lines2.length);
        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';
            if (line1 !== line2) {
                diffs.push({ line: i + 1, text1: line1, text2: line2 });
            }
        }

        setDifferences(diffs);
    }, [text1, text2]);

    const clearEditors = () => {
        setText1("");
        setText2("");
        setDifferences([]);
    };

    const swapEditors = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
    };

    const loadSample = () => {
        setText1("Hello World\nThis is line 2\nThis is line 3\nFinal line");
        setText2("Hello World\nThis is line two\nThis is line 3\nLast line");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Text Compare"
                toolColor={getToolColor("Text Compare")}
                description="Compare two texts side by side and identify differences."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Tooltip title="Swap text 1 ↔ text 2">
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
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
            </Box>

            {differences.length > 0 && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                    Found <strong>{differences.length}</strong> difference{differences.length !== 1 ? 's' : ''} between the two texts.
                </Alert>
            )}

            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Text 1
                        </Typography>
                        {text1 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(text1); setSnackbarMessage("Text 1 copied!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={() => { const blob = new Blob([text1], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "text1.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear">
                                    <IconButton onClick={() => { setText1(""); setDifferences([]); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={text1} placeholder="Paste your first text here..." onChange={(val) => setText1(val || "")} />
                    </Box>
                </Box>

                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Text 2
                        </Typography>
                        {text2 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(text2); setSnackbarMessage("Text 2 copied!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={() => { const blob = new Blob([text2], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "text2.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear">
                                    <IconButton onClick={() => { setText2(""); setDifferences([]); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={text2} placeholder="Paste your second text here..." onChange={(val) => setText2(val || "")} />
                    </Box>
                </Box>
            </Box>

            {differences.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Differences Summary
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                        {differences.slice(0, 10).map((diff, idx) => (
                            <Box key={idx} sx={{ py: 0.5, fontSize: "0.875rem" }}>
                                <Typography variant="caption" color="text.secondary">Line {diff.line}:</Typography>
                                <Typography component="span" sx={{ ml: 1, color: "error.main" }}>❌ {diff.text1 || '(empty)'}</Typography>
                                <Typography component="span" sx={{ ml: 1, color: "success.main" }}>✓ {diff.text2 || '(empty)'}</Typography>
                            </Box>
                        ))}
                        {differences.length > 10 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                ... and {differences.length - 10} more differences
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}

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
