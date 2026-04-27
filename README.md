# Pramaan (प्रमाण) — Underwriting Copilot

**Evidence-Based Credit Discovery for PSU Banks**  
*PSB Hackathon 2026 — Problem Statement 1*

---

## 🚀 Vision
Pramaan — meaning "proof" or "evidence" — is a consent-first underwriting copilot that enables public sector banks to safely extend credit to thin-file individuals and MSMEs. By leveraging India's **Account Aggregator (AA)** infrastructure and governed AI, Pramaan shifts the focus from traditional bureau scores to real-time cashflow evidence.

## ✨ Key Differentiators
- **Bureau-Agnostic Scoring:** High-fidelity risk assessment for the 160M Indians with zero bureau history.
- **Uncertainty-Aware Decisioning:** calibrated risk probability mapped to a staged exposure model (Starter Loans).
- **Clinical Aesthetics:** A professional "Evidence Dossier" UI designed for institutional banking environments.
- **Privacy-First (DPDP Act):** Stateless scoring at the processing layer; raw data is purged immediately after the session.

---

## 🏗 System Architecture

### 1. Presentation Layer
- **Borrower Portal:** Progressive disclosure flow for AA consent and evidence collection.
- **Officer Dashboard:** High-density analytical desk with SHAP-driven reason codes and risk gauges.

### 2. Scoring & Intelligence (Planned)
- **Cashflow Champion Model:** XGBoost/LightGBM ensemble for transactional analysis.
- **Graph Challenger:** GNN (GraphSAGE) for merchant-relation intelligence.
- **Psychometric Booster:** Gamified assessment for new-to-credit users.

### 3. Data Ingestion
- **AA Gateway:** Full ReBIT v2.0 spec compliance for secure FI data fetch.
- **GST Connector:** MSME-track verification via GSTN API.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Tailwind CSS v4, shadcn/ui, Framer Motion |
| **Typography** | Montserrat (Display), Manrope (Body), JetBrains Mono (Data) |
| **Backend** | FastAPI (Python 3.12+), Pydantic v2 |
| **Data/ML** | XGBoost, LightGBM, PyTorch Geometric, SHAP |
| **Security** | TLS 1.3, AES-256-GCM, OAuth 2.0 + PKCE |

---

## 📁 Project Structure

```text
pramaan/
├── pramaan-frontend/     # React SPA (Vite + Tailwind v4)
├── backend/              # FastAPI Scoring Service (In implementation)
├── .stitch/              # Design system & tokens (Clinical & Evidentiary)
└── Pramaan_highleveldesign.md # Core HLD documentation
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (Recommended)
- Python 3.12+ (for backend)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd pramaan-frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Backend Setup (Initial)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up a virtual environment and install requirements (when available).

---

## 🏛 Compliance & Governance
Pramaan is designed to align with:
- **DPDP Act 2023:** Granular consent management and purpose limitation.
- **RBI Master Directions:** Digital Lending (2022) & Account Aggregator (2016).
- **ReBIT FI Schema:** Standardized financial information exchange.

---

## 👥 Team & Submission
Developed for the **UCO Bank × IIT Kharagpur PSB Hackathon 2026**.  
*Team: Pramaan Contributors*
