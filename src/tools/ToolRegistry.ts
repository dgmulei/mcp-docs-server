import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { DocumentationService, DocSection } from '../services/DocumentationService.js';

export class ToolRegistry {
  constructor(private docService: DocumentationService) {}

  registerTools(server: Server): void {
    // Handle tool calls
    server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search_mcp_docs':
          return this.searchDocs(args);
        case 'get_transport_examples':
          return this.getTransportExamples(args);
        case 'troubleshoot_connection':
          return this.troubleshootConnection(args);
        case 'validate_oauth_flow':
          return this.validateOAuthFlow(args);
        case 'get_working_templates':
          return this.getWorkingTemplates(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // List available tools
    server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'search_mcp_docs',
            description: 'Search across all MCP documentation, specifications, and examples',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query (e.g., "SSE transport", "OAuth flow", "Claude won\'t connect")',
                },
                category: {
                  type: 'string',
                  enum: ['specification', 'implementation', 'troubleshooting', 'examples'],
                  description: 'Filter by documentation category'
                }
              },
              required: ['query'],
            },
          },
          {
            name: 'get_transport_examples',
            description: 'Get specific transport implementation examples (SSE vs Streamable HTTP)',
            inputSchema: {
              type: 'object',
              properties: {
                transport: {
                  type: 'string',
                  enum: ['sse', 'streamable', 'both'],
                  description: 'Transport type to get examples for'
                },
                language: {
                  type: 'string',
                  enum: ['typescript', 'python', 'both'],
                  description: 'Programming language for examples'
                }
              },
              required: ['transport'],
            },
          },
          {
            name: 'troubleshoot_connection',
            description: 'Diagnose common MCP connection issues and provide solutions',
            inputSchema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  description: 'Error message or symptom (e.g., "Claude was unable to connect", "401 Unauthorized")',
                },
                client: {
                  type: 'string',
                  enum: ['claude-web', 'claude-desktop', 'inspector', 'other'],
                  description: 'MCP client being used'
                }
              },
              required: ['error'],
            },
          },
          {
            name: 'validate_oauth_flow',
            description: 'Check OAuth 2.1 implementation against MCP requirements',
            inputSchema: {
              type: 'object',
              properties: {
                endpoints: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of implemented OAuth endpoints'
                },
                features: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'OAuth features implemented (e.g., "PKCE", "dynamic registration")'
                }
              },
            },
          },
          {
            name: 'get_working_templates',
            description: 'Get proven working MCP server templates and examples',
            inputSchema: {
              type: 'object',
              properties: {
                platform: {
                  type: 'string',
                  enum: ['cloudflare', 'vercel', 'local', 'any'],
                  description: 'Deployment platform'
                },
                auth: {
                  type: 'boolean',
                  description: 'Whether authentication is required'
                }
              },
            },
          },
        ],
      };
    });
  }

  private async searchDocs(args: any) {
    const { query, category } = args;
    const results = this.docService.search(query, category);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} results for "${query}":\n\n` +
            results.slice(0, 5).map(r => 
              `**${r.section.title}** (${r.section.category})\n` +
              `${r.highlights.join('... ')}\n` +
              `Source: ${r.section.source}\n`
            ).join('\n---\n\n')
        }
      ]
    };
  }

  private async getTransportExamples(args: any) {
    const { transport, language = 'typescript' } = args;
    
    // Search for transport-specific examples
    const query = transport === 'both' ? 'transport SSE streamable' : `${transport} transport`;
    const results = this.docService.search(query, 'examples');
    
    return {
      content: [
        {
          type: 'text',
          text: `Transport examples for ${transport}:\n\n` +
            results.slice(0, 3).map(r => 
              `**${r.section.title}**\n${r.section.content.substring(0, 500)}...\n`
            ).join('\n---\n\n')
        }
      ]
    };
  }

  private async troubleshootConnection(args: any) {
    const { error, client = 'unknown' } = args;
    
    // Map common errors to solutions
    const errorMappings = {
      'unable to connect': 'transport oauth endpoints',
      '401': 'oauth authentication bearer token',
      'session not found': 'session management headers',
      'invalid grant': 'PKCE oauth flow'
    };
    
    const searchTerm = Object.entries(errorMappings)
      .find(([key]) => error.toLowerCase().includes(key))?.[1] || error;
    
    const results = this.docService.search(searchTerm, 'troubleshooting');
    
    return {
      content: [
        {
          type: 'text',
          text: `Troubleshooting "${error}" for ${client}:\n\n` +
            (results.length > 0 
              ? results.slice(0, 3).map(r => 
                  `**Solution: ${r.section.title}**\n${r.section.content.substring(0, 400)}...\n`
                ).join('\n---\n\n')
              : 'No specific troubleshooting found. Try searching for related terms.')
        }
      ]
    };
  }

  private async validateOAuthFlow(args: any) {
    const { endpoints = [], features = [] } = args;
    
    const required = [
      '/.well-known/oauth-authorization-server',
      '/.well-known/oauth-protected-resource',
      '/authorize',
      '/token'
    ];
    
    const missing = required.filter(ep => !endpoints.some(e => e.includes(ep)));
    const hasRequiredFeatures = features.includes('PKCE') && features.includes('dynamic registration');
    
    return {
      content: [
        {
          type: 'text',
          text: `OAuth Validation Results:\n\n` +
            `✅ Required endpoints: ${required.length - missing.length}/${required.length}\n` +
            (missing.length > 0 ? `❌ Missing: ${missing.join(', ')}\n` : '') +
            `✅ PKCE support: ${features.includes('PKCE') ? 'Yes' : 'No'}\n` +
            `✅ Dynamic registration: ${features.includes('dynamic registration') ? 'Yes' : 'No'}\n\n` +
            (hasRequiredFeatures && missing.length === 0 
              ? '🎉 OAuth implementation looks compliant!'
              : '⚠️  Implementation needs updates for Claude compatibility.')
        }
      ]
    };
  }

  private async getWorkingTemplates(args: any) {
    const { platform = 'any', auth = false } = args;
    
    const query = `${platform} ${auth ? 'oauth' : 'authless'} template`;
    const results = this.docService.search(query, 'examples');
    
    return {
      content: [
        {
          type: 'text',
          text: `Working templates for ${platform} (auth: ${auth}):\n\n` +
            results.slice(0, 2).map(r => 
              `**${r.section.title}**\n${r.section.content.substring(0, 600)}...\n`
            ).join('\n---\n\n')
        }
      ]
    };
  }
}