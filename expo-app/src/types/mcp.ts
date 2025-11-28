/**
 * MCP (Model Context Protocol) Types
 */

export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities: string[];
}

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPRequest {
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}
