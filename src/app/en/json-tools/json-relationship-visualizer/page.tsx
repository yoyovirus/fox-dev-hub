/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Alert, Snackbar,
    Chip, alpha, useTheme, Divider, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import {
    DeleteOutline, Download as DownloadIcon,
    AccountTree as TreeIcon, TableChart as TableIcon,
    FitScreen as FitScreenIcon,
    ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";

const SAMPLE_JSON = `{
  "company": {
    "name": "TechCorp",
    "founded": 2010,
    "departments": [
      {
        "id": "eng",
        "name": "Engineering",
        "head": "Alice Johnson",
        "employees": [
          { "id": "e1", "name": "Bob Smith", "role": "Backend Dev", "yearsExp": 5 },
          { "id": "e2", "name": "Carol White", "role": "Frontend Dev", "yearsExp": 3 }
        ]
      },
      {
        "id": "mkt",
        "name": "Marketing",
        "head": "Dave Lee",
        "employees": [
          { "id": "e3", "name": "Eve Brown", "role": "SEO Specialist", "yearsExp": 4 }
        ]
      }
    ],
    "products": [
      { "sku": "P001", "name": "DevKit Pro", "price": 299, "tags": ["dev", "tools"] },
      { "sku": "P002", "name": "CloudSync", "price": 99, "tags": ["cloud", "sync"] }
    ]
  }
}`;

type NodeType = "object" | "array" | "string" | "number" | "boolean" | "null";

interface TreeNode {
    id: string;
    key: string;
    path: string;
    type: NodeType;
    value: unknown;
    primitives: { key: string; value: unknown; type: NodeType; path: string }[];
    children: TreeNode[];
    depth: number;
    totalDescendants: number;
}

// == Helpers ==================================================================
function getType(val: unknown): NodeType {
    if (val === null) return "null";
    if (Array.isArray(val)) return "array";
    return typeof val as NodeType;
}

function buildTree(val: unknown, key: string, depth: number, id: string, path = ""): TreeNode {
    const type = getType(val);
    const primitives: { key: string; value: unknown; type: NodeType; path: string }[] = [];
    const children: TreeNode[] = [];
    let totalDescendants = 0;

    const currentPath = path ? (Array.isArray(val) ? path : `${path}.${key}`) : key;

    if (type === "object" || type === "array") {
        const entries = Array.isArray(val)
            ? (val as unknown[]).map((v, i): [string, unknown] => [`[${i}]`, v])
            : Object.entries(val as Record<string, unknown>);

        entries.forEach(([k, v], i) => {
            const childType = getType(v);
            const childPath = type === "array" ? `${currentPath}${k}` : `${currentPath}.${k}`;
            if (childType === "object" || childType === "array") {
                const childNode = buildTree(v, k, depth + 1, `${id}-${i}`, currentPath);
                children.push(childNode);
                totalDescendants += 1 + childNode.totalDescendants;
            } else {
                primitives.push({ key: k, value: v, type: childType, path: childPath });
            }
        });
    }

    return { id, key, path: currentPath, type, value: val, primitives, children, depth, totalDescendants };
}

const TYPE_COLORS: Record<NodeType, string> = {
    object: "#4F46E5",
    array: "#059669",
    string: "#059669",
    number: "#D97706",
    boolean: "#DC2626",
    null: "#6B7280",
};

// == Stat collector ===========================================================
interface JsonStats {
    totalKeys: number;
    depth: number;
    arrays: number;
    objects: number;
    strings: number;
    numbers: number;
    booleans: number;
    nulls: number;
}

function collectStats(val: unknown, curDepth = 0): JsonStats {
    const s: JsonStats = { totalKeys: 0, depth: curDepth, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };
    function walk(v: unknown, d: number) {
        if (v === null) { s.nulls++; return; }
        if (Array.isArray(v)) {
            s.arrays++;
            s.depth = Math.max(s.depth, d);
            v.forEach(item => walk(item, d + 1));
        } else if (typeof v === "object") {
            s.objects++;
            s.depth = Math.max(s.depth, d);
            for (const [, child] of Object.entries(v as Record<string, unknown>)) {
                s.totalKeys++;
                walk(child, d + 1);
            }
        } else if (typeof v === "string") s.strings++;
        else if (typeof v === "number") s.numbers++;
        else if (typeof v === "boolean") s.booleans++;
    }
    walk(val, curDepth);
    return s;
}

// == Tree Renderer (Vertical Tidy Tree) =======================================
const NODE_W = 240;
const HEADER_H = 36;
const ROW_H = 20;
const V_GAP = 80;
const H_GAP = 40;

interface LayoutNode {
    node: TreeNode;
    x: number;
    y: number;
    parentId?: string;
}

function getNodeHeight(node: TreeNode): number {
    return HEADER_H + (node.primitives.length * ROW_H) + (node.primitives.length > 0 ? 12 : 0);
}

function layoutTree(root: TreeNode): LayoutNode[] {
    const result: LayoutNode[] = [];
    const subtreeWidths: Record<string, number> = {};

    function calcWidth(n: TreeNode): number {
        if (n.children.length === 0) {
            subtreeWidths[n.id] = NODE_W;
            return NODE_W;
        }
        const w = n.children.reduce((sum, child) => sum + calcWidth(child), 0) + (n.children.length - 1) * H_GAP;
        subtreeWidths[n.id] = Math.max(w, NODE_W);
        return subtreeWidths[n.id];
    }
    calcWidth(root);

    function place(n: TreeNode, xOffset: number, y: number, parentId?: string) {
        const myWidth = subtreeWidths[n.id];
        const x = xOffset + myWidth / 2 - NODE_W / 2;
        result.push({ node: n, x, y, parentId });

        let currentX = xOffset;
        n.children.forEach(child => {
            place(child, currentX, y + getNodeHeight(n) + V_GAP, n.id);
            currentX += subtreeWidths[child.id] + H_GAP;
        });
    }

    place(root, 0, 0);
    return result;
}

function TreeView({ tree, stats, json }: { tree: TreeNode, stats: JsonStats | null, json: any }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 40, y: 40 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const nodes = layoutTree(tree);

    // Calculate actual content bounds
    const minX = Math.min(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxX = Math.max(...nodes.map(n => n.x + NODE_W));
    const maxY = Math.max(...nodes.map(n => n.y + getNodeHeight(n.node)));
    const contentW = maxX - minX;
    const contentH = maxY - minY;

    const nodeById: Record<string, LayoutNode> = {};
    nodes.forEach(n => { nodeById[n.node.id] = n; });

    const edges: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];
    nodes.forEach(n => {
        if (n.parentId && nodeById[n.parentId]) {
            const p = nodeById[n.parentId];
            edges.push({
                x1: p.x + NODE_W / 2,
                y1: p.y + getNodeHeight(p.node),
                x2: n.x + NODE_W / 2,
                y2: n.y,
                label: n.node.key
            });
        }
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheelManual = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            
            setZoom(prevZoom => {
                const newZoom = Math.min(Math.max(prevZoom * delta, 0.1), 3);
                
                const rect = container.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                setOffset(prevOffset => {
                    const dx = (mouseX - prevOffset.x) * (newZoom / prevZoom - 1);
                    const dy = (mouseY - prevOffset.y) * (newZoom / prevZoom - 1);
                    return { x: prevOffset.x - dx, y: prevOffset.y - dy };
                });

                return newZoom;
            });
        };

        container.addEventListener("wheel", handleWheelManual, { passive: false });
        return () => container.removeEventListener("wheel", handleWheelManual);
    }, []);

    const fit = () => {
        if (!svgRef.current || !containerRef.current) return;
        const container = containerRef.current;
        const padding = 80;
        const scaleX = (container.clientWidth - padding) / contentW;
        const scaleY = (container.clientHeight - padding) / contentH;
        const newZoom = Math.min(scaleX, scaleY, 1);
        
        const offsetX = (container.clientWidth - contentW * newZoom) / 2 - minX * newZoom;
        const offsetY = (container.clientHeight - contentH * newZoom) / 2 - minY * newZoom;
        
        setZoom(newZoom);
        setOffset({ x: offsetX, y: offsetY });
    };

    // Auto-fit on mount or tree change
    useEffect(() => {
        fit();
    }, [tree]);


    return (
        <Box 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
                flex: 1, 
                height: "100%",
                overflow: "hidden",
                position: "relative",
                borderRadius: 2.5, 
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? "#0F172A" : "#F8FAFC",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none"
            }}
        >
            {/* Floating Controls Overlay (Stats + Nav) */}
            <Box sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 20,
                display: "flex",
                gap: 2,
                p: 1.25,
                bgcolor: alpha(isDark ? "#1E293B" : "#FFFFFF", 0.9),
                backdropFilter: "blur(8px)",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
                alignItems: "center"
            }}>
                {/* Stats */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", px: 0.5 }}>
                    {stats && (
                        <>
                            {[
                                { label: "Objects", value: stats.objects, color: TYPE_COLORS.object },
                                { label: "Arrays", value: stats.arrays, color: TYPE_COLORS.array },
                                { label: "Keys", value: stats.totalKeys, color: theme.palette.text.secondary },
                                { label: "Depth", value: stats.depth, color: "#EC4899" }
                            ].map((s, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: s.color, opacity: 0.8, textTransform: "uppercase", fontSize: "0.55rem" }}>
                                        {s.label}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                                        {s.value}
                                    </Typography>
                                    {i < 3 && <Box sx={{ ml: 1, width: 3, height: 3, borderRadius: "50%", bgcolor: "divider" }} />}
                                </Box>
                            ))}
                        </>
                    )}
                </Box>

                <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                {/* Nav Buttons */}
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <Tooltip title="Fit to screen"><IconButton size="small" onClick={fit} sx={{ borderRadius: 1.5, width: 28, height: 28 }}><FitScreenIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                    <Tooltip title="Zoom in"><IconButton size="small" onClick={() => setZoom(z => Math.min(z + 0.15, 3))} sx={{ borderRadius: 1.5, width: 28, height: 28 }}><ZoomInIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                    <Tooltip title="Zoom out"><IconButton size="small" onClick={() => setZoom(z => Math.max(z - 0.15, 0.2))} sx={{ borderRadius: 1.5, width: 28, height: 28 }}><ZoomOutIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                </Box>
            </Box>


            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                style={{ display: "block" }}
            >
                <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
                    {/* Edges */}
                    <g>
                        {edges.map((e, i) => {
                            const my = (e.y1 + e.y2) / 2;
                            const path = `M${e.x1},${e.y1} C${e.x1},${my} ${e.x2},${my} ${e.x2},${e.y2}`;
                            return (
                                <g key={i}>
                                    <path
                                        d={path}
                                        fill="none"
                                        stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                                        strokeWidth={1.5}
                                    />
                                    {/* Label on path */}
                                    <rect 
                                        x={(e.x1 + e.x2) / 2 - (Math.max(e.label.length, 1) * 4)} 
                                        y={my - 8} 
                                        width={Math.max(e.label.length, 1) * 8} 
                                        height={16} 
                                        rx={4} 
                                        fill={isDark ? "#1E293B" : "#F1F5F9"} 
                                    />
                                    <text 
                                        x={(e.x1 + e.x2) / 2} 
                                        y={my + 4} 
                                        textAnchor="middle" 
                                        fontSize={10} 
                                        fontWeight="600"
                                        fontFamily="'JetBrains Mono', monospace"
                                        fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                                    >
                                        {e.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* Nodes */}
                    <g>
                        {nodes.map(({ node, x, y }) => {
                            const color = TYPE_COLORS[node.type];
                            const hHeight = HEADER_H;
                            const bHeight = (node.primitives.length * ROW_H) + (node.primitives.length > 0 ? 12 : 0);
                            const totalH = hHeight + bHeight;
                            
                            return (
                                <g key={node.id}>
                                    {/* Shadow/Glow */}
                                    <rect
                                        x={x} y={y}
                                        width={NODE_W} height={totalH}
                                        rx={12} ry={12}
                                        fill={isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)"}
                                        style={{ filter: "blur(4px)" }}
                                    />
                                    {/* Main Container */}
                                    <rect
                                        x={x} y={y}
                                        width={NODE_W} height={totalH}
                                        rx={12} ry={12}
                                        fill={isDark ? "#1E293B" : "#FFFFFF"}
                                        stroke={isDark ? alpha(color, 0.4) : alpha(color, 0.2)}
                                        strokeWidth={1.5}
                                    />
                                    
                                    {/* Header */}
                                    <path 
                                        d={`M${x},${y+12} a12,12 0 0 1 12,-12 h${NODE_W-24} a12,12 0 0 1 12,12 v${HEADER_H-12} h-${NODE_W} z`} 
                                        fill={color} 
                                    />
                                    
                                    {/* Type Icon & Label */}
                                    <text x={x + 12} y={y + 22} fontSize={12} fontWeight={800} fill="#FFFFFF" fontFamily="'JetBrains Mono', monospace">
                                        {node.type === "array" ? "ARR" : "OBJ"}
                                    </text>
                                    <text x={x + 45} y={y + 22} fontSize={13} fontWeight={700} fill="#FFFFFF" style={{ userSelect: "none" }}>
                                        {node.key === "root" ? "root" : node.key} ({node.children.length + node.primitives.length})
                                    </text>
                                    
                                    {/* Copy button */}
                                    <g 
                                        transform={`translate(${x + NODE_W - 32}, ${y + 8})`} 
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const json = JSON.stringify(node.value, null, 2);
                                            navigator.clipboard.writeText(json);
                                            setCopiedNodeId(node.id);
                                            setTimeout(() => setCopiedNodeId(null), 2000);
                                        }}
                                    >
                                        <rect width={24} height={20} rx={4} fill="rgba(255,255,255,0.2)" />
                                        {copiedNodeId === node.id ? (
                                            <path d="M7,10 L11,14 L17,6" fill="none" stroke="#4ADE80" strokeWidth={2} />
                                        ) : (
                                            <path d="M7,6 h7 v8 h-7 z M10,4 h4 v3" fill="none" stroke="#FFFFFF" strokeWidth={1.5} />
                                        )}
                                    </g>

                                    {/* Body (Primitives) */}
                                    {node.primitives.length > 0 && (
                                        <g transform={`translate(${x + 12}, ${y + HEADER_H + 8})`}>
                                            {node.primitives.map((p, pi) => (
                                                <text 
                                                    key={pi} 
                                                    y={pi * ROW_H + 10} 
                                                    fontSize={11} 
                                                    fontFamily="'JetBrains Mono', monospace"
                                                >
                                                    <tspan fill="#EC4899" fontWeight="800">{p.key} : </tspan>
                                                    <tspan fill={TYPE_COLORS[p.type]}>{String(p.value)}</tspan>
                                                </text>
                                            ))}
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </g>
            </svg>
        </Box>
    );
}

// == Summary Table ============================================================
function SummaryView({ stats, json }: { stats: JsonStats; json: unknown }) {
    const theme = useTheme();

    const rows = [
        { label: "Total Keys", value: stats.totalKeys, color: "#4F46E5" },
        { label: "Max Depth", value: stats.depth, color: "#0284C7" },
        { label: "Objects", value: stats.objects, color: "#4F46E5" },
        { label: "Arrays", value: stats.arrays, color: "#059669" },
        { label: "Strings", value: stats.strings, color: "#059669" },
        { label: "Numbers", value: stats.numbers, color: "#D97706" },
        { label: "Booleans", value: stats.booleans, color: "#DC2626" },
        { label: "Nulls", value: stats.nulls, color: "#6B7280" },
    ];

    const topEntries: { key: string; type: NodeType; children?: number }[] = [];
    if (json && typeof json === "object" && !Array.isArray(json)) {
        for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
            const t = getType(v);
            topEntries.push({ key: k, type: t, children: (t === "object" || t === "array") ? Object.keys(v as object).length : undefined });
        }
    }

    return (
        <Box sx={{ height: "100%", overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
                <Typography variant="caption" fontWeight={800} color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5, display: "block" }}>
                    Structure Analysis
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 1.5 }}>
                    {rows.map(r => (
                        <Box key={r.label} sx={{
                            p: 1.5, borderRadius: 2,
                            bgcolor: alpha(r.color, 0.07),
                            border: `1px solid ${alpha(r.color, 0.2)}`,
                            textAlign: "center",
                        }}>
                            <Typography variant="h5" fontWeight={900} sx={{ color: r.color, lineHeight: 1 }}>
                                {r.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>
                                {r.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {topEntries.length > 0 && (
                <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                        sx={{ textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5, display: "block" }}>
                        Top-Level Schema
                    </Typography>
                    <Box sx={{
                        borderRadius: 2, overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto auto",
                            gap: 0,
                        }}>
                            {["Key", "Type", "Child Count"].map(h => (
                                <Box key={h} sx={{
                                    p: 1.25, bgcolor: alpha(theme.palette.text.primary, 0.04),
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                }}>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                                        sx={{ textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.06em" }}>
                                        {h}
                                    </Typography>
                                </Box>
                            ))}
                            {topEntries.map((e, i) => (
                                <Box key={i} sx={{ display: "contents" }}>
                                    <Box sx={{ p: 1.25, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`, display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", fontWeight: 700, color: "#EC4899" }}>
                                            {e.key}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1.25, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`, display: "flex", alignItems: "center" }}>
                                        <Chip label={e.type} size="small" sx={{
                                            height: 20, fontSize: "0.65rem", fontWeight: 700,
                                            bgcolor: alpha(TYPE_COLORS[e.type], 0.12),
                                            color: TYPE_COLORS[e.type],
                                            border: `1px solid ${alpha(TYPE_COLORS[e.type], 0.25)}`,
                                        }} />
                                    </Box>
                                    <Box sx={{ p: 1.25, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "text.secondary" }}>
                                            {e.children ?? "—"}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

// == Main Page ================================================================
export default function JsonRelationshipVisualizerPage() {
    const theme = useTheme();

    useEffect(() => {
        document.title = "JSON Relationship Visualizer - FoX Dev Hub";
    }, []);
    const [input, setInput] = useState<string>("");
    const [parsedJson, setParsedJson] = useState<object | null>(null);
    const [tree, setTree] = useState<TreeNode | null>(null);
    const [stats, setStats] = useState<JsonStats | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [view, setView] = useState<"graph" | "summary">("graph");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const parse = useCallback((text: string) => {
        if (!text.trim()) { setParsedJson(null); setTree(null); setStats(null); setParseError(null); return; }
        try {
            const parsed = JSON.parse(text);
            setParsedJson(parsed as object);
            setTree(buildTree(parsed, "root", 0, "root", ""));
            setStats(collectStats(parsed));
            setParseError(null);
        } catch (e: unknown) {
            setParseError(e instanceof Error ? e.message : String(e));
            setParsedJson(null); setTree(null); setStats(null);
        }
    }, []);

    useEffect(() => { parse(input); }, [input, parse]);

    const handleDownload = () => {
        if (!parsedJson) return;
        const blob = new Blob([JSON.stringify(parsedJson, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "relationship-data.json";
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <ToolHeader
                toolName="JSON Relationship Visualizer"
                toolColor="#7C3AED"
                description="Explore JSON structures as an interactive graph and understand their relationships."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
                p: 1.25, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, v) => { if (v) setView(v); }}
                    size="small"
                >
                    <ToggleButton value="graph" sx={{ borderRadius: "8px !important", px: 1.5, gap: 0.75, fontSize: "0.78rem" }}>
                        <TreeIcon sx={{ fontSize: 16 }} /> Graph
                    </ToggleButton>
                    <ToggleButton value="summary" sx={{ borderRadius: "8px !important", px: 1.5, gap: 0.75, fontSize: "0.78rem" }}>
                        <TableIcon sx={{ fontSize: 16 }} /> Summary
                    </ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ flexGrow: 1 }} />

                <Button variant="outlined" onClick={() => setInput(SAMPLE_JSON)} size="small" sx={{ borderRadius: 2 }}>
                    Sample
                </Button>
                {parsedJson && (
                    <>
                        <Tooltip title="Download JSON">
                            <IconButton onClick={handleDownload} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                    </>
                )}
                {input && (
                    <Tooltip title="Clear">
                        <IconButton onClick={() => { setInput(""); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {parseError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>Invalid JSON: {parseError}</Alert>}

            {/* Split pane */}
            <Box sx={{
                flexGrow: 1, display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2, minHeight: 0, flex: 1,
            }}>
                {/* JSON Input */}
                <Box sx={{ flex: "35 1 0", minWidth: 260, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                        sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        JSON Input
                    </Typography>
                    <Box sx={{
                        flexGrow: 1, minHeight: 0,
                        borderRadius: 2.5, overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor
                            language="json"
                            value={input}
                            onChange={(v) => setInput(v || "")}
                            placeholder="Paste your JSON here..."
                        />
                    </Box>
                </Box>

                {/* Visualization / Summary View */}
                <Box sx={{ flex: "65 1 0", display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                        sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        {view === "graph" ? "Relationship Graph" : "Structure Summary"}
                    </Typography>
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        {!parsedJson ? (
                            <Box sx={{
                                height: "100%", display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: 1.5,
                                borderRadius: 2.5, border: `1px solid ${theme.palette.divider}`,
                                bgcolor: "background.paper",
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
                                    Paste valid JSON to visualize its structure and relationships.
                                </Typography>
                            </Box>
                        ) : view === "graph" && tree ? (
                            <TreeView tree={tree} stats={stats} json={parsedJson} />
                        ) : view === "summary" && stats ? (
                            <Box sx={{
                                height: "100%", borderRadius: 2.5, overflow: "auto",
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: "background.paper",
                            }}>
                                <SummaryView stats={stats} json={parsedJson} />
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Box>

            {/* Legend */}
            <Box sx={{
                mt: 2, p: 1.75, borderRadius: 2.5,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center",
            }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Node Types
                </Typography>
                {(Object.entries(TYPE_COLORS) as [NodeType, string][]).map(([type, color]) => (
                    <Box key={type} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
                        <Typography variant="caption" color="text.secondary">{type}</Typography>
                    </Box>
                ))}
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}
                message="Copied!" anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
        </Box>
    );
}
