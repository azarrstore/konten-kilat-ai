# ⚡ Konten Kilat AI

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)
[![Status: Open Source](https://img.shields.io/badge/Status-Open%20Source-blue.svg?style=for-the-badge)]()
[![Security: Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-success.svg?style=for-the-badge&logo=security)](./SECURITY.md)

> Next-Gen marketing automation for Indonesian MSMEs powered by vision and generative AI.

---

## Overview

Konten Kilat AI is an AI-powered marketing workflow for businesses that want to turn product images into ready-to-publish social content. The system combines computer vision, generative copywriting, and campaign-oriented automation to help teams create content faster.

The project is released under the MIT License. See [LICENSE](./LICENSE) for full terms.

---

## Key Capabilities

### Visual analysis

- Detects product attributes, composition, and visual quality.
- Understands context such as lighting, styling, and product presentation.
- Uses multimodal AI to interpret product imagery.

### Copy generation

- Produces multiple copy variants for different campaign goals.
- Supports approaches such as viral, professional, and storytelling tones.
- Helps generate marketing text suited to Indonesian audiences.

### Workflow automation

- Upload product images and generate marketing-ready content.
- Shortens time from idea to draft publication.
- Supports social media sharing workflows and content reuse.

---

## Technical Architecture

Built with a modern web stack focused on performance and usability.

| Component | Technology | Role |
| :--- | :--- | :--- |
| Frontend | React | Interactive UI |
| Language | TypeScript | Type safety and developer productivity |
| Styling | Tailwind CSS | UI styling |
| AI Vision | Gemini / multimodal model | Product understanding |
| AI LLM | Kolosal / GLM-based model | Indonesian copy generation |

---

## Installation

### Prerequisites

- Node.js v20+
- Package manager (`npm`, `pnpm`, or `yarn`)
- API keys for the AI providers used by your environment

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/azarrstore/konten-kilat-ai.git
   cd konten-kilat-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env.local` file and add the required credentials for the configured AI services.

   Example:
   ```env
   GEMINI_API_KEY="your_key_here"
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

---

## Usage Guide

1. Open the app in your browser.
2. Upload a product image.
3. Let the AI analyze the image and suggest copy directions.
4. Review and refine the generated content.
5. Publish or export for your campaign workflow.

---

## Contributing

Contributions, bug reports, and feature requests are welcome.

- Open an issue for bugs or enhancement ideas.
- Submit a pull request with a clear explanation.
- Follow the project’s coding and security conventions.

---

## Security

For security concerns and responsible disclosure, please review [SECURITY.md](./SECURITY.md).

---

## Contact

For collaboration, support, or licensing discussions, contact the project maintainers.

- Azarr
- AunuHost

---

<div align="center">
  <br/>
  <b>Open source and community-friendly.</b>
  <br/>
  <i>Licensed under the MIT License.</i>
  <br/>
  <br/>
  © 2024-2026 Azarr & AunuHost (NCHMPK Team)
</div>
