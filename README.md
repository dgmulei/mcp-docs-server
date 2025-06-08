# MCP Documentation Server

An MCP server providing structured access to complete Model Context Protocol documentation, working examples, and troubleshooting guides for AI coding assistants.

## Purpose

Bridges the gap between MCP specifications and working implementations by providing real-time access to:
- Complete MCP documentation with proper categorization
- Working code examples from proven implementations  
- Troubleshooting guides for common connection failures
- Validation tools for compliance checking

## Quick Start

```bash
git clone https://github.com/dgmulei/mcp-docs-server.git
cd mcp-docs-server
npm install
npm run build
npm start
```

## Tools Available

- `search_mcp_docs` - Search across all documentation and examples
- `get_transport_examples` - Get SSE vs Streamable HTTP implementation code
- `troubleshoot_connection` - Debug "Claude won't connect" and other failures
- `validate_oauth_flow` - Check OAuth 2.1 implementation compliance
- `get_working_templates` - Access proven server templates (Cloudflare, etc.)

## Claude Desktop Integration

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mcp-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-docs-server/dist/index.js"]
    }
  }
}
```

## Testing

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# Test search functionality
# Use "search_mcp_docs" tool with query: "SSE transport claude"
# Use "troubleshoot_connection" tool with error: "Claude was unable to connect"
```

## Updating Documentation

### 1. Monitor Sources
Set up monitoring for new MCP documentation:

```bash
# Watch official spec changes
git clone https://github.com/modelcontextprotocol/specification.git
cd specification && git pull  # Check periodically

# Monitor SDK examples
git clone https://github.com/modelcontextprotocol/typescript-sdk.git
git clone https://github.com/modelcontextprotocol/python-sdk.git
```

### 2. Add New Documentation
```bash
# Add new .md files to appropriate directories
cp new-spec.md data/specifications/
cp new-example.md data/examples/  
cp troubleshooting-guide.md data/troubleshooting/

# Rebuild and restart
npm run build
npm start
```

### 3. Frontmatter Format
Add frontmatter to new files for better categorization:
```markdown
---
title: "Document Title"
tags: ["oauth", "transport", "debugging"]
category: "specification"  # or "examples", "troubleshooting", "implementation"
---
```

### 4. Automated Updates (Future)
Consider implementing:
- GitHub webhooks to monitor spec repository changes
- Scheduled jobs to fetch latest SDK examples
- Version detection for schema.ts changes

## SDK Integration Strategy

### Current Approach
Direct users to official SDK examples when they need implementation details:

**TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk/tree/main/src/examples/server

**Python SDK**: https://github.com/modelcontextprotocol/python-sdk/tree/main/examples/servers

### Usage Pattern
1. **Use this server first** for understanding requirements and debugging
2. **Reference SDK examples** for specific implementation patterns
3. **Return to this server** for troubleshooting and validation

### SDK-Specific Queries
When users need SDK code:
- Use `get_transport_examples` tool to get transport implementation patterns
- Direct to appropriate SDK repository for complete working examples
- Use `troubleshoot_connection` for debugging SDK implementation issues

## Architecture

```
data/
├── specifications/     # Official MCP specs and auth requirements
├── examples/          # Working server templates (Cloudflare, SimpleScraper)
├── implementations/   # Claude-specific requirements and patterns  
├── troubleshooting/   # Debugging guides and Inspector usage
└── README.md
```

## Contributing

To add documentation:
1. Place .md files in appropriate `data/` subdirectory
2. Include descriptive frontmatter
3. Restart server to load new content
4. Test search functionality with new content

Documentation is automatically categorized, indexed, and made searchable through the MCP tools.
