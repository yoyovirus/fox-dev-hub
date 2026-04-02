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
    Divider, alpha, useTheme, TextField, Slider, Stack, FormControlLabel, Checkbox, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, Refresh } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

const LOREM_IPSUM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
    "accusamus", "et", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
    "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
    "quas", "molestias", "excepturi", "obcaecati", "cupiditate", "provident",
    "similique", "neque", "porro", "quisquam", "nihil", "impedit", "quo", "minus",
    "quod", "maxime", "placeat", "facere", "possimus", "omnis", "voluptas",
    "assumenda", "repellendus", "temporibus", "quibusdam", "aut", "perferendis",
    "doloribus", "asperiores", "repellat", "nam", "libero", "tempore", "cum",
    "soluta", "nobis", "eligendi", "optio", "cumque", "impedit", "quo", "porro",
    "quisquam", "est", "qui", "minus", "quod", "maxime", "placeat", "facere",
    "possimus", "omnis", "voluptas", "assumenda", "omnis", "dolor", "repellendus",
    "temporibus", "quibusdam", "aut", "perferendis", "doloribus", "asperiores",
];

const SENTENCE_STARTERS = [
    "Lorem ipsum dolor sit amet",
    "Consectetur adipiscing elit",
    "Sed do eiusmod tempor",
    "Incididunt ut labore et dolore",
    "Magna aliqua ut enim",
    "Ad minim veniam quis",
    "Nostrud exercitation ullamco",
    "Laboris nisi ut aliquip",
    "Ex ea commodo consequat",
    "Duis aute irure dolor",
    "In reprehenderit voluptate",
    "Velit esse cillum dolore",
    "Eu fugiat nulla pariatur",
    "Excepteur sint occaecat",
    "Cupidatat non proident",
];

export default function LoremIpsumPage() {
    const [output, setOutput] = useState<string>("");
    const [paragraphs, setParagraphs] = useState<number>(3);
    const [sentencesPerParagraph, setSentencesPerParagraph] = useState<number>(5);
    const [wordsPerParagraph, setWordsPerParagraph] = useState<number>(40);
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Lorem Ipsum - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const generateWord = () => {
        return LOREM_IPSUM_WORDS[Math.floor(Math.random() * LOREM_IPSUM_WORDS.length)];
    };

    const generateSentence = () => {
        const words: string[] = [];
        const wordsPerSentence = Math.max(3, Math.floor(wordsPerParagraph / sentencesPerParagraph));
        for (let i = 0; i < wordsPerSentence; i++) {
            words.push(generateWord());
        }
        return words.join(" ") + ".";
    };

    const generateParagraph = () => {
        const sentences: string[] = [];
        for (let i = 0; i < sentencesPerParagraph; i++) {
            sentences.push(generateSentence());
        }
        return sentences.join(" ");
    };

    const generate = () => {
        const paragraphsArray: string[] = [];
        for (let i = 0; i < paragraphs; i++) {
            let paragraph = generateParagraph();
            if (i === 0 && startWithLorem) {
                paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + paragraph;
            }
            paragraphsArray.push(paragraph);
        }
        setOutput(paragraphsArray.join("\n\n"));
    };

    // Auto-generate when settings change
    useEffect(() => {
        generate();
    }, [paragraphs, sentencesPerParagraph, startWithLorem, wordsPerParagraph]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lorem-ipsum.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearOutput = () => {
        setOutput("");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Lorem Ipsum"
                toolColor={getToolColor("Lorem Ipsum")}
                description="Generate placeholder Lorem Ipsum text for your designs."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Presets:</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setParagraphs(1); setSentencesPerParagraph(3); setWordsPerParagraph(30); }}
                        sx={{ borderRadius: 2, fontSize: "0.75rem", px: 1.5 }}
                    >
                        Short
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setParagraphs(3); setSentencesPerParagraph(5); setWordsPerParagraph(50); }}
                        sx={{ borderRadius: 2, fontSize: "0.75rem", px: 1.5 }}
                    >
                        Medium
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setParagraphs(5); setSentencesPerParagraph(8); setWordsPerParagraph(80); }}
                        sx={{ borderRadius: 2, fontSize: "0.75rem", px: 1.5 }}
                    >
                        Long
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setParagraphs(10); setSentencesPerParagraph(10); setWordsPerParagraph(120); }}
                        sx={{ borderRadius: 2, fontSize: "0.75rem", px: 1.5 }}
                    >
                        Article
                    </Button>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>Paragraphs:</Typography>
                    <Slider
                        value={paragraphs}
                        onChange={(e, val) => setParagraphs(val as number)}
                        min={1}
                        max={20}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ width: 150 }}
                    />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140 }}>Sentences per paragraph:</Typography>
                    <Slider
                        value={sentencesPerParagraph}
                        onChange={(e, val) => setSentencesPerParagraph(val as number)}
                        min={1}
                        max={15}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ width: 150 }}
                    />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 130 }}>Words per paragraph:</Typography>
                    <Slider
                        value={wordsPerParagraph}
                        onChange={(e, val) => setWordsPerParagraph(val as number)}
                        min={10}
                        max={200}
                        step={5}
                        valueLabelDisplay="auto"
                        sx={{ width: 150 }}
                    />
                </Box>
                <FormControlLabel
                    control={<Checkbox checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} size="small" />}
                    label="Start with Lorem Ipsum"
                    sx={{ fontSize: "0.875rem" }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={generate}
                    startIcon={<Refresh sx={{ fontSize: 16 }} />}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Generate New
                </Button>
            </Box>

            {output && (
                <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                    <Chip label={`${output.split(/\s+/).length} words`} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                    <Chip label={`${output.length} characters`} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }} />
                    <Chip label={`${paragraphs} paragraph${paragraphs !== 1 ? 's' : ''}`} sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
                </Box>
            )}

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
                            Generated Lorem Ipsum
                        </Typography>
                        {output && (
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
                                    <IconButton onClick={clearOutput} size="small" color="error" sx={{ borderRadius: 1.5 }}>
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
                        <Editor value={output} onChange={() => {}} readOnly placeholder="Click Generate to create Lorem Ipsum text..." />
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
