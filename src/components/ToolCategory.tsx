"use client";

import React from "react";
import Link from "next/link";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
    Tooltip,
    alpha,
} from "@mui/material";
import {
    ExpandLess,
    ExpandMore,
} from "@mui/icons-material";
import { ToolIcon } from "./ToolIcon";
import type { ToolCategoryProps } from "@/types";

export function ToolCategory({ name, icon, tools, isOpen, onToggle, pathname, open, theme, isFirst }: ToolCategoryProps) {
    return (
        <>
            <ListItem disablePadding sx={{ display: "block", mt: isFirst ? 0 : 1 }}>
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
