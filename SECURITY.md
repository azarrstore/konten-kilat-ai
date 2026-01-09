# 🛡️ Security Policy & Legal Boundaries

> **PROJECT STATUS: PROPRIETARY / CLOSED SOURCE**
> This document outlines the security protocols, reporting procedures, and legal boundaries regarding the **Konten Kilat AI** software stack.

---

## ⛔ Unauthorized Access & Reverse Engineering

**STRICTLY PROHIBITED ACTIONS:**

As this software is **Proprietary Intellectual Property** owned by **Azarr & AunuHost (NCHMPK Team)**, the following actions are strictly violations of our security policy and terms of use:

1.  **Reverse Engineering:** Any attempt to decompile, disassemble, or reverse engineer the source code, API logic, or protection mechanisms is prohibited.
2.  **License Bypassing:** Attempting to crack, bypass, or modify the API Key verification steps or client-side storage logic.
3.  **Automated Scanning:** The use of automated vulnerability scanners or "fuzzing" tools against our production infrastructure is strictly forbidden without prior written authorization.

**Violation of these terms may result in immediate revocation of access and potential legal action.**

---

## 📝 Reporting a Vulnerability

We value the security of our software and the privacy of our users. If you are an authorized user or collaborator and you have discovered a security vulnerability, we appreciate your help in disclosing it to us responsibly.

**DO NOT OPEN A PUBLIC GITHUB ISSUE** for security vulnerabilities. Publicly disclosing a vulnerability puts the entire ecosystem at risk.

### How to Report

Please report security issues privately via email to the core team:

* **Email:** [kontenkilat@aunuhost.qzz.io]
* **Subject:** `[SECURITY ALERT] Vulnerability in Konten Kilat AI - <Component Name>`

Please include the following details in your report:
* Type of issue (e.g., XSS, API Key Leakage, Injection).
* Step-by-step instructions to reproduce the vulnerability.
* Impact of the issue.

### Our Response Policy

1.  We will acknowledge receipt of your report within **48 hours**.
2.  We will provide an estimated timeframe for a fix.
3.  We will notify you once the fix has been deployed.

---

## 📦 Supported Versions

Only the latest development branch is actively supported with security patches. Older forks or unauthorized copies are not supported.

| Version | Supported | Status |
| :--- | :---: | :--- |
| **HEAD (Latest)** | ✅ | **Active Support & Security Patching** |
| Older Versions | ❌ | End of Life / No Support |
| Unauthorized Forks | ❌ | **Illegal / No Support** |

---

## ⚠️ Integrity & Data Safety

**Konten Kilat AI** interacts with third-party Generative AI APIs (Google Gemini & Kolosal).

* **API Key Safety:** Users are responsible for keeping their own API Keys secure. Our software stores keys locally (`localStorage`) and never transmits them to unauthorized external servers.
* **Data Privacy:** Images uploaded for analysis are processed transiently by the AI endpoints and are not stored permanently on our servers.

---

<div align="center">
  <br/>
  <b>Security is a shared responsibility.</b>
  <br/>
  <i>Thank you for respecting our intellectual property and security boundaries.</i>
  <br/>
  <br/>
  © 2026 Azarr & AunuHost (NCHMPK Team).
</div>
