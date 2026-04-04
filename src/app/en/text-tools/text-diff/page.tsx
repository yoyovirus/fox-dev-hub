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
    Divider, alpha, useTheme, Chip, FormControlLabel, Checkbox
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, SwapHoriz } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";
import { computeWordDiff, normalizeText } from "@/lib/utils/diff";

export default function TextDiffPage() {
    const [text1, setText1] = useState<string>("");
    const [text2, setText2] = useState<string>("");
    const [diffResult, setDiffResult] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const theme = useTheme();

    const showSnackbar = (msg: string) => { setSnackbarMessage(msg); setSnackbarOpen(true); };
    const copyText = async (text: string, label: string) => {
        try { await navigator.clipboard.writeText(text); showSnackbar(`${label} copied!`); } catch {}
    };
    const downloadText = (text: string, filename: string) => {
        if (!text) return;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename; document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    // Update page title
    useEffect(() => {
        document.title = "Text Diff - FoX Dev Tools";
        return () => { document.title = "FoX Dev Tools"; };
    }, []);

    useEffect(() => {
        if (!text1.trim() || !text2.trim()) {
            setDiffResult("");
            return;
        }

        const normalized1 = normalizeText(text1, ignoreWhitespace, ignoreCase);
        const normalized2 = normalizeText(text2, ignoreWhitespace, ignoreCase);

        if (normalized1 === normalized2) {
            setDiffResult("✓ No differences found!");
            return;
        }

        setDiffResult(computeWordDiff(text1, text2, ignoreWhitespace, ignoreCase));
    }, [text1, text2, ignoreWhitespace, ignoreCase]);

    const clearEditors = () => {
        setText1("");
        setText2("");
        setDiffResult("");
    };

    const swapEditors = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
    };

    const loadSample = () => {
        setText1("The quick brown fox jumps over the lazy dog.");
        setText2("The quick brown cat leaps over the sleepy dog.");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Text Diff"
                toolColor={getToolColor("Text Diff")}
                description="Find differences between two texts with highlighted changes."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <FormControlLabel
                    control={<Checkbox checked={ignoreWhitespace} onChange={(e) => setIgnoreWhitespace(e.target.checked)} size="small" />}
                    label="Ignore whitespace"
                    sx={{ fontSize: "0.875rem" }}
                />
                <FormControlLabel
                    control={<Checkbox checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} size="small" />}
                    label="Ignore case"
                    sx={{ fontSize: "0.875rem" }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                <Tooltip title="Swap text 1 ↔ text 2">
                    <Button
                        variant="outlined"
                        onClick={swapEditors}
                        size="small"
                        startIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
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

            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                <Chip label={<span style={{ color: theme.palette.error.main }}>[- deleted -]</span>} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }} />
                <Chip label={<span style={{ color: theme.palette.success.main }}>[+ added +]</span>} sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` }} />
            </Box>

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
                            Original Text
                        </Typography>
                        {text1 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={() => copyText(text1, "Original")} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={() => downloadText(text1, "original.txt")} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear">
                                    <IconButton onClick={() => { setText1(""); setDiffResult(""); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={text1} placeholder="Paste the original text here..." onChange={(val) => setText1(val || "")} />
                    </Box>
                </Box>

                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Modified Text
                        </Typography>
                        {text2 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={() => copyText(text2, "Modified")} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={() => downloadText(text2, "modified.txt")} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear">
                                    <IconButton onClick={() => { setText2(""); setDiffResult(""); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={text2} placeholder="Paste the modified text here..." onChange={(val) => setText2(val || "")} />
                    </Box>
                </Box>
            </Box>

            {diffResult && (
                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Diff Result
                    </Typography>
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1.5,
                            border: `1px solid ${theme.palette.divider}`,
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            maxHeight: 300,
                            overflow: "auto",
                            "& del": {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                color: theme.palette.error.main,
                                textDecoration: "line-through",
                            },
                            "& ins": {
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                color: theme.palette.success.main,
                                textDecoration: "none",
                            },
                        }}
                        dangerouslySetInnerHTML={{ __html: diffResult }}
                    />
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
