# Pandoc (PDF export)

[Pandoc](https://pandoc.org/) converts the tutorial MDX pages into a single PDF. It requires a LaTeX engine (`xelatex`), which is included with BasicTeX.

## Setup

**macOS (Homebrew):**

```sh
brew install pandoc
brew install --cask basictex
```

After installing BasicTeX, open a new terminal and run:

```sh
sudo tlmgr update --self
sudo tlmgr install fancyhdr
```

The `fancyhdr` package is used by the PDF header template.

**Verify installation:**

```sh
pandoc --version
xelatex --version
```

## Generate PDF Export

The `pnpm pandoc` script uses Pandoc with `xelatex` to compile all tutorial MDX pages into a single PDF. Configuration lives in `pandoc/pdf-templates/`:

- `pdf-defaults.yaml` — Pandoc defaults file listing input pages, output path, and layout options
- `pdf-header.tex` — LaTeX header (page numbering, footer)

Output is written to `pandoc/output/a11y-road-tutorial.pdf`.