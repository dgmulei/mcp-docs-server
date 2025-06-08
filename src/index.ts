#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { DocumentationService } from './services/DocumentationService.js';
import { ToolRegistry } from './tools/ToolRegistry.js';

class McpDocsServer {
  private server: Server;
  private docService: DocumentationService;
  private toolRegistry: ToolRegistry;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-docs-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.docService = new DocumentationService();
    this.toolRegistry = new ToolRegistry(this.docService);
    this.setupServer();
  }

  private setupServer(): void {
    // Register all tools
    this.toolRegistry.registerTools(this.server);
    
    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };
    
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    // Initialize documentation
    await this.docService.initialize();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('MCP Docs Server running on stdio');
  }
}

const server = new McpDocsServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
