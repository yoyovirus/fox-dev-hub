"use client";

import React, { memo } from "react";
import { alpha, useTheme, Box } from "@mui/material";
import { SvgIcon } from "@mui/material";
import { getToolColor } from "@/lib/toolColors";
import { getToolIconPath } from "@/lib/toolIcons";

interface ToolIconProps {
  toolName: string;
  isActive?: boolean;
  size?: number;
}

/**
 * Custom SVG icon component for tools
 * Memoized to prevent unnecessary re-renders
 */
export const ToolIcon = memo(function ToolIcon({ toolName, isActive = false, size = 32 }: ToolIconProps) {
  const theme = useTheme();
  const toolColor = getToolColor(toolName);
  const iconPath = getToolIconPath(toolName);

  if (!iconPath) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.text.secondary, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          fontWeight: 700,
          color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
          flexShrink: 0,
        }}
      >
        ?
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 1,
        backgroundColor: isActive
          ? alpha(toolColor, 0.15)
          : alpha(toolColor, 0.08),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        transition: "background-color 0.2s ease",
      }}
    >
      <SvgIcon
        viewBox="0 0 24 24"
        sx={{
          width: size - 6,
          height: size - 6,
          flexShrink: 0,
          color: toolColor,
        }}
      >
        <g dangerouslySetInnerHTML={{ __html: iconPath }} />
      </SvgIcon>
    </Box>
  );
});

