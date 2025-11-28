import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Health Check Azure Function
 * Used to verify the Azure Functions backend is running
 */
export async function healthCheck(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Health check function processed a request.");

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "BOTWorks Azure Functions",
      version: "1.0.0",
    }),
  };
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: healthCheck,
});
