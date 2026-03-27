export interface ToolProperty {
  type: string;
  description: string;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolProperty>;
  required: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  execute: (args: any) => Promise<any>;
}
