# SVG to Sticker Converter

A beautiful, client-side web application to convert SVG icons into high-quality PNG stickers with a customizable background effect. Built with React, Vite, and Tailwind CSS.

## Features

- **SVG to PNG Conversion**: Upload any SVG and get a high-quality PNG output.
- **Sticker Effect**: Create a "sticker" look with a contoured background shape that hugs your icon.
- **Customization**:
  - Adjustable **Dimensions** (width/height)
  - **Padding** control
  - **Background Color** transparency support
  - **Sticker Color** & **Sticker Padding** settings
- **Client-Side Only**: Works efficiently in the browser using the Canvas API. No data is sent to any server.

## Usage

1.  **Upload**: Drag & drop an SVG file or click to browse.
2.  **Configure**: Use the sidebar to adjust size, padding, and colors.
3.  **Sticker Mode**: Enable "Sticker Effect" to add a background contour.
4.  **Download**: Click "Download PNG" to save your creation.

## Development

This project uses `pnpm` as the package manager.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```
