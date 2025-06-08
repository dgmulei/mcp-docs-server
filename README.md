# MCP Documentation Server

An MCP server that provides structured access to Model Context Protocol documentation, examples, and troubleshooting guides.

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

1. Clone and install dependencies:
```bash
git clone https://github.com/dgmulei/mcp-docs-server.git
cd mcp-docs-server
npm install
```

2. Populate documentation (see Data Setup below)

3. Build and run:
```bash
npm run build
npm start
```

4. For development:
```bash
npm run dev
```

## Data Setup

This server requires documentation files in the `data/` directory. Copy your MCP documentation:

```bash
# Copy documentation files to data directory
cp /path/to/your/mcp-docs/*.md data/specifications/
cp /path/to/examples/*.md data/examples/
# etc.
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

## Contributing

To add new documentation:

1. Add markdown files to appropriate `data/` subdirectory
2. Restart the server (documentation is loaded on startup)

Documentation will be automatically categorized and indexed for search.
