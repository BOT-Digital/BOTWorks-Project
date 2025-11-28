import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * MCP (Model Context Protocol) Handler Azure Function
 * This function serves as the main entry point for MCP requests from the Expo app
 */

interface MCPRequest {
  method: string;
  params?: {
    name?: string;
    arguments?: {
      input?: string;
    };
    [key: string]: unknown;
  };
}

interface MCPResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function mcpHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("MCP Handler function processed a request.");

  try {
    const body = (await request.json()) as MCPRequest;
    const { method, params } = body;

    let response: MCPResponse;

    switch (method) {
      case "ping":
        response = { success: true, data: { message: "pong", timestamp: new Date().toISOString() } };
        break;

      case "getServerInfo":
        response = {
          success: true,
          data: {
            name: "BOTWorks MCP Server",
            version: "1.0.0",
            capabilities: ["resources", "tools", "prompts"],
          },
        };
        break;

      case "listResources":
        response = {
          success: true,
          data: {
            resources: [
              { uri: "botworks://data", name: "Data Resource", description: "Access to application data" },
            ],
          },
        };
        break;

      case "listTools":
        response = {
          success: true,
          data: {
            tools: [
              {
                name: "processData",
                description: "Process data with AI capabilities",
                inputSchema: {
                  type: "object",
                  properties: {
                    input: { type: "string", description: "Input data to process" },
                  },
                  required: ["input"],
                },
              },
            ],
          },
        };
        break;

      case "callTool":
        if (params?.name === "processData") {
          response = {
            success: true,
            data: {
              result: `Processed: ${params.arguments?.input || "No input provided"}`,
            },
          };
        } else {
          response = { success: false, error: `Unknown tool: ${params?.name}` };
        }
        break;

      default:
        response = { success: false, error: `Unknown method: ${method}` };
    }

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    context.error("Error processing MCP request:", error);
    return {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
    };
  }
}

app.http("mcp-handler", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: mcpHandler,
});
