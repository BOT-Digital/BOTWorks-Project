/**
 * MCP Client Service
 * Handles communication with the Azure Functions backend
 */

import {
  MCPRequest,
  MCPResponse,
  MCPServerInfo,
  MCPResource,
  MCPTool,
  HealthCheckResponse,
} from "../types/mcp";

// Default to localhost for development
const DEFAULT_API_URL = "http://localhost:7071/api";

export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the API base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Check if the backend is healthy
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Send an MCP request to the backend
   */
  private async sendRequest<T>(method: string, params?: Record<string, unknown>): Promise<MCPResponse<T>> {
    const request: MCPRequest = { method, params };

    const response = await fetch(`${this.baseUrl}/mcp-handler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Ping the MCP server
   */
  async ping(): Promise<MCPResponse<{ message: string; timestamp: string }>> {
    return this.sendRequest("ping");
  }

  /**
   * Get server information
   */
  async getServerInfo(): Promise<MCPResponse<MCPServerInfo>> {
    return this.sendRequest("getServerInfo");
  }

  /**
   * List available resources
   */
  async listResources(): Promise<MCPResponse<{ resources: MCPResource[] }>> {
    return this.sendRequest("listResources");
  }

  /**
   * List available tools
   */
  async listTools(): Promise<MCPResponse<{ tools: MCPTool[] }>> {
    return this.sendRequest("listTools");
  }

  /**
   * Call a tool
   */
  async callTool(name: string, args: Record<string, unknown>): Promise<MCPResponse<{ result: string }>> {
    return this.sendRequest("callTool", { name, arguments: args });
  }
}

// Export a singleton instance
export const mcpClient = new MCPClient();
