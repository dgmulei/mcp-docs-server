# MCP Documentation Server

An MCP server providing structured access to Model Context Protocol documentation, examples, and troubleshooting guides for AI coding assistants.

## Purpose

This server bridges the gap between MCP specifications and working implementations by providing AI coding assistants with:

- Real-time access to complete MCP documentation
- Working code examples from proven implementations
- Troubleshooting guides for common issues
- Validation tools for compliance checking

## Tools

- `search_mcp_docs` - Search across all documentation
- `get_transport_examples` - SSE vs Streamable HTTP examples
- `troubleshoot_connection` - Debug common connection failures
- `validate_oauth_flow` - Check OAuth implementation compliance
- `get_working_templates` - Get proven server templates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Prepare documentation:
```bash
npm run prepare-docs
```

3. Build and run:
```bash
npm run build
npm start
```

4. For development:
```bash
npm run dev
```

## Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-docs": {
      "command": "node",
      "args": ["/path/to/mcp-docs-server/dist/index.js"]
    }
  }
}
```

## Data Structure

Documentation is organized in the `data/` directory:

- `specifications/` - Official MCP specs
- `implementations/` - Working code examples
- `troubleshooting/` - Problem-solution mappings
- `examples/` - Templates and guides

## Testing

Test with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Updating Documentation

### 1. Monitor Documentation Sources

Set up monitoring for MCP documentation updates:

```bash
# Official specification repository
git clone https://github.com/modelcontextprotocol/specification.git

# TypeScript SDK examples
git clone https://github.com/modelcontextprotocol/typescript-sdk.git

# Python SDK examples  
git clone https://github.com/modelcontextprotocol/python-sdk.git

# Check for updates periodically
cd specification && git pull
cd typescript-sdk && git pull
cd python-sdk && git pull
```

### 2. Adding New Documentation

```bash
# Copy new files to appropriate directories
cp new-specification.md data/specifications/
cp new-example.md data/examples/
cp troubleshooting-guide.md data/troubleshooting/

# Restart server to load new content
npm run build
npm start
```

### 3. File Format

Use frontmatter for better categorization:

```markdown
---
title: "Document Title"
tags: ["oauth", "transport", "debugging"]
category: "specification"
---

# Document Content
```

Categories: `specification`, `implementation`, `troubleshooting`, `examples`

### 4. Automated Updates (Future Enhancement)

Consider implementing:
- GitHub webhooks to monitor spec repository changes
- Scheduled jobs to fetch latest SDK examples
- Version detection for schema.ts changes
- Automated categorization based on content analysis

## SDK Integration Strategy

### Current Workflow

1. **Use this server first** for understanding MCP requirements and debugging
2. **Reference SDK repositories** for specific implementation patterns:
   - **TypeScript**: https://github.com/modelcontextprotocol/typescript-sdk/tree/main/src/examples/server
   - **Python**: https://github.com/modelcontextprotocol/python-sdk/tree/main/examples/servers
3. **Return to this server** for troubleshooting and validation

### When to Use Each Resource

**This Documentation Server:**
- Understanding Claude's specific requirements (SSE transport, OAuth 2.1, Dynamic Client Registration)
- Debugging connection failures ("Claude was unable to connect")
- Validating OAuth flow implementation
- Finding working templates (Cloudflare, SimpleScraper examples)
- Learning MCP fundamentals and architecture

**SDK Repositories:**
- Complete working server implementations
- Transport layer code (SSEServerTransport, StreamableHTTPServerTransport)
- Tool definition patterns and best practices
- Authentication implementation details
- Error handling and protocol compliance examples

### Recommendation for AI Assistants

When helping users implement MCP servers:

1. **Start with requirements**: Use `search_mcp_docs` and `troubleshoot_connection` tools from this server
2. **Get implementation patterns**: Direct users to appropriate SDK examples for their language
3. **Debug issues**: Use this server's troubleshooting tools and guides
4. **Validate compliance**: Use `validate_oauth_flow` and other validation tools

## Contributing

To add new documentation:

1. Place markdown files in appropriate `data/` subdirectory
2. Use descriptive filenames and include frontmatter
3. Run `npm run prepare-docs` to rebuild index (if script exists)
4. Restart the server to load new files

Documentation will be automatically categorized and indexed for search and retrieval.

## Architecture

The server automatically:
- Loads all `.md` files from `data/` subdirectories
- Categorizes based on folder structure and frontmatter
- Builds searchable index with Fuse.js
- Provides structured access via MCP tools

File categorization logic:
- `/specifications/` or contains "authorization", "spec" → `specification`
- `/troubleshooting/` or contains "troubleshoot", "debug" → `troubleshooting`  
- `/examples/` or contains "example", "cloudflare", "simplescraper" → `examples`
- Default → `implementation`

## Development Notes

- Documentation is loaded on server startup (restart required for new files)
- Search uses fuzzy matching across title, content, tags, and category
- Tools provide structured access optimized for AI assistant consumption
- Session management handles multiple concurrent documentation queries
