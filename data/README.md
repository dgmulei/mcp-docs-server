# Documentation Data Directory

This directory contains all MCP documentation files that will be indexed and made available through the server tools.

## Structure

- `specifications/` - Official MCP specification documents
- `implementations/` - Working code examples and patterns
- `troubleshooting/` - Common issues and solutions
- `examples/` - Templates and step-by-step guides

## File Format

All files should be in Markdown format (.md) with optional frontmatter:

```markdown
---
title: "Document Title"
tags: ["oauth", "transport", "sse"]
category: "specification"
---

# Document Content

Your markdown content here...
```

## Adding Documentation

1. Place files in appropriate subdirectory
2. Use descriptive filenames
3. Include relevant tags for better searchability
4. Restart the server to load new files

The server will automatically categorize and index all markdown files for search and retrieval.

## Getting Started

To populate this directory with your MCP documentation:

```bash
# Copy your documentation files
cp /path/to/your/*.md data/specifications/
cp /path/to/examples/*.md data/examples/
cp /path/to/troubleshooting/*.md data/troubleshooting/
```

The server will load and index all documentation on startup.