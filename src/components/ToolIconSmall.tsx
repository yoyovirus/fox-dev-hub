"use client";

import React, { memo } from "react";
import { SvgIcon } from "@mui/material";
import { getToolColor } from "@/lib/toolColors";

interface ToolIconSmallProps {
  toolName: string;
  size?: number;
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
  "Text Compare": `<path d="M9 9V4L15 9H9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 15V20L9 15H15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 9V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 9V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Case Converter": `<path d="M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 17H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Line Tools": `<path d="M5 7H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 17H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`,
  "Text Diff": `<path d="M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 17H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 10L19 13L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "Find & Replace": `<circle cx="10" cy="10" r="5" stroke="currentColor" stroke-width="2"/><path d="M14 14L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 10H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 7V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Text Statistics": `<path d="M7 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 12V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" stroke-width="2"/>`,
  "Anagram": `<path d="M7 7L12 12L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 7L17 12L13 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7L7 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Remove Duplicates": `<circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="2"/><circle cx="15" cy="15" r="4" stroke="currentColor" stroke-width="2"/><path d="M11 11L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  "Lorem Ipsum": `<path d="M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="15" cy="15" r="2" fill="currentColor"/>`,
  "Blabber": `<path d="M8 8C8 8 9 6 12 6C15 6 16 8 16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/><path d="M10 11L12 13L14 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
};

/**
 * Small icon component for tool cards on home page
 * Memoized to prevent unnecessary re-renders
 */
export const ToolIconSmall = memo(function ToolIconSmall({ toolName, size = 20 }: ToolIconSmallProps) {
  if (!iconContent[toolName]) {
    return null;
  }

  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        color: getToolColor(toolName),
      }}
    >
      <g dangerouslySetInnerHTML={{ __html: iconContent[toolName] }} />
    </SvgIcon>
  );
});
