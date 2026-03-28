"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    Tooltip,
    alpha,
} from "@mui/material";
import {
    Code as CodeIcon,
    DataObject as DataObjectIcon,
    Difference as DifferenceIcon,
    CheckCircleOutline as CheckCircleIcon,
    TableChart as TableChartIcon,
    AccountTree as AccountTreeIcon,
    Search as SearchIcon,
    Share as ShareIcon,
    ExpandLess,
    ExpandMore,
    Build as BuildIcon,
} from "@mui/icons-material";

const drawerWidth = 280;
const collapsedDrawerWidth = 84;

const JSON_TOOLS = [
    { name: "JSON Formatter", href: "/en/json-tools/json-formatter", icon: <CodeIcon />, emoji: "{ }", color: "#7C3AED" },
    { name: "JSON Validator", href: "/en/json-tools/json-validator", icon: <CheckCircleIcon />, emoji: "✓", color: "#059669" },
    { name: "JSON Diff", href: "/en/json-tools/json-diff", icon: <DifferenceIcon />, emoji: "⇄", color: "#DC2626" },
    { name: "JSON Visualizer", href: "/en/json-tools/json-visualizer", icon: <AccountTreeIcon />, emoji: "❖", color: "#0284C7" },
    { name: "JSON Type Generator", href: "/en/json-tools/json-type-generator", icon: <DataObjectIcon />, emoji: "TS", color: "#B45309" },
    { name: "JSON to Table", href: "/en/json-tools/json-to-table", icon: <TableChartIcon />, emoji: "⊞", color: "#7C3AED" },
    { name: "JSON Path Tester", href: "/en/json-tools/json-path-tester", icon: <SearchIcon />, emoji: "$.", color: "#0EA5E9" },
    { name: "JSON Relationship Visualizer", href: "/en/json-tools/json-relationship-visualizer", icon: <ShareIcon />, emoji: "⇢", color: "#7C3AED" },
];

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [jsonOpen, setJsonOpen] = useState(true);

    const handleJsonClick = () => {
        setJsonOpen(!jsonOpen);
    };

    const drawerContent = (
        <>
            {/* Logo */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 2.5 : 1,
                    py: 2,
                    minHeight: 64,
                    gap: 1.5,
                    textDecoration: "none",
                    color: "inherit",
                }}
                component={Link}
                href="/"
            >
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.35)",
                        mb: open ? 1.5 : 0,
                    }}
                >
                    <Box component="img" src="/foxdevhub_logo.png" alt="FoX Dev Hub" sx={{ width: 40, height: 40, borderRadius: 1 }} />
                </Box>
                {open && (
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={800}
                            sx={{
                                lineHeight: 1.1,
                                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                mb: 0.5
                            }}
                        >
                            FoX Dev Hub
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, display: "block" }}>
                            Tools for Developers
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <List sx={{ px: 1.5, pt: 2, pb: 1 }}>
                {/* Category Header */}
                <ListItem disablePadding sx={{ display: "block" }}>
                    <Tooltip title={!open ? "JSON Tools" : ""} placement="right">
                        <ListItemButton
                            onClick={handleJsonClick}
                            sx={{
                                minHeight: 44,
                                justifyContent: open ? "initial" : "center",
                                px: 1.5,
                                borderRadius: 2.5,
                                mb: 0.5,
                                position: "relative",
                                bgcolor: jsonOpen
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : "transparent",
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 1.5 : "auto",
                                    justifyContent: "center",
                                    color: "primary.main",
                                }}
                            >
                                <DataObjectIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="JSON Tools"
                                sx={{ opacity: open ? 1 : 0 }}
                                primaryTypographyProps={{
                                    fontWeight: 700,
                                    fontSize: "0.78rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "text.secondary",
                                }}
                            />
                            {jsonOpen ? (
                                <ExpandLess sx={{ fontSize: 18, ml: open ? 0 : 1 }} />
                            ) : (
                                <ExpandMore sx={{ fontSize: 18, ml: open ? 0 : 1 }} />
                            )}
                        </ListItemButton>
                    </Tooltip>
                </ListItem>

                <Collapse in={jsonOpen && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {JSON_TOOLS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ListItemButton
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    selected={isActive}
                                    sx={{
                                        pl: 1.5,
                                        pr: 1.5,
                                        py: 1,
                                        mb: 0.5,
                                        borderRadius: 2.5,
                                        position: "relative",
                                        "&.Mui-selected": {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: "primary.main",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: 3,
                                                height: "60%",
                                                borderRadius: "0 4px 4px 0",
                                                bgcolor: "primary.main",
                                            },
                                            "& .MuiListItemIcon-root": {
                                                color: "primary.main",
                                            },
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                            },
                                        },
                                        "&:hover": {
                                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: 1.5,
                                            justifyContent: "center",
                                            color: isActive ? "primary.main" : "text.secondary",
                                            width: 32,
                                            height: 32,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 1.5,
                                                bgcolor: isActive
                                                    ? alpha(theme.palette.primary.main, 0.15)
                                                    : alpha(theme.palette.text.secondary, 0.06),
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.7rem",
                                                fontWeight: 700,
                                                color: isActive ? "primary.main" : "text.secondary",
                                                fontFamily: "'JetBrains Mono', monospace",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {item.emoji}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{
                                            fontSize: "0.875rem",
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? "primary.main" : "text.primary",
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Collapse>

                {/* Collapsed state - show icons only */}
                {!open && (
                    <Collapse in={jsonOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ mt: 0.5 }}>
                            {JSON_TOOLS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Tooltip key={item.href} title={item.name} placement="right">
                                        <ListItemButton
                                            component={Link}
                                            href={item.href}
                                            sx={{
                                                justifyContent: "center",
                                                py: 1.2,
                                                px: 1,
                                                mb: 0.5,
                                                borderRadius: 2.5,
                                                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                                                "&:hover": {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 1.5,
                                                    bgcolor: isActive
                                                        ? alpha(theme.palette.primary.main, 0.15)
                                                        : alpha(theme.palette.text.secondary, 0.06),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "0.65rem",
                                                    fontWeight: 700,
                                                    color: isActive ? "primary.main" : "text.secondary",
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                }}
                                            >
                                                {item.emoji}
                                            </Box>
                                        </ListItemButton>
                                    </Tooltip>
                                );
                            })}
                        </List>
                    </Collapse>
                )}
            </List>

            {/* Footer */}
            <Box sx={{ mt: "auto", p: 2 }}>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                {open && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", opacity: 0.6 }}>
                        © 2026 FoX Dev Hub
                    </Typography>
                )}
            </Box>
        </>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? open : true}
            onClose={isMobile ? onToggle : undefined}
            sx={{
                width: open ? drawerWidth : collapsedDrawerWidth,
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                "& .MuiDrawer-paper": {
                    width: open ? drawerWidth : collapsedDrawerWidth,
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
}
