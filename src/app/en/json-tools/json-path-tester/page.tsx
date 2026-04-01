/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Alert, Snackbar,
    Chip, alpha, useTheme, Divider, Paper, TextField, InputAdornment
} from "@mui/material";
import {
    ContentCopy, Download as DownloadIcon, DeleteOutline,
    Search as SearchIcon, FilterList as FilterIcon,
} from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";
import { SAMPLE_JSON_PATH_TESTER } from "@/lib/sampleData";

// ── Dynamic path generator ────────────────────────────────────────────────────
interface DynamicPath { label: string; path: string; desc: string; }

function generateDynamicPaths(json: unknown): DynamicPath[] {
    if (json === null || json === undefined) return [];

    const paths: DynamicPath[] = [];

    // 1. Root
    paths.push({ label: "$", path: "$", desc: "Root object" });

    // Find first top-level property
    if (typeof json === "object" && !Array.isArray(json)) {
        const topKeys = Object.keys(json as Record<string, unknown>);
        if (topKeys.length === 0) return paths;

        const firstKey = topKeys[0];
        const firstVal = (json as Record<string, unknown>)[firstKey];

        // 2. $.firstKey
        paths.push({ label: `$.${firstKey}`, path: `$.${firstKey}`, desc: "Child property" });

        // Look for the first nested array (either firstVal itself or one level deeper)
        let arrayPath: string | null = null;
        let arrayVal: unknown[] | null = null;

        if (Array.isArray(firstVal)) {
            arrayPath = `$.${firstKey}`;
            arrayVal = firstVal as unknown[];
        } else if (firstVal && typeof firstVal === "object" && !Array.isArray(firstVal)) {
            // one level deeper
            for (const [k, v] of Object.entries(firstVal as Record<string, unknown>)) {
                if (Array.isArray(v)) {
                    arrayPath = `$.${firstKey}.${k}`;
                    arrayVal = v as unknown[];
                    // 2b. insert intermediate path if we went one deeper
                    if (paths.length === 2) {
                        paths.push({ label: arrayPath, path: arrayPath, desc: "Child property" });
                    }
                    break;
                }
            }
        }

        if (arrayPath && arrayVal) {
            // 3. $.path.to.array[0]
            paths.push({ label: `${arrayPath}[0]`, path: `${arrayPath}[0]`, desc: "Array index" });
 
            // 4. $.path.to.array[*]
            paths.push({ label: `${arrayPath}[*]`, path: `${arrayPath}[*]`, desc: "All children" });

            // 5. $.path.to.array[*].firstProperty  (from first array item)
            const firstItem = arrayVal[0];
            if (firstItem && typeof firstItem === "object" && !Array.isArray(firstItem)) {
                const itemKeys = Object.keys(firstItem as Record<string, unknown>);
                if (itemKeys.length > 0) {
                    const prop = itemKeys[0];
                    paths.push({ label: `${arrayPath}[*].${prop}`, path: `${arrayPath}[*].${prop}`, desc: "Nested path" });
                }
            }

            // 6. $..key — recursive descent (only if that key appears at multiple levels)
            // Collect all keys across the whole document and find duplicates across levels
            const keyDepths: Record<string, Set<number>> = {};
            function collectKeys(val: unknown, depth: number) {
                if (Array.isArray(val)) {
                    val.forEach(v => collectKeys(v, depth + 1));
                } else if (val && typeof val === "object") {
                    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
                        if (!keyDepths[k]) keyDepths[k] = new Set();
                        keyDepths[k].add(depth);
                        collectKeys(v, depth + 1);
                    }
                }
            }
            collectKeys(json, 0);
            // A key that appears at 2+ distinct depths is a good recursive candidate
            const recursiveKey = Object.entries(keyDepths).find(([, depths]) => depths.size >= 2)?.[0];
            if (recursiveKey) {
                paths.push({ label: `$..${recursiveKey}`, path: `$..${recursiveKey}`, desc: "Nested path" });
            }

            // 7. Array slice — only if array has 2+ items
            if (arrayVal.length >= 2) {
                const end = Math.min(arrayVal.length, 2);
                paths.push({ label: `${arrayPath}[0:${end}]`, path: `${arrayPath}[0:${end}]`, desc: "Nested path" });
            }
        }
    } else if (Array.isArray(json)) {
        // Root is an array
        paths.push({ label: "$[0]", path: "$[0]", desc: "Array index" });
        paths.push({ label: "$[*]", path: "$[*]", desc: "All children" });
        const firstItem = (json as unknown[])[0];
        if (firstItem && typeof firstItem === "object" && !Array.isArray(firstItem)) {
            const prop = Object.keys(firstItem as Record<string, unknown>)[0];
            if (prop) paths.push({ label: `$[*].${prop}`, path: `$[*].${prop}`, desc: "Nested path" });
        }
        if ((json as unknown[]).length >= 2) {
            paths.push({ label: "$[0:2]", path: "$[0:2]", desc: "Nested path" });
        }
    }

    return paths;
}

