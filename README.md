# लेखना · Lekhana — Indian Word Processor

A **production-ready word processor built for India**, inspired by Microsoft Word. Write in English, Hindi, and every major Indian language — then export to Word (.docx), PDF, HTML, or print.

Built with **React 19 + TipTap (ProseMirror) + Tailwind CSS**, and shipped as a single self-contained HTML file.

## ✨ Features

- **Full rich-text editing** — bold, italic, underline, strikethrough, subscript, superscript, inline code, text colour & highlighting
- **Fonts for India** — Noto family + Mangal, Nirmala UI, Lohit, Shruti, Vani, Meera, Gautami, Latha, Vrinda, Gargi, Kokila (full Unicode support for Devanagari, Bengali, Tamil, Telugu, Malayalam, Gujarati, Kannada, Gurmukhi, Oriya)
- **Paragraph tools** — headings 1–6, bulleted/numbered/to-do lists, text alignment, line spacing, block quotes, code blocks, horizontal rules
- **Insert** — tables (with header rows), images (upload or URL), hyperlinks, the ₹ rupee symbol, and today's date
- **Find & replace** — with match highlighting, case / whole-word options, replace one or all
- **Page setup** — A4 / Letter / Legal / A5, portrait & landscape, custom margins (mm)
- **Page layout** — print-layout view on an A4 page, focus mode, web layout, ruler, zoom (50–200%)
- **Templates for India** — leave application, affidavit, rent agreement, Aadhaar correction, PAN application, police complaint, invoice (with GST), resume, Hindi letter, letterhead, and more
- **Autosave** — work is saved automatically to your browser's local storage (nothing is uploaded)
- **Export** — genuine `.docx` (opens natively in MS Word, with lists, tables and images), `.pdf`/print, `.html`, `.txt`, and `.json` backup

## 🚀 Getting started

```bash
npm install
npm run dev        # local development
npm run build      # production build → dist/index.html (single file)
npm run preview    # preview the production build
```

## ☁️ Deploy

This repo is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys the single-file app to **GitHub Pages** on every push to `main`. Just enable Pages → **Source: GitHub Actions** in the repository settings.

## 🗂 Project structure

```
src/
  components/      Title bar, menu bar, ribbon toolbar, ruler, status bar, dialogs
  editor/          TipTap extensions (font size, line height, search & replace) + provider
  utils/           fonts, storage, templates, .docx exporter
  App.tsx          Layout shell
```

## ℹ️ Note

Documents are stored **only in your browser** via `localStorage` — no account, no cloud, fully private.
