import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const DOCS_DIR = path.resolve(__dirname, '../docs');
const REQUIRED_FRONTMATTER = ['title', 'description', 'sidebar_position'];

function getDocFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getDocFiles(fullPath));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasDocFiles(dir: string): boolean {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.some(
    (e) =>
      (e.isFile() && /\.(md|mdx)$/.test(e.name)) ||
      (e.isDirectory() && hasDocFiles(path.join(dir, e.name))),
  );
}

function getDocSubdirs(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      if (hasDocFiles(fullPath)) {
        dirs.push(fullPath);
        dirs.push(...getDocSubdirs(fullPath));
      }
    }
  }
  return dirs;
}

function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, '');
}

function countH1Headings(content: string): number {
  const stripped = stripCodeBlocks(content);
  const matches = stripped.match(/^# .+/gm);
  return matches ? matches.length : 0;
}

const docFiles = getDocFiles(DOCS_DIR);

describe('docs structure', () => {
  describe('required frontmatter', () => {
    it.each(docFiles.map((f) => [path.relative(DOCS_DIR, f), f]))(
      '%s has required frontmatter fields',
      (_relativePath, filePath) => {
        const raw = fs.readFileSync(filePath as string, 'utf-8');
        const { data } = matter(raw);
        for (const field of REQUIRED_FRONTMATTER) {
          expect(data, `missing frontmatter field: "${field}"`).toHaveProperty(
            field,
          );
        }
      },
    );
  });

  describe('single H1 heading', () => {
    it.each(docFiles.map((f) => [path.relative(DOCS_DIR, f), f]))(
      '%s has exactly one H1 heading',
      (_relativePath, filePath) => {
        const raw = fs.readFileSync(filePath as string, 'utf-8');
        const { content } = matter(raw);
        const h1Count = countH1Headings(content);
        expect(h1Count, `expected 1 H1 heading but found ${h1Count}`).toBe(1);
      },
    );
  });

  describe('orphan detection', () => {
    const subdirs = getDocSubdirs(DOCS_DIR);
    it.each(subdirs.map((d) => [path.relative(DOCS_DIR, d), d]))(
      '%s has a _category_.json file',
      (_relativePath, dirPath) => {
        const categoryFile = path.join(dirPath as string, '_category_.json');
        expect(
          fs.existsSync(categoryFile),
          `missing _category_.json in ${_relativePath}`,
        ).toBe(true);
      },
    );
  });
});
