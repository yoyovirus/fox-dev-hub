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
    Divider, alpha, useTheme, TextField, Slider, ToggleButtonGroup, ToggleButton, Chip
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, Refresh } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

const SYLLABLES = [
    "ba", "bo", "bi", "be", "bu", "by", "da", "do", "di", "de", "du", "dy",
    "fa", "fo", "fi", "fe", "fu", "fy", "ga", "go", "gi", "ge", "gu", "gy",
    "ha", "ho", "hi", "he", "hu", "hy", "ja", "jo", "ji", "je", "ju", "jy",
    "ka", "ko", "ki", "ke", "ku", "ky", "la", "lo", "li", "le", "lu", "ly",
    "ma", "mo", "mi", "me", "mu", "my", "na", "no", "ni", "ne", "nu", "ny",
    "pa", "po", "pi", "pe", "pu", "py", "ra", "ro", "ri", "re", "ru", "ry",
    "sa", "so", "si", "se", "su", "sy", "ta", "to", "ti", "te", "tu", "ty",
    "va", "vo", "vi", "ve", "vu", "vy", "wa", "wo", "wi", "we", "wu", "wy",
    "za", "zo", "zi", "ze", "zu", "zy", "cha", "cho", "chi", "che", "chu",
    "sha", "sho", "shi", "she", "shu", "thy", "tho", "thi", "the", "thu",
    "bla", "blo", "bli", "ble", "blu", "bra", "bro", "bri", "bre", "bru",
    "cla", "clo", "cli", "cle", "clu", "dra", "dro", "dri", "dre", "dru",
    "fla", "flo", "fli", "fle", "flu", "gra", "gro", "gri", "gre", "gru",
    "pla", "plo", "pli", "ple", "plu", "pra", "pro", "pri", "pre", "pru",
    "stra", "stro", "stri", "stre", "stru", "tra", "tro", "tri", "tre", "tru",
];

const WORD_ENDINGS = ["", "s", "ing", "ed", "er", "est", "ly", "ness", "tion", "ment"];
const SENTENCE_STARTERS = ["Blabber", "Flumox", "Quizzle", "Snarf", "Glimmer", "Zorp", "Squibble", "Frazzle"];
const CONNECTORS = ["and", "but", "or", "so", "yet", "for", "nor", "while", "whereas", "although"];

export default function BlabberPage() {
    const [output, setOutput] = useState<string>("");
    const [paragraphs, setParagraphs] = useState<number>(3);
    const [sentencesPerParagraph, setSentencesPerParagraph] = useState<number>(5);
    const [wordsPerParagraph, setWordsPerParagraph] = useState<number>(40);
    const [wordStyle, setWordStyle] = useState<"simple" | "complex" | "mixed">("simple");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Blabber - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const generateSyllables = () => {
        const count = wordStyle === "simple" ? Math.floor(Math.random() * 2) + 1 :
                      wordStyle === "complex" ? Math.floor(Math.random() * 3) + 2 :
                      Math.floor(Math.random() * 3) + 1;
        let word = "";
        for (let i = 0; i < count; i++) {
            word += SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
        }
        const ending = WORD_ENDINGS[Math.floor(Math.random() * WORD_ENDINGS.length)];
        return word + ending;
    };

    const generateWord = () => {
        if (Math.random() < 0.1) {
            return SENTENCE_STARTERS[Math.floor(Math.random() * SENTENCE_STARTERS.length)];
        }
        return generateSyllables();
    };

    const generateSentence = (index: number) => {
        const words: string[] = [];
        const wordsPerSentence = Math.max(3, Math.floor(wordsPerParagraph / sentencesPerParagraph));
        
        if (index === 0 && Math.random() < 0.5) {
            words.push(SENTENCE_STARTERS[Math.floor(Math.random() * SENTENCE_STARTERS.length)]);
        }
        
        for (let i = words.length; i < wordsPerSentence; i++) {
            if (i > 0 && Math.random() < 0.15) {
                words.push(CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)]);
            }
            words.push(generateWord());
        }
        
        const sentence = words.join(" ");
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    };

    const generateParagraph = (index: number) => {
        const sentences: string[] = [];
        for (let i = 0; i < sentencesPerParagraph; i++) {
            sentences.push(generateSentence(i));
        }
        return sentences.join(" ");
    };

    const generate = () => {
        const paragraphsArray: string[] = [];
        for (let i = 0; i < paragraphs; i++) {
            paragraphsArray.push(generateParagraph(i));
        }
        setOutput(paragraphsArray.join("\n\n"));
    };

    // Auto-generate when settings change
    useEffect(() => {
        generate();
    }, [paragraphs, sentencesPerParagraph, wordStyle, wordsPerParagraph]);

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
        a.download = "blabber.txt";
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
                toolName="Blabber"
                toolColor={getToolColor("Blabber")}
                description="Generate random placeholder text similar to Lorem Ipsum."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <ToggleButtonGroup
                    value={wordStyle}
                    onChange={(e, val) => val && setWordStyle(val)}
                    size="small"
                    exclusive
                    sx={{ borderRadius: 2 }}
                >
                    <ToggleButton value="simple" sx={{ borderRadius: 2, px: 1.5 }}>Simple</ToggleButton>
                    <ToggleButton value="mixed" sx={{ borderRadius: 2, px: 1.5 }}>Mixed</ToggleButton>
                    <ToggleButton value="complex" sx={{ borderRadius: 2, px: 1.5 }}>Complex</ToggleButton>
                </ToggleButtonGroup>
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
                            Generated Blabber Text
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
                        <Editor value={output} onChange={() => {}} readOnly placeholder="Click Generate to create Blabber text..." />
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
