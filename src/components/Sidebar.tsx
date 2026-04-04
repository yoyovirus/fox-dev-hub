"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Drawer,
    List,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { ToolIcon } from "./ToolIcon";
import { ToolCategory } from "./ToolCategory";
import { getToolColor } from "@/lib/toolColors";
import type { ToolEntry, ToolCategory as ToolCategoryType } from "@/types";
import Image from 'next/image';

const drawerWidth = 300;
const collapsedDrawerWidth = 84;

const JSON_TOOLS: ToolEntry[] = [
    { name: "JSON Formatter", href: "/en/json-tools/json-formatter", icon: <ToolIcon toolName="JSON Formatter" size={24} />, color: getToolColor("JSON Formatter") },
    { name: "JSON Validator", href: "/en/json-tools/json-validator", icon: <ToolIcon toolName="JSON Validator" size={24} />, color: getToolColor("JSON Validator") },
    { name: "JSON Diff", href: "/en/json-tools/json-diff", icon: <ToolIcon toolName="JSON Diff" size={24} />, color: getToolColor("JSON Diff") },
    { name: "JSON Visualizer", href: "/en/json-tools/json-visualizer", icon: <ToolIcon toolName="JSON Visualizer" size={24} />, color: getToolColor("JSON Visualizer") },
    { name: "JSON Type Generator", href: "/en/json-tools/json-type-generator", icon: <ToolIcon toolName="JSON Type Generator" size={24} />, color: getToolColor("JSON Type Generator") },
    { name: "JSON to Table", href: "/en/json-tools/json-to-table", icon: <ToolIcon toolName="JSON to Table" size={24} />, color: getToolColor("JSON to Table") },
    { name: "JSON Path Tester", href: "/en/json-tools/json-path-tester", icon: <ToolIcon toolName="JSON Path Tester" size={24} />, color: getToolColor("JSON Path Tester") },
    { name: "JSON Relationship Visualizer", href: "/en/json-tools/json-relationship-visualizer", icon: <ToolIcon toolName="JSON Relationship Visualizer" size={24} />, color: getToolColor("JSON Relationship Visualizer") },
];

const BASE64_TOOLS: ToolEntry[] = [
    { name: "Base64 Encoder / Decoder", href: "/en/base64-tools/base64-encoder-decoder", icon: <ToolIcon toolName="Base64 Encoder / Decoder" size={24} />, color: getToolColor("Base64 Encoder / Decoder") },
    { name: "Image to Base64", href: "/en/base64-tools/image-to-base64", icon: <ToolIcon toolName="Image to Base64" size={24} />, color: getToolColor("Image to Base64") },
    { name: "Base64 to Image", href: "/en/base64-tools/base64-to-image", icon: <ToolIcon toolName="Base64 to Image" size={24} />, color: getToolColor("Base64 to Image") },
];

const TEXT_TOOLS: ToolEntry[] = [
    { name: "Text Compare", href: "/en/text-tools/text-compare", icon: <ToolIcon toolName="Text Compare" size={24} />, color: getToolColor("Text Compare") },
    { name: "Case Converter", href: "/en/text-tools/case-converter", icon: <ToolIcon toolName="Case Converter" size={24} />, color: getToolColor("Case Converter") },
    { name: "Line Tools", href: "/en/text-tools/line-tools", icon: <ToolIcon toolName="Line Tools" size={24} />, color: getToolColor("Line Tools") },
    { name: "Text Diff", href: "/en/text-tools/text-diff", icon: <ToolIcon toolName="Text Diff" size={24} />, color: getToolColor("Text Diff") },
    { name: "Find & Replace", href: "/en/text-tools/find-replace", icon: <ToolIcon toolName="Find & Replace" size={24} />, color: getToolColor("Find & Replace") },
    { name: "Text Statistics", href: "/en/text-tools/text-statistics", icon: <ToolIcon toolName="Text Statistics" size={24} />, color: getToolColor("Text Statistics") },
    { name: "Anagram", href: "/en/text-tools/anagram", icon: <ToolIcon toolName="Anagram" size={24} />, color: getToolColor("Anagram") },
    { name: "Remove Duplicates", href: "/en/text-tools/remove-duplicates", icon: <ToolIcon toolName="Remove Duplicates" size={24} />, color: getToolColor("Remove Duplicates") },
    { name: "Lorem Ipsum", href: "/en/text-tools/lorem-ipsum", icon: <ToolIcon toolName="Lorem Ipsum" size={24} />, color: getToolColor("Lorem Ipsum") },
    { name: "Blabber", href: "/en/text-tools/blabber", icon: <ToolIcon toolName="Blabber" size={24} />, color: getToolColor("Blabber") },
];

const TOOL_CATEGORIES: ToolCategoryType[] = [
    {
        name: "JSON Tools",
        icon: <ToolIcon toolName="JSON Formatter" size={24} />,
        tools: JSON_TOOLS,
    },
    {
        name: "Base64 Tools",
        icon: <ToolIcon toolName="Base64 Encoder / Decoder" size={24} />,
        tools: BASE64_TOOLS,
    },
    {
        name: "Text Tools",
        icon: <ToolIcon toolName="Text Compare" size={24} />,
        tools: TEXT_TOOLS,
    },
];

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(TOOL_CATEGORIES.map((cat) => [cat.name, true]))
    );

    const toggleCategory = (name: string) => {
        setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
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
                    <Image
                        src="/foxdevtools_logo.png"
                        alt="FoX Dev Tools"
                        width={56}
                        height={56}
                        priority
                        style={{ objectFit: 'contain' }}
                    />
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
                            FoX Dev Tools
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, display: "block", fontWeight: 500 }}>
                            Tools for Developers
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <List sx={{ px: 1.5, pt: 2, pb: 1 }}>
                {TOOL_CATEGORIES.map((category, index) => (
                    <ToolCategory
                        key={category.name}
                        name={category.name}
                        icon={category.icon}
                        tools={category.tools}
                        isOpen={openCategories[category.name]}
                        onToggle={() => toggleCategory(category.name)}
                        pathname={pathname}
                        open={open}
                        theme={theme}
                        isFirst={index === 0}
                    />
                ))}
            </List>

            {/* Footer */}
            <Box sx={{ mt: "auto", p: 2 }}>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                {open && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", opacity: 0.6 }}>
                        © 2026 FoX Dev Tools
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
