# BOTWorks MCP App

A Model Context Protocol (MCP) application built with Expo (React Native) and powered by Azure App Functions services.

## Project Structure

```
BOTWorks-Project/
├── expo-app/                    # Expo React Native frontend
│   ├── App.tsx                  # Main application component
│   ├── src/
│   │   ├── services/            # API services
│   │   │   └── mcpClient.ts     # MCP client for Azure Functions
│   │   └── types/               # TypeScript type definitions
│   │       └── mcp.ts           # MCP protocol types
│   ├── app.json                 # Expo configuration
│   └── package.json             # Frontend dependencies
│
├── azure-functions/             # Azure Functions backend
│   ├── src/
│   │   └── functions/
│   │       ├── mcpHandler.ts    # MCP request handler
│   │       └── healthCheck.ts   # Health check endpoint
│   ├── host.json                # Azure Functions host config
│   ├── local.settings.json      # Local development settings
│   └── package.json             # Backend dependencies
│
└── README.md                    # This file
```

## Features

- **MCP Protocol Support**: Implements Model Context Protocol for AI tool integration
- **Azure Functions Backend**: Serverless backend with TypeScript support
- **Expo Mobile App**: Cross-platform mobile app (iOS, Android, Web)
- **Health Monitoring**: Built-in health check endpoint
- **Tool Execution**: Support for calling MCP tools from the mobile app

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Azure Functions Core Tools (for local development)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup (Azure Functions)

```bash
cd azure-functions
npm install
npm start
```

The backend will start at `http://localhost:7071/api`

### Frontend Setup (Expo App)

```bash
cd expo-app
npm install
npm start
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Scan QR code with Expo Go app on your device

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server health status

### MCP Handler
- **POST** `/api/mcp-handler`
- Handles MCP protocol requests

#### Supported Methods:
- `ping` - Test connectivity
- `getServerInfo` - Get server information
- `listResources` - List available MCP resources
- `listTools` - List available MCP tools
- `callTool` - Execute an MCP tool

## Environment Variables

### Azure Functions (`local.settings.json`)
```json
{
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

## Deployment

### Azure Functions
Deploy to Azure using Azure Functions Core Tools or Azure CLI:
```bash
func azure functionapp publish <your-function-app-name>
```

### Expo App
Build for production using Expo:
```bash
npx expo build:android
npx expo build:ios
npx expo build:web
```

## License

MIT
