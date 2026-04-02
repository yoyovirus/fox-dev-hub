/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect, useMemo } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Snackbar,
    Divider, alpha, useTheme, Paper, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function TextStatisticsPage() {
    const [input, setInput] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Text Statistics - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const stats = useMemo(() => {
        if (!input) {
            return {
                characters: 0,
                charactersNoSpaces: 0,
                words: 0,
                lines: 0,
                sentences: 0,
                paragraphs: 0,
                avgWordLength: 0,
                readingTime: "0 sec",
                speakingTime: "0 sec",
                mostFrequentWord: "-",
                uniqueWords: 0,
            };
        }

        const characters = input.length;
        const charactersNoSpaces = input.replace(/\s/g, '').length;
        const words = input.trim() ? input.trim().split(/\s+/).length : 0;
        const lines = input.split('\n').length;
        const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim()).length || (input.trim() ? 1 : 0);
        
        const wordList = input.toLowerCase().match(/\b\w+\b/g) || [];
        const avgWordLength = words > 0 ? (wordList.reduce((acc, word) => acc + word.length, 0) / words).toFixed(2) : 0;
        
        const readingSpeed = 200; // words per minute
        const readingTimeMinutes = words / readingSpeed;
        const readingTime = readingTimeMinutes < 1 
            ? `${Math.ceil(readingTimeMinutes * 60)} sec` 
            : `${Math.ceil(readingTimeMinutes)} min`;
        
        const speakingSpeed = 130; // words per minute
        const speakingTimeMinutes = words / speakingSpeed;
        const speakingTime = speakingTimeMinutes < 1 
            ? `${Math.ceil(speakingTimeMinutes * 60)} sec` 
            : `${Math.ceil(speakingTimeMinutes)} min`;
        
        const wordFrequency: Record<string, number> = {};
        wordList.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        const uniqueWords = Object.keys(wordFrequency).length;
        let mostFrequentWord = "-";
        let maxCount = 0;
        Object.entries(wordFrequency).forEach(([word, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostFrequentWord = `${word} (${count})`;
            }
        });

        return {
            characters,
            charactersNoSpaces,
            words,
            lines,
            sentences,
            paragraphs,
            avgWordLength,
            readingTime,
            speakingTime,
            mostFrequentWord,
            uniqueWords,
        };
    }, [input]);

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
        a.download = "text.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearEditor = () => {
        setInput("");
    };

    const loadSample = () => {
        setInput(`The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.
        
Pangrams are often used for font previews and keyboard testing. They're also popular in typing practice and speed tests.

How many words can you count in this text?`);
    };

    const StatCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
        <Paper
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: color ? alpha(color, 0.08) : "background.paper",
                border: `1px solid ${color ? alpha(color, 0.3) : theme.palette.divider}`,
                textAlign: "center",
            }}
        >
            <Typography variant="h4" fontWeight={800} sx={{ color: color || "text.primary", mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Text Statistics"
                toolColor={getToolColor("Text Statistics")}
                description="Get detailed statistics about your text including word count, characters, and more."
            />

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
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Characters" value={stats.characters} color={theme.palette.primary.main} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="No Spaces" value={stats.charactersNoSpaces} color={theme.palette.secondary.main} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Words" value={stats.words} color={theme.palette.success.main} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Lines" value={stats.lines} color={theme.palette.info.main} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Sentences" value={stats.sentences} color={theme.palette.warning.main} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Paragraphs" value={stats.paragraphs} color={theme.palette.error.main} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Avg Word Len" value={stats.avgWordLength} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Unique Words" value={stats.uniqueWords} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Reading Time" value={stats.readingTime} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(33.333% - 14px)", md: "0 0 calc(16.666% - 14px)" } }}>
                    <StatCard label="Speaking Time" value={stats.speakingTime} />
                </Box>
                <Box sx={{ flex: { xs: "0 0 calc(50% - 8px)", sm: "0 0 calc(66.666% - 14px)", md: "0 0 calc(33.333% - 14px)" } }}>
                    <StatCard label="Most Frequent" value={stats.mostFrequentWord} />
                </Box>
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
                            Input Text
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
                        <Editor value={input} placeholder="Paste your text here to see statistics..." onChange={(val) => setInput(val || "")} />
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
