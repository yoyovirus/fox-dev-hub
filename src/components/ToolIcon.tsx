"use client";

import React from "react";
import { alpha, useTheme, Box } from "@mui/material";
import { SvgIcon } from "@mui/material";
import { getToolColor } from "@/lib/toolColors";

interface ToolIconProps {
  toolName: string;
  isActive?: boolean;
  size?: number;
}

/**
 * Custom SVG icon component for tools
 * Maps tool names to their corresponding custom SVG icons
 */
export function ToolIcon({ toolName, isActive = false, size = 32 }: ToolIconProps) {
  const theme = useTheme();
  const toolColor = getToolColor(toolName);

  if (!iconContent[toolName]) {
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
        <g dangerouslySetInnerHTML={{ __html: iconContent[toolName] || "" }} />
      </SvgIcon>
    </Box>
  );
}

const iconContent: Record<string, string> = {
  "JSON Formatter": `<path d="M9 4L5 12L9 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4L19 12L15 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Validator": `<path d="M12 2L6 6V12C6 17.5 9 21 12 21C15 21 18 17.5 18 12V6L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12L11.5 14.5L15.5 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Diff": `<path d="M9 7L13.5 12L9 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7L10.5 12L15 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Visualizer": `<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 6V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="19" r="2" fill="currentColor"/><circle cx="17" cy="19" r="2" fill="currentColor"/>`,
  "JSON Type Generator": `<path d="M9 4L5 12L9 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4L19 12L15 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 15L13 18L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON to Table": `<rect x="5" y="5" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="2"/><path d="M5 10H19" stroke="currentColor" stroke-width="2"/><path d="M5 16H19" stroke="currentColor" stroke-width="2"/><path d="M12 5V19" stroke="currentColor" stroke-width="2"/>`,
  "JSON Path Tester": `<circle cx="10" cy="10" r="5" stroke="currentColor" stroke-width="2"/><path d="M14 14L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 10H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "JSON Relationship Visualizer": `<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 6V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="19" r="2" fill="currentColor"/><circle cx="17" cy="19" r="2" fill="currentColor"/>`,
  "Base64 Encoder / Decoder": `<path d="M8 8L5 12L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8L19 12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Image to Base64": `<rect x="4" y="5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="2"/><path d="M7 11L9 9L11 11L14 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 10H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 8L20 10L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "Base64 to Image": `<path d="M4 10H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 8L8 10L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="2"/><path d="M13 11L15 9L17 11L20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
};