// --- Minimal JSONPath engine (no external deps) ---
function jsonPathEval(json: unknown, path: string): { results: unknown[]; error: string | null } {
    try {
        const tokens = tokenizePath(path);
        const results = evaluate(json, tokens);
        return { results, error: null };
    } catch (e: unknown) {
        return { results: [], error: e instanceof Error ? e.message : String(e) };
    }
}

function tokenizePath(path: string): string[] {
    if (!path.startsWith("$")) throw new Error("JSONPath must start with $");
    // Split into tokens: handle dot notation, bracket notation
    const tokens: string[] = ["$"];
    let i = 1;
    while (i < path.length) {
        if (path[i] === ".") {
            if (path[i + 1] === ".") {
                tokens.push("..");
                i += 2;
                // read next segment
                let seg = "";
                if (path[i] === "[") {
                    // recursive bracket
                    let depth = 0;
                    while (i < path.length) {
                        if (path[i] === "[") depth++;
                        if (path[i] === "]") { depth--; if (depth === 0) { seg += path[i]; i++; break; } }
                        seg += path[i++];
                    }
                    tokens.push(seg);
                } else {
                    while (i < path.length && path[i] !== "." && path[i] !== "[") seg += path[i++];
                    if (seg) tokens.push(seg);
                }
            } else {
                i++;
                let seg = "";
                while (i < path.length && path[i] !== "." && path[i] !== "[") seg += path[i++];
                if (seg && seg !== "*") tokens.push(seg);
                else if (seg === "*") tokens.push("*");
            }
        } else if (path[i] === "[") {
            let seg = "";
            let depth = 0;
            while (i < path.length) {
                if (path[i] === "[") depth++;
                if (path[i] === "]") { depth--; if (depth === 0) { seg += path[i]; i++; break; } }
                seg += path[i++];
            }
            tokens.push(seg);
        } else {
            i++;
        }
    }
    return tokens;
}

function evaluate(root: unknown, tokens: string[]): unknown[] {
    let current: unknown[] = [root];
    let i = 1; // skip "$"
    while (i < tokens.length) {
        const tok = tokens[i];
        if (tok === "..") {
            i++;
            const nextTok = tokens[i] || "*";
            const all = flatten(current);
            current = applyToken(all, nextTok, true);
        } else {
            current = applyToken(current, tok, false);
        }
        i++;
    }
    return current;
}

function flatten(nodes: unknown[]): unknown[] {
    const result: unknown[] = [];
    function recurse(val: unknown) {
        result.push(val);
        if (Array.isArray(val)) val.forEach(recurse);
        else if (val && typeof val === "object") Object.values(val as Record<string, unknown>).forEach(recurse);
    }
    nodes.forEach(recurse);
    return result;
}

