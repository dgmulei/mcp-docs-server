import { readFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import matter from 'gray-matter';
import Fuse from 'fuse.js';

export interface DocSection {
  id: string;
  title: string;
  content: string;
  category: 'specification' | 'implementation' | 'troubleshooting' | 'examples';
  tags: string[];
  source: string;
  lastUpdated: Date;
}

export interface SearchResult {
  section: DocSection;
  score: number;
  highlights: string[];
}

export class DocumentationService {
  private sections: DocSection[] = [];
  private searchIndex: Fuse<DocSection> | null = null;

  async initialize(): Promise<void> {
    await this.loadDocumentation();
    this.buildSearchIndex();
    console.error(`Loaded ${this.sections.length} documentation sections`);
  }

  private async loadDocumentation(): Promise<void> {
    const dataDir = join(process.cwd(), 'data');
    
    try {
      const files = await readdir(dataDir, { recursive: true });
      
      for (const file of files) {
        if (extname(file as string) === '.md') {
          await this.loadMarkdownFile(join(dataDir, file as string));
        }
      }
    } catch (error) {
      console.error('Error loading documentation:', error);
    }
  }

  private async loadMarkdownFile(filePath: string): Promise<void> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      const section: DocSection = {
        id: this.generateId(filePath),
        title: frontmatter.title || this.extractTitle(markdown),
        content: markdown,
        category: this.categorizeFile(filePath),
        tags: frontmatter.tags || [],
        source: filePath,
        lastUpdated: new Date()
      };
      
      this.sections.push(section);
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
    }
  }

  private generateId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled';
  }

  private categorizeFile(filePath: string): DocSection['category'] {
    if (filePath.includes('authorization') || filePath.includes('spec')) {
      return 'specification';
    }
    if (filePath.includes('troubleshoot') || filePath.includes('debug')) {
      return 'troubleshooting';
    }
    if (filePath.includes('example') || filePath.includes('cloudflare') || filePath.includes('simplescraper')) {
      return 'examples';
    }
    return 'implementation';
  }

  private buildSearchIndex(): void {
    this.searchIndex = new Fuse(this.sections, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.6,
      includeScore: true,
      includeMatches: true
    });
  }

  search(query: string, category?: DocSection['category']): SearchResult[] {
    if (!this.searchIndex) {
      return [];
    }

    let results = this.searchIndex.search(query);
    
    if (category) {
      results = results.filter(r => r.item.category === category);
    }

    return results.map(result => ({
      section: result.item,
      score: result.score || 0,
      highlights: this.extractHighlights(result.matches || [])
    }));
  }

  private extractHighlights(matches: any[]): string[] {
    return matches
      .slice(0, 3)
      .map(match => {
        if (match.indices && match.value) {
          const start = Math.max(0, match.indices[0][0] - 50);
          const end = Math.min(match.value.length, match.indices[0][1] + 50);
          return match.value.substring(start, end);
        }
        return '';
      })
      .filter(Boolean);
  }

  getByCategory(category: DocSection['category']): DocSection[] {
    return this.sections.filter(s => s.category === category);
  }

  getById(id: string): DocSection | undefined {
    return this.sections.find(s => s.id === id);
  }

  getAllSections(): DocSection[] {
    return [...this.sections];
  }
}