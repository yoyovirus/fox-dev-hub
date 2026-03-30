/**
 * Central tool color configuration
 * All tool-specific colors should be defined here
 */

export const TOOL_COLORS = {
  // Primary brand colors
  primary: {
    main: "#7C3AED",
    light: "#A78BFA",
    dark: "#5B21B6",
  },
  secondary: {
    main: "#DB2777",
    light: "#F472B6",
    dark: "#9D174D",
  },
  // JSON Tools
  jsonFormatter: "#7C3AED",
  jsonValidator: "#059669",
  jsonDiff: "#3B82F6",
  jsonVisualizer: "#8B5CF6",
  jsonTypeGenerator: "#0EA5E9",
  jsonToTable: "#EC4899",
  jsonPathTester: "#14B8A6",
  jsonRelationshipVisualizer: "#F97316",
  // Base64 Tools
  base64EncoderDecoder: "#6366F1",
  imageToBase64: "#10B981",
  base64ToImage: "#F472B6",
  // Status colors
  success: "#059669",
  error: "#DC2626",
  info: "#0EA5E9",
  warning: "#F97316",
} as const;

export type ToolColorKey = keyof typeof TOOL_COLORS;

/**
 * Get color by tool name
 */
export function getToolColor(toolName: string): string {
  const colorMap: Record<string, string> = {
    "JSON Formatter": TOOL_COLORS.jsonFormatter,
    "JSON Validator": TOOL_COLORS.jsonValidator,
    "JSON Diff": TOOL_COLORS.jsonDiff,
    "JSON Visualizer": TOOL_COLORS.jsonVisualizer,
    "JSON Type Generator": TOOL_COLORS.jsonTypeGenerator,
    "JSON to Table": TOOL_COLORS.jsonToTable,
    "JSON Path Tester": TOOL_COLORS.jsonPathTester,
    "JSON Relationship Visualizer": TOOL_COLORS.jsonRelationshipVisualizer,
    "Base64 Encoder / Decoder": TOOL_COLORS.base64EncoderDecoder,
    "Image to Base64": TOOL_COLORS.imageToBase64,
    "Base64 to Image": TOOL_COLORS.base64ToImage,
  };
  return colorMap[toolName] || TOOL_COLORS.primary.main;
}
