import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { mcpClient } from './src/services/mcpClient';
import { MCPServerInfo, MCPResource, MCPTool } from './src/types/mcp';

interface ConnectionStatus {
  connected: boolean;
  message: string;
}

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false, message: 'Not connected' });
  const [serverInfo, setServerInfo] = useState<MCPServerInfo | null>(null);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [toolInput, setToolInput] = useState('');
  const [toolResult, setToolResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:7071/api');

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      mcpClient.setBaseUrl(apiUrl);
      
      // Health check
      const health = await mcpClient.healthCheck();
      setConnectionStatus({ connected: true, message: `Connected to ${health.service} v${health.version}` });
      
      // Get server info
      const infoResponse = await mcpClient.getServerInfo();
      if (infoResponse.success && infoResponse.data) {
        setServerInfo(infoResponse.data);
      }
      
      // Get resources
      const resourcesResponse = await mcpClient.listResources();
      if (resourcesResponse.success && resourcesResponse.data) {
        setResources(resourcesResponse.data.resources);
      }
      
      // Get tools
      const toolsResponse = await mcpClient.listTools();
      if (toolsResponse.success && toolsResponse.data) {
        setTools(toolsResponse.data.tools);
      }
    } catch (error) {
      setConnectionStatus({ 
        connected: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleCallTool = useCallback(async () => {
    if (!toolInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await mcpClient.callTool('processData', { input: toolInput });
      if (response.success && response.data) {
        setToolResult(response.data.result);
      } else {
        setToolResult(`Error: ${response.error}`);
      }
    } catch (error) {
      setToolResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [toolInput]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>BOTWorks MCP App</Text>
        <Text style={styles.subtitle}>Powered by Azure Functions</Text>
        
        {/* Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="API URL"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleConnect}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>
          <View style={[styles.statusBadge, connectionStatus.connected ? styles.statusConnected : styles.statusDisconnected]}>
            <Text style={styles.statusText}>{connectionStatus.message}</Text>
          </View>
        </View>

        {/* Server Info Section */}
        {serverInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Server Info</Text>
            <Text style={styles.infoText}>Name: {serverInfo.name}</Text>
            <Text style={styles.infoText}>Version: {serverInfo.version}</Text>
            <Text style={styles.infoText}>Capabilities: {serverInfo.capabilities.join(', ')}</Text>
          </View>
        )}

        {/* Resources Section */}
        {resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>
            {resources.map((resource, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{resource.name}</Text>
                <Text style={styles.cardText}>{resource.description}</Text>
                <Text style={styles.cardUri}>{resource.uri}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tools Section */}
        {tools.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tools</Text>
            {tools.map((tool, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{tool.name}</Text>
                <Text style={styles.cardText}>{tool.description}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Try a Tool</Text>
            <TextInput
              style={styles.input}
              value={toolInput}
              onChangeText={setToolInput}
              placeholder="Enter input for processData tool"
            />
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleCallTool}
              disabled={loading || !toolInput.trim()}
            >
              <Text style={styles.buttonText}>Call Tool</Text>
            </TouchableOpacity>
            {toolResult ? (
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>{toolResult}</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0078d4',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#0078d4',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statusConnected: {
    backgroundColor: '#e6f7e6',
  },
  statusDisconnected: {
    backgroundColor: '#ffeaea',
  },
  statusText: {
    fontSize: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0078d4',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardUri: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
  },
  resultBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#0078d4',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});
