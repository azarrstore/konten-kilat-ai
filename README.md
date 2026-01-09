# ⚡ Konten Kilat AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Google%20AI-Gemini%20Flash-blue)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Stable-success)]()

> **Automated Marketing Caption Generator for Indonesian MSMEs.**

[View Demo](https://github.com/azarrstore/konten-kilat-AI) · [Report Bug](https://github.com/azarrstore/konten-kilat-AI/issues) · [Request Feature](https://github.com/azarrstore/konten-kilat-AI/issues)

---

## ⚠️ COPYRIGHT & LEGAL NOTICE

**Copyright © 2024-2026 Azarr & AunuHost (NCHMPK Team). All Rights Reserved.**

All source code, interface designs, graphic assets, and implementation logic within this repository are the intellectual property of the **NCHMPK Team**. While this project is open-source under the MIT License for educational and community development purposes:

1.  **Mandatory Attribution:** Any form of reuse, modification, or redistribution of this code **MUST** include full attribution to the original creators (**Azarr & AunuHost**).
2.  **No Unauthorized Commercialization:** Reselling this application as a white-label product or a paid service without written consent from the copyright holders is strictly prohibited.
3.  **Trademark Protection:** The name "Konten Kilat AI" and associated logos are the identity of this project and may not be used to promote derivative products without permission.

Violations of these terms will be pursued in accordance with applicable intellectual property laws.

---

## 📝 Table of Contents

* [About the Project](#-about-the-project)
* [Key Features](#-key-features)
* [Architecture & Tech Stack](#-architecture--tech-stack)
* [System Prerequisites](#-system-prerequisites)
* [Installation Guide](#-installation-guide)
* [How to Use](#-how-to-use)
* [Contribution](#-contribution)
* [Credits & Acknowledgements](#-credits--acknowledgements)
* [License](#-license)

---

## 🚀 About the Project

**Konten Kilat AI** is a revolutionary tech solution designed to bridge the digital gap for **Micro, Small, and Medium Enterprises (MSMEs)** in Indonesia.

Many MSME owners possess great products but struggle with crafting compelling words (*copywriting*) for digital marketing. Our mission is to democratize access to professional digital marketing. By simply uploading a product photo, business owners receive marketing content that is:
* Structured (Headline, Body, Call to Action).
* Emotional and engaging for customers.
* Optimized for social media algorithms.

The system combines the power of **Vision AI** (to "see" the product) and **Generative AI** (to "write" the story), powered by **Google Gemini Flash 2.5** and **Kolosal AI GLM 4.6**.

---

## ✨ Key Features

This application is developed with a focus on a friction-less **UX (User Experience)**:

### 1. 🧠 Intelligent Visual Analysis (AI Vision)
The system doesn't just see the image; it understands the context. The AI detects:
* Product Type & Materials.
* Aesthetics & Vibe.
* Hidden *Unique Selling Points* (USPs).

### 2. ✍️ Multi-Style Caption Generation
Generates caption variations in a single process:
* **Formal/Professional Style**: For LinkedIn or official catalogs.
* **Casual/Trend Style**: For Instagram & TikTok.
* **Hard-Selling Style**: Focused on direct sales conversion.

### 3. ⚡ One-Click Action
* **Smart Copy**: Copies text with clean line-break formatting.
* **Direct Share**: Shortcut buttons to open relevant social media apps directly.

---

## 🛠️ Architecture & Tech Stack

This project is built on a modern technology stack to ensure speed, security, and scalability.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/-React-black?logo=react) ![TS](https://img.shields.io/badge/-TypeScript-black?logo=typescript) | Interactive UI and type-safe code. |
| **Visual AI** | ![Gemini](https://img.shields.io/badge/-Gemini%20Flash%202.5-8E75B2) | Google's multimodal model for high-precision image analysis. |
| **LLM Core** | ![Kolosal AI](https://img.shields.io/badge/-Kolosal%20AI%20GLM-blue) | Natural language processing for copywriting. |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css) | Responsive and modern design. |
| **Runtime** | ![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js) | Fast JavaScript execution environment. |

---

## ⚙️ Getting Started

Follow this guide to run **Konten Kilat AI** on your local machine (Localhost).

### System Prerequisites
Ensure your device has the following installed:
* **Node.js**: Version `20.0.0` or newer.
* **npm**: Version `10.0.0` or newer.
* **Git**: To clone the repository.

### Installation Guide

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/azarrstore/konten-kilat-AI.git](https://github.com/azarrstore/konten-kilat-AI.git)
    cd konten-kilat-AI
    ```

2.  **Install Dependencies**
    Download all required libraries:
    ```bash
    npm install
    # or if using yarn
    yarn install
    ```

3.  **Environment Configuration**
    Duplicate the example `.env` file and rename it to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Open the `.env.local` file and fill in your credentials:
    ```env
    # Get your API Key at [https://aistudio.google.com/](https://aistudio.google.com/)
    GEMINI_API_KEY="AIzaSyBd..."
    
    # Other Optional Configurations
    PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Run Application**
    Start the development server:
    ```bash
    npm run dev
    ```
    Open your browser and access: `http://localhost:3000`

---

## 💡 How to Use

1.  **Upload**: Click the upload area or *drag-and-drop* your product photo (JPG/PNG).
2.  **Wait for Analysis**: A progress bar will appear while the AI analyzes visuals and drafts the text.
3.  **Select Result**:
    * Review the 3 caption options generated.
    * Use the **Copy** 📋 button to copy to clipboard.
    * Use the **Share** 🔗 button to navigate to social media.

---

## 🤝 Contribution

We invite developers, designers, and *prompt engineers* to contribute.

1.  **Fork** this repository.
2.  Create a feature *branch* (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the *branch* (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

> **Note:** Ensure your code passes *linting* and contains no *breaking changes*.

---

## 🙏 Credits & Acknowledgements

This project would not be possible without the incredible support from:

* **IMPHNEN X KOLOSAL Hackathon**: For providing an inspiring competition platform.
* **Google Gemini Team**: For access to the powerful Multimodal API.
* **Kolosal AI**: For the efficient *Large Language Model* technology.
* **Open Source Community**: For the React library and ecosystem.

---

## 📄 License

Distributed under the **MIT License** with additional Intellectual Property clauses.
See the [`LICENSE`](./LICENSE) file for more information.

---

<div align="center">
  <br/>
  <b>Made with ❤️ and ☕ by NCHMPK Team</b>
  <br/>
  <i>(Azarr & AunuHost)</i>
  <br/>
  <br/>
  © 2026 Konten Kilat AI Team. All Rights Reserved.
</div>
