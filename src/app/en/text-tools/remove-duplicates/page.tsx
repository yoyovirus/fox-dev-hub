/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useMemo, useEffect } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Snackbar,
    Divider, alpha, useTheme, Checkbox, RadioGroup,
    FormControlLabel, Radio, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, FilterList } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function RemoveDuplicatesPage() {
    const [input, setInput] = useState<string>("");
    const [mode, setMode] = useState<"lines" | "words" | "characters">("lines");
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [keepEmpty, setKeepEmpty] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Remove Duplicates - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const output = useMemo(() => {
        if (!input) return "";

        if (mode === "lines") {
            let lines = input.split('\n');
            if (!keepEmpty) {
                lines = lines.filter(line => line.trim() !== '');
            }
            const seen = new Set<string>();
            const result = lines.filter(line => {
                const key = caseSensitive ? line : line.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            return result.join('\n');
        } else if (mode === "words") {
            const words = input.split(/(\s+)/);
            const seen = new Set<string>();
            const result = words.map(word => {
                if (/^\s+$/.test(word)) return word;
                const key = caseSensitive ? word : word.toLowerCase();
                if (seen.has(key)) return '';
                seen.add(key);
                return word;
            }).filter(w => w !== '' || keepEmpty);
            return result.join('');
        } else {
            const chars = input.split('');
            const seen = new Set<string>();
            const result = chars.filter(char => {
                const key = caseSensitive ? char : char.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            return result.join('');
        }
    }, [input, mode, caseSensitive, keepEmpty]);

    const stats = useMemo(() => {
        const originalCount = mode === "lines"
            ? input.split('\n').filter(l => keepEmpty || l.trim()).length
            : mode === "words"
                ? input.trim().split(/\s+/).filter(w => keepEmpty || w.trim()).length
                : input.length;
        const newCount = mode === "lines"
            ? output.split('\n').filter(l => keepEmpty || l.trim()).length
            : mode === "words"
                ? output.trim().split(/\s+/).filter(w => keepEmpty || w.trim()).length
                : output.length;
        return {
            original: originalCount,
            removed: originalCount - newCount,
            result: newCount,
        };
    }, [input, output, mode, keepEmpty]);

    const clearAll = () => {
        setInput("");
    };

    const loadSample = () => {
        setInput("apple\nbanana\nApple\ncherry\nbanana\ndate\napple\nelderberry");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Remove Duplicates"
                toolColor={getToolColor("Remove Duplicates")}
                description="Remove duplicate lines or words from your text."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.75rem" }}>Mode:</Typography>
                    <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value as any)} sx={{ gap: 0.5 }}>
                        <FormControlLabel value="lines" control={<Radio size="small" />} label="Lines" sx={{ fontSize: "0.875rem" }} />
                        <FormControlLabel value="words" control={<Radio size="small" />} label="Words" sx={{ fontSize: "0.875rem" }} />
                        <FormControlLabel value="characters" control={<Radio size="small" />} label="Chars" sx={{ fontSize: "0.875rem" }} />
                    </RadioGroup>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                <FormControlLabel
                    control={<Checkbox checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} size="small" />}
                    label="Case sensitive"
                    sx={{ fontSize: "0.875rem" }}
                />
                {mode === "lines" && (
                    <FormControlLabel
                        control={<Checkbox checked={keepEmpty} onChange={(e) => setKeepEmpty(e.target.checked)} size="small" />}
                        label="Keep empty"
                        sx={{ fontSize: "0.875rem" }}
                    />
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {input && (
                    <Tooltip title="Clear all">
                        <IconButton onClick={clearAll} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {output && (
                <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip label={`Original: ${stats.original}`} sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
                    <Chip label={`Removed: ${stats.removed}`} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main" }} />
                    <Chip label={`Result: ${stats.result}`} sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main" }} />
                </Box>
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
                            Input
                        </Typography>
                        {input && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy text">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(input); setSnackbarMessage("Input copied!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download text">
                                    <IconButton onClick={() => { const blob = new Blob([input], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "input.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
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
                        <Editor value={input} placeholder="Paste your text here..." onChange={(val) => setInput(val || "")} />
                    </Box>
                </Box>

                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Deduplicated Output
                        </Typography>
                        {output && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy result">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(output); setSnackbarMessage("Output copied!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download result">
                                    <IconButton onClick={() => { const blob = new Blob([output], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "deduplicated.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
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
                        <Editor value={output} onChange={() => {}} readOnly placeholder="Deduplicated result will appear here..." />
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
