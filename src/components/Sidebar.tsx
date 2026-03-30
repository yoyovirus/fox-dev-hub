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
    ExpandLess,
    ExpandMore,
} from "@mui/icons-material";
import { ToolIcon } from "./ToolIcon";

const drawerWidth = 300;
const collapsedDrawerWidth = 84;

const JSON_TOOLS = [
    { name: "JSON Formatter", href: "/en/json-tools/json-formatter", icon: <ToolIcon toolName="JSON Formatter" size={24} />, color: "#7C3AED" },
    { name: "JSON Validator", href: "/en/json-tools/json-validator", icon: <ToolIcon toolName="JSON Validator" size={24} />, color: "#059669" },
    { name: "JSON Diff", href: "/en/json-tools/json-diff", icon: <ToolIcon toolName="JSON Diff" size={24} />, color: "#DC2626" },
    { name: "JSON Visualizer", href: "/en/json-tools/json-visualizer", icon: <ToolIcon toolName="JSON Visualizer" size={24} />, color: "#0284C7" },
    { name: "JSON Type Generator", href: "/en/json-tools/json-type-generator", icon: <ToolIcon toolName="JSON Type Generator" size={24} />, color: "#B45309" },
    { name: "JSON to Table", href: "/en/json-tools/json-to-table", icon: <ToolIcon toolName="JSON to Table" size={24} />, color: "#7C3AED" },
    { name: "JSON Path Tester", href: "/en/json-tools/json-path-tester", icon: <ToolIcon toolName="JSON Path Tester" size={24} />, color: "#0EA5E9" },
    { name: "JSON Relationship Visualizer", href: "/en/json-tools/json-relationship-visualizer", icon: <ToolIcon toolName="JSON Relationship Visualizer" size={24} />, color: "#7C3AED" },
];

const BASE64_TOOLS = [
    { name: "Base64 Encoder / Decoder", href: "/en/base64-tools/base64-encoder-decoder", icon: <ToolIcon toolName="Base64 Encoder / Decoder" size={24} />, color: "#7C3AED" },
    { name: "Image to Base64", href: "/en/base64-tools/image-to-base64", icon: <ToolIcon toolName="Image to Base64" size={24} />, color: "#059669" },
    { name: "Base64 to Image", href: "/en/base64-tools/base64-to-image", icon: <ToolIcon toolName="Base64 to Image" size={24} />, color: "#0EA5E9" },
];

interface ToolCategoryProps {
    name: string;
    icon: React.ReactNode;
    tools: { name: string; href: string; icon: React.ReactNode; emoji?: React.ReactNode; color: string }[];
    isOpen: boolean;
    onToggle: () => void;
    pathname: string;
    open: boolean;
    theme: any;
}

function ToolCategory({ name, icon, tools, isOpen, onToggle, pathname, open, theme }: ToolCategoryProps) {
    return (
        <>
            <ListItem disablePadding sx={{ display: "block", mt: name === "JSON Tools" ? 0 : 1 }}>
                <Tooltip title={!open ? name : ""} placement="right">
                    <ListItemButton
                        onClick={onToggle}
                        sx={{
                            minHeight: 44,
                            justifyContent: open ? "initial" : "center",
                            px: 1.5,
                            borderRadius: 2.5,
                            mb: 0.5,
                            position: "relative",
                            bgcolor: isOpen ? alpha(theme.palette.primary.main, 0.08) : "transparent",
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
                            {icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={name}
                            sx={{ opacity: open ? 1 : 0 }}
                            primaryTypographyProps={{
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "text.secondary",
                            }}
                        />
                        {open && (isOpen ? (
                            <ExpandLess sx={{ fontSize: 18 }} />
                        ) : (
                            <ExpandMore sx={{ fontSize: 18 }} />
                        ))}
                    </ListItemButton>
                </Tooltip>
            </ListItem>

            <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                <Box sx={{
                    mx: 0.5,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.text.secondary, 0.03),
                }}>
                    <List component="div" disablePadding>
                        {tools.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ListItemButton
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    selected={isActive}
                                    sx={{
                                        pl: 2,
                                        pr: 1.5,
                                        py: 0.75,
                                        mb: 0.25,
                                        mx: 0.5,
                                        borderRadius: 2,
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
                                        {item.icon}
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
                </Box>
            </Collapse>

            {!open && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ mt: 0.5 }}>
                        {tools.map((item) => {
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
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {React.cloneElement(item.icon as React.ReactElement<{ isActive?: boolean; size?: number }>, {
                                                isActive,
                                                size: 24,
                                            })}
                                        </Box>
                                    </ListItemButton>
                                </Tooltip>
                            );
                        })}
                    </List>
                </Collapse>
            )}
        </>
    );
}

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [jsonOpen, setJsonOpen] = useState(true);
    const [base64Open, setBase64Open] = useState(true);

    const handleJsonClick = () => {
        setJsonOpen(!jsonOpen);
    };

    const handleBase64Click = () => {
        setBase64Open(!base64Open);
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
                    py: 3,
                    minHeight: 80,
                    gap: 2,
                    textDecoration: "none",
                    color: "inherit",
                }}
                component={Link}
                href="/"
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Box component="img" src="/foxdevhub_logo.png" alt="FoX Dev Hub" sx={{ width: 56, height: 56, objectFit: "contain" }} />
                </Box>
                {open && (
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: "primary.main",
                                mb: 0.5,
                                fontSize: "1.5rem"
                            }}
                        >
                            FoX Dev Hub
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, display: "block", fontWeight: 500 }}>
                            Tools for Developers
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <List sx={{ px: 1.5, pt: 2, pb: 1 }}>
                <ToolCategory
                    name="JSON Tools"
                    icon={<ToolIcon toolName="JSON Formatter" size={24} />}
                    tools={JSON_TOOLS}
                    isOpen={jsonOpen}
                    onToggle={handleJsonClick}
                    pathname={pathname}
                    open={open}
                    theme={theme}
                />

                <ToolCategory
                    name="Base64 Tools"
                    icon={<ToolIcon toolName="Base64 Encoder / Decoder" size={24} />}
                    tools={BASE64_TOOLS}
                    isOpen={base64Open}
                    onToggle={handleBase64Click}
                    pathname={pathname}
                    open={open}
                    theme={theme}
                />
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