function applyToken(nodes: unknown[], tok: string, recursive: boolean): unknown[] {
    const result: unknown[] = [];
    for (const node of nodes) {
        if (tok === "*") {
            if (Array.isArray(node)) result.push(...node);
            else if (node && typeof node === "object") result.push(...Object.values(node as Record<string, unknown>));
        } else if (tok.startsWith("[")) {
            const inner = tok.slice(1, -1).trim();
            if (inner === "*") {
                if (Array.isArray(node)) result.push(...node);
                else if (node && typeof node === "object") result.push(...Object.values(node as Record<string, unknown>));
            } else if (inner.startsWith("?(")) {
                // filter expression
                const expr = inner.slice(2, -1).trim();
                if (Array.isArray(node)) {
                    for (const item of node) {
                        if (evalFilter(item, expr)) result.push(item);
                    }
                }
            } else if (inner.includes(",")) {
                // multi-index
                const parts = inner.split(",").map(s => s.trim());
                if (Array.isArray(node)) {
                    for (const p of parts) {
                        const idx = parseInt(p, 10);
                        if (!isNaN(idx) && node[idx] !== undefined) result.push(node[idx]);
                    }
                }
            } else if (inner.includes(":")) {
                // slice
                const parts = inner.split(":").map(s => s.trim());
                if (Array.isArray(node)) {
                    const start = parts[0] ? parseInt(parts[0], 10) : 0;
                    const end = parts[1] ? parseInt(parts[1], 10) : node.length;
                    result.push(...node.slice(start < 0 ? node.length + start : start, end < 0 ? node.length + end : end));
                }
            } else {
                // numeric index or string key
                const idx = parseInt(inner, 10);
                if (!isNaN(idx)) {
                    if (Array.isArray(node) && node[idx] !== undefined) result.push(node[idx]);
                } else {
                    const key = inner.replace(/^['"]|['"]$/g, "");
                    if (node && typeof node === "object" && !Array.isArray(node)) {
                        const val = (node as Record<string, unknown>)[key];
                        if (val !== undefined) result.push(val);
                    }
                }
            }
        } else {
            // dot segment
            if (node && typeof node === "object" && !Array.isArray(node)) {
                const val = (node as Record<string, unknown>)[tok];
                if (val !== undefined) result.push(val);
            } else if (recursive && Array.isArray(node)) {
                for (const item of node) {
                    if (item && typeof item === "object" && !Array.isArray(item)) {
                        const val = (item as Record<string, unknown>)[tok];
                        if (val !== undefined) result.push(val);
                    }
                }
            }
        }
    }
    return result;
}

function evalFilter(item: unknown, expr: string): boolean {
    // supports: @.prop, @.prop < val, @.prop == 'val', @.prop (existence)
    try {
        const m = expr.match(/^@\.(\w+)\s*(==|!=|<|>|<=|>=)\s*(['"]?)(.+)\3$/);
        if (m) {
            const prop = m[1];
            const op = m[2];
            const raw = m[4];
            const valStr = raw;
            const itemVal = (item as Record<string, unknown>)[prop];
            const numVal = parseFloat(valStr);
            const compareVal = !isNaN(numVal) ? numVal : valStr;
            if (op === "==") return itemVal == compareVal; // eslint-disable-line eqeqeq
            if (op === "!=") return itemVal != compareVal; // eslint-disable-line eqeqeq
            if (op === "<") return (itemVal as number) < (compareVal as number);
            if (op === ">") return (itemVal as number) > (compareVal as number);
            if (op === "<=") return (itemVal as number) <= (compareVal as number);
            if (op === ">=") return (itemVal as number) >= (compareVal as number);
        }
        // existence check: @.prop
        const existence = expr.match(/^@\.(\w+)$/);
        if (existence) {
            return item != null && typeof item === "object" && existence[1] in (item as object);
        }
    } catch { /* ignore */ }
    return false;
}

export default function JsonPathTesterPage() {
    const theme = useTheme();

    const [input, setInput] = useState<string>("");
    const [pathExpr, setPathExpr] = useState<string>("$.");
    const [results, setResults] = useState<unknown[]>([]);
    const [parseError, setParseError] = useState<string | null>(null);
    const [pathError, setPathError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Derive dynamic path chips from parsed JSON (memoised to avoid recomputing on every render)
    const dynamicPaths = useMemo<DynamicPath[]>(() => {
        if (!input.trim()) return [];
        try {
            return generateDynamicPaths(JSON.parse(input));
        } catch {
            return [];
        }
    }, [input]);

    const runQuery = useCallback(() => {
        if (!input.trim()) { setResults([]); setPathError(null); return; }
        let parsed: unknown;
        try {
            parsed = JSON.parse(input);
            setParseError(null);
        } catch (e: unknown) {
            setParseError(e instanceof Error ? e.message : String(e));
            setResults([]);
            return;
        }
        if (!pathExpr.trim() || pathExpr === "$.") { setResults([]); setPathError(null); return; }
        const { results: r, error } = jsonPathEval(parsed, pathExpr);
        setPathError(error);
        setResults(error ? [] : r);
    }, [input, pathExpr]);

    useEffect(() => { runQuery(); }, [runQuery]);

    const handleCopyResults = async () => {
        const text = JSON.stringify(results, null, 2);
        await navigator.clipboard.writeText(text);
        setSnackbarMessage("Results copied!");
        setSnackbarOpen(true);
    };

    const handleDownloadResults = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "jsonpath-results.json";
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadSample = () => {
        setInput(SAMPLE_JSON_PATH_TESTER);
        setPathExpr("$.store.book[*].author");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <ToolHeader
                toolName="JSON Path Tester"
                toolColor={getToolColor("JSON Path Tester")}
                description="Test JSONPath expressions against your JSON data and see matched values instantly."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
                p: 1.25, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <TextField
                    size="small"
                    value={pathExpr}
                    onChange={e => setPathExpr(e.target.value)}
                    label="JSONPath Expression"
                    placeholder="e.g. $.store.book[*].author"
                    error={!!pathError}
                    helperText={pathError || undefined}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "#0EA5E9" }} />
                            </InputAdornment>
                        ),
                        sx: { fontSize: "0.875rem", borderRadius: 2 }
                    }}
                    sx={{
                        flexGrow: 1,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        "& .MuiFormHelperText-root": { position: "absolute", bottom: -20 }
                    }}
                />
                <Button variant="outlined" onClick={loadSample} size="small" sx={{ borderRadius: 2 }}>
                    Sample
                </Button>
                {results.length > 0 && (
                    <>
                        <Tooltip title="Copy results">
                            <IconButton onClick={handleCopyResults} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopy sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download results">
                            <IconButton onClick={handleDownloadResults} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                    </>
                )}
                {(input || pathExpr !== "$.") && (
                    <Tooltip title="Clear">
                        <IconButton onClick={() => { setInput(""); setPathExpr("$."); setResults([]); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {/* Parse errors */}
            {parseError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>Invalid JSON: {parseError}</Alert>}

            {/* Dynamic Quick Paths */}
            {dynamicPaths.length > 0 && (
                <Box sx={{ mb: 2, mt: 1.25 }}>
                    <Typography variant="caption" color="text.secondary"
                        sx={{ display: "block", mb: 0.75, fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Quick Paths
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {dynamicPaths.map(ex => (
                            <Tooltip key={ex.path} title={ex.desc} arrow>
                                <Chip
                                    label={ex.label}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setPathExpr(ex.path)}
                                    icon={<FilterIcon sx={{ fontSize: "13px !important" }} />}
                                    sx={{
                                        fontSize: "0.72rem",
                                        cursor: "pointer", height: 26,
                                        borderColor: alpha("#0EA5E9", 0.3),
                                        color: "#0EA5E9",
                                        "&:hover": { bgcolor: alpha("#0EA5E9", 0.08) },
                                        "& .MuiChip-label": { px: 0.75 },
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Split pane */}
            <Box sx={{
                flexGrow: 1, display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2, minHeight: 0, flex: 1,
            }}>
                {/* JSON Input */}
                <Box sx={{ flex: "35 1 0", minWidth: 280, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                        sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        JSON Input
                    </Typography>
                    <Box sx={{
                        flexGrow: 1, minHeight: 0, borderRadius: 2.5, overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor value={input} placeholder="Paste your JSON here..." onChange={val => setInput(val || "")} />
                    </Box>
                </Box>

                {/* Results pane */}
                <Box sx={{ flex: "65 1 0", minWidth: 280, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, ml: 0.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Results
                        </Typography>
                        {results.length > 0 && (
                            <Chip
                                label={`${results.length} match${results.length !== 1 ? "es" : ""}`}
                                size="small"
                                sx={{
                                    height: 18, fontSize: "0.65rem", fontWeight: 700,
                                    bgcolor: alpha("#0EA5E9", 0.12), color: "#0EA5E9",
                                    border: `1px solid ${alpha("#0EA5E9", 0.25)}`,
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{
                        flexGrow: 1, minHeight: 0, borderRadius: 2.5, overflow: "auto",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "background.paper",
                    }}>
                        {results.length === 0 ? (
                            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, p: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
                                    {!input.trim() ? "Enter JSON and a JSONPath expression to query." : "No results. Try a different expression."}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2 }}>
                                {results.map((r, idx) => (
                                    <Box key={idx}>
                                        {idx > 0 && <Divider sx={{ my: 1.5, opacity: 0.4 }} />}
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                            <Chip
                                                label={idx}
                                                size="small"
                                                sx={{
                                                    height: 20, fontSize: "0.65rem", fontWeight: 800,
                                                    minWidth: 28, mt: 0.5,
                                                    bgcolor: alpha("#0EA5E9", 0.1), color: "#0EA5E9",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Paper elevation={0} sx={{
                                                flex: 1, p: 1.5, borderRadius: 2,
                                                bgcolor: alpha("#0EA5E9", 0.04),
                                                border: `1px solid ${alpha("#0EA5E9", 0.12)}`,
                                                overflow: "auto",
                                            }}>
                                                <Typography component="pre" sx={{
                                                    fontSize: "0.8rem",
                                                    m: 0, whiteSpace: "pre-wrap", wordBreak: "break-all",
                                                    color: "text.primary",
                                                }}>
                                                    {typeof r === "string" ? `"${r}"` : JSON.stringify(r, null, 2)}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>



            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
        </Box>
    );
}

