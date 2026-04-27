# Pramaan — High-Level Design Document

**Classification:** PSB Hackathon 2026 — Problem Statement 1  
**Team Submission for:** UCO Bank × IIT Kharagpur Hackathon  

---

## 1. Executive Summary

### 1.1 Product Identity

> *We help PSU banks safely issue starter loans to thin-file individuals and MSMEs using consented cashflow data, governed AI, and evidence-based exposure control.*

Pramaan — meaning "proof" and "evidence" in Sanskrit — is a consent-first underwriting copilot that enables public sector banks to extend credit to the 160 million Indian adults who lack traditional credit history. Instead of attempting full underwriting in a single leap, Pramaan uses India's Account Aggregator infrastructure to analyze consented financial data, measure how much evidence is available, and issue safe, staged starter loans — progressively expanding exposure as borrowers build repayment track records.

The system is designed as a production-oriented, bank-pilotable platform with a governed deployment ladder — starting with shadow scoring, progressing through officer-assist mode, and reaching starter-loan pilot only after institutional validation on the bank's own portfolio data.

### 1.2 Design Philosophy

This system is built on three non-negotiable principles:

**Judgment over intelligence.** The system does not replace loan officers. It augments them with structured evidence. Policy always overrides model output. Confidence governs the degree of automation, not the direction of the decision.

**Safety over accuracy.** A missed approval is recoverable. A bad loan is not. The system is calibrated to minimize Type II errors (approving likely defaulters) even at the cost of conservative Type I errors (declining borderline cases). Starter loans cap maximum exposure for uncertain cases.

**Consent over data.** Every data point enters through RBI-regulated Account Aggregator channels with explicit, revocable, purpose-limited, time-bound borrower consent. The system processes data but does not store raw financial information beyond the scoring session. The consent trail is auditable and DPDP Act 2023 compliant.

### 1.3 Key Differentiators

| Capability | What exists today | What Pramaan adds |
|---|---|---|
| Bureau scoring | CIBIL scores 300-900 for credit-active borrowers | Scores borrowers with zero bureau history |
| Statement analysis | Perfios parses and categorizes transactions | Full underwriting decision with amount, tenor, confidence |
| Alternative data | CreditVidya uses device/app signals | Graph-relational intelligence + psychometric assessment |
| Decision support | Disconnected scoring tools | Unified officer copilot with reason codes and improvement actions |
| Risk awareness | Binary approve/decline | Uncertainty-aware four-tier decisioning with staged exposure |

---

## 2. System Architecture

### 2.1 Architecture Overview

Pramaan is a layered, microservices-oriented system with clear separation between data ingestion, scoring, decisioning, and presentation. Every layer communicates through well-defined API contracts. The system is stateless at the scoring layer — no borrower data persists beyond the active session unless explicitly retained for model monitoring under separate consent.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                          │
│   Borrower Portal (React)  │  Officer Dashboard (React)  │  API   │
├─────────────────────────────────────────────────────────────────────┤
│                     GOVERNANCE & POLICY LAYER                      │
│   Policy Engine  │  Human Override Handler  │  Audit Logger        │
├─────────────────────────────────────────────────────────────────────┤
│                     DECISION ENGINE LAYER                          │
│   Uncertainty-Aware Router  │  Starter Loan Calculator  │  Explainer│
├─────────────────────────────────────────────────────────────────────┤
│                     SCORING LAYER                                  │
│   Meta-Learner (Stacker)                                           │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│   │  Cash Flow   │ │    Graph     │ │ Psychometric │              │
│   │  Champion    │ │  Challenger  │ │   Booster    │              │
│   └──────────────┘ └──────────────┘ └──────────────┘              │
│   Integrity / Anomaly Detector (parallel, separate from scoring)   │
├─────────────────────────────────────────────────────────────────────┤
│                  FEATURE ENGINEERING LAYER                          │
│   Transaction Categorizer  │  Rolling-Window Engine  │  Graph Builder│
│   Evidence Sufficiency Scorer  │  Segment Classifier               │
├─────────────────────────────────────────────────────────────────────┤
│                  DATA INGESTION LAYER                               │
│   AA Gateway (ReBIT API)  │  GST Connector  │  Psychometric Module │
│   Consent Manager  │  Statement Parser  │  Schema Validator        │
├─────────────────────────────────────────────────────────────────────┤
│                  SECURITY & INFRASTRUCTURE                         │
│   TLS 1.3  │  AES-256 at rest  │  JWT Auth  │  Rate Limiting      │
│   RBAC  │  Audit Trail  │  Key Vault  │  WAF                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Specifications

#### 2.2.1 Data Ingestion Layer

**AA Gateway**  
Interfaces with Account Aggregator APIs per ReBIT v2.0.0 specification. Handles consent artifact creation, FI data fetch, and decryption. Supports both XML and JSON FI schemas. Implements the full AA consent lifecycle: consent request → customer approval → data fetch → consent revocation handling.

- Protocol: HTTPS with mutual TLS (mTLS)
- Data format: ReBIT FI Schema (XML/JSON) for 23 FI types
- Encryption: Data encrypted in transit (TLS 1.3), decrypted only in secure enclave for processing
- Session scope: Data retained only for active scoring session; purged after score generation unless monitoring consent is granted separately

**GST Connector**  
Fetches GST filing data for MSME borrowers via GSTN API integration. Extracts: filing regularity, turnover trend, tax liability pattern, supplier/buyer summary.

**Statement Parser**  
For borrowers providing PDF bank statements instead of AA data. Uses OCR (Tesseract + custom post-processing) for scanned statements. Includes tamper detection: metadata hash verification, font consistency check, balance tally validation.

**Consent Manager**  
Manages the complete consent lifecycle per DPDP Act 2023 and RBI AA Master Direction. Tracks: what data was requested, when consent was granted, purpose code, expiry time, and revocation status. Every consent action is logged immutably.

#### 2.2.2 Feature Engineering Layer

**Transaction Categorizer**  
Classifies each transaction using a two-stage approach:
1. Rule-based MCC (Merchant Category Code) mapping for UPI/card transactions
2. NLP classification on transaction narration text for NEFT/RTGS/cheque entries (lightweight TF-IDF + logistic regression, trained on labeled Indian bank statement narrations)

Categories: salary/wages, business income, rent received, investment returns, loan EMI, rent paid, utilities, groceries, discretionary, transfers, cash withdrawal, unknown.

**Rolling-Window Feature Engine**  
Computes time-series features at 7, 30, 90-day windows:
- Income: mean, std, trend slope, source count, regularity score
- Expense: fixed obligation ratio, discretionary ratio, utility consistency
- Surplus: mean, coefficient of variation, minimum balance trend, emergency buffer ratio
- Behavioral: transaction frequency, UPI adoption rate, merchant diversity index

**Graph Builder**  
Constructs heterogeneous transaction graph:
- Node types: Borrower (target), Merchant (enrichment), Account (structural)
- Edge types: Transaction edges weighted by frequency × recency × amount
- Edge features: transaction count, mean amount, recency decay, category diversity
- Output: NetworkX graph → PyTorch Geometric HeteroData object

**Evidence Sufficiency Scorer**  
Computes a 0-100 score representing how much the system knows about this borrower. Weights are segment-conditional — the formula adapts to borrower type so that irrelevant signals (e.g., GST for a salaried individual) do not penalize the applicant.

For salaried / gig borrowers:

| Signal | Weight | Computation |
|--------|--------|-------------|
| Transaction history length | 0.35 | min(months_of_data / 12, 1.0) |
| Observed inflow cycles | 0.30 | min(recurring_credit_cycles / 6, 1.0) |
| Statement activity depth | 0.20 | min(total_transactions / (months × 8), 1.0) — rewards transaction volume, not calendar coverage, so low-frequency but healthy accounts are not penalized |
| Data freshness | 0.15 | max(0, 1 - days_since_last_txn / 90) |

For MSME borrowers:

| Signal | Weight | Computation |
|--------|--------|-------------|
| Transaction history length | 0.25 | min(months_of_data / 12, 1.0) |
| Observed inflow cycles | 0.20 | min(business_credit_cycles / 6, 1.0) |
| Statement activity depth | 0.15 | min(total_transactions / (months × 8), 1.0) |
| GST data availability + quality | 0.25 | 0.0 if absent, 0.5 if present but irregular, 1.0 if present and regularly filed |
| Data freshness | 0.15 | max(0, 1 - days_since_last_txn / 90) |

Design rationale: GST carries weight only in the MSME segment where it is genuinely informative. A salaried borrower is never penalized for not having GST data. Statement activity depth measures transaction richness (how many transactions relative to time) rather than calendar day coverage, so a borrower who transacts twice a week but skips weekends is not marked as incomplete.

Routing: ≥70 → sufficient (champion model) | 40-69 → partial (trigger psychometric) | <40 → insufficient (request documents or decline)

**Segment Classifier**  
Rule-based routing (not learned):
- Salaried: ≥3 recurring credits from same source, ±15% amount variance (accommodates Indian payroll realities: tax deductions, variable DA, reimbursements, mid-year revisions), monthly cadence with ±5 day tolerance
- MSME: GST data present OR business settlement patterns OR invoice-style credits from multiple counterparties
- Gig/Informal: multiple irregular digital credits from ≥3 sources, no dominant source >40%

Mismatch handling: if declared segment ≠ detected segment → flag, reduce confidence one tier, route to manual review.

#### 2.2.3 Scoring Layer

**Cash Flow Champion Model**  
Algorithm: Ensemble of XGBoost and LightGBM (equal-weight average of probabilities).  
Features: 45-60 engineered features from transaction categorizer + rolling-window engine.  
Target: Binary (1 = 30+ DPD within first 3 EMI cycles, 0 = successful repayment).  
Training: Home Credit Default Risk dataset (307,511 loans) with features mapped to cash flow domain.  
Validation: Time-based split (train months 1-18, validate 19-24) with customer-level isolation.  
Output: default_probability (0-1), confidence_interval (from bootstrap variance across ensemble members).

**Graph Challenger Model**  
Algorithm: 2-layer GraphSAGE with mean aggregation (PyTorch Geometric).  
Input: HeteroData graph with borrower, merchant, account nodes.  
Training: Node-level classification — borrower nodes labeled with default outcome.  
Key insight: Even thin-file borrowers with no personal credit history carry relational signal through their merchant transaction partners. A borrower transacting with stable, long-standing merchants in a healthy commercial ecosystem carries lower risk than one whose transactions cluster around recently created or high-risk merchants.  
Output: graph_score (0-1), community_risk_flag (boolean).

Conditional inclusion: Graph module is included in the final system ONLY if ablation shows statistically significant AUC lift (≥0.005) on the thin-file subgroup (borrowers with <6 months history). If lift is not demonstrated, module is deferred to Phase 2 and the stacker runs without it.

**Psychometric Booster Model**  
Algorithm: Logistic regression on psychometric content features + metadata features.  
Trigger condition: evidence_sufficiency < 70 AND borrower is new-to-credit (no detected salary history).  
Assessment: 15-question gamified quiz (5-8 minutes) measuring conscientiousness, financial literacy, risk calibration, and integrity.  
Metadata features (higher signal than content): response latency per question vs personal mean, answer-change frequency, response consistency across related questions, total completion time, device interaction patterns.  
Output: psychometric_score (0-1), honesty_flag (boolean — triggered when consistency score is anomalously low).

Framing: This is NOT a personality judgment or moral score. It is a structured, metadata-driven thin-file supplement that reduces uncertainty when transactional evidence is insufficient. It is positioned as secondary evidence, never as a primary approval driver.

**Integrity / Anomaly Detector (Parallel Layer)**  
This layer operates independently from the scoring layer. It does NOT lower the credit score. It affects confidence or triggers manual referral.

| Detection Rule | Signal | Action | Calibration Note |
|---|---|---|---|
| Balance inflation | Current balance > 3σ above 90-day rolling mean, within 30 days of application | Reduce confidence, flag for review | High-confidence signal across all segments |
| Self-transfers | Matching amounts across linked accounts within ±24hr window | Flag for review | High-confidence signal; requires multi-account visibility |
| Synthetic regularity | Transaction timing CV < 0.05 (unnaturally regular) | Flag for review | Moderate confidence; some auto-pay patterns may trigger — requires bank-specific threshold tuning |
| Coached psychometric responses | Metadata variance below population 5th percentile + suspiciously fast completion | Flag for review | Moderate confidence; metadata threshold requires calibration on real applicant population |

The following rules are included as **informational signals only** (not flagging triggers) because they have high false-positive rates in Indian cash-heavy and MSME contexts. They become flagging triggers only after bank-specific calibration on historical data:

| Informational Signal | Observation | Why it is not a default trigger |
|---|---|---|
| Transactions on bank holidays | Digital transactions (UPI, NEFT) process on holidays in India | Normal behavior for digital-first borrowers; only relevant for physical-branch transactions |
| Round-figure deposits | Large round-figure credits | Common in Indian business (cash sales, supplier payments, rent); flagging without context would over-flag MSME and informal-sector borrowers |
| Post-salary ATM withdrawal | >60% of salary withdrawn via ATM within 48hr | Normal for cash-heavy households, especially in semi-urban and rural India; informational only |

Output: integrity_status (clean / review / flag), anomaly_details (list of triggered rules with confidence levels).

Design rationale: A genuinely creditworthy borrower with one suspicious transaction should not have their credit score penalized. They should be routed to human judgment. Separating integrity from creditworthiness is fairer to the borrower and more defensible to regulators. Anomaly thresholds require bank-specific calibration during the shadow-scoring phase before they are used in live decisioning.

#### 2.2.4 Meta-Learner (Stacking Ensemble)

Algorithm: LightGBM on module outputs.

Input feature vector per applicant:

| Feature | Type | Source |
|---|---|---|
| cashflow_score | float [0-1] | Champion model |
| cashflow_confidence | float [0-1] | Bootstrap variance |
| graph_score | float [0-1] | Challenger (0 if not available) |
| graph_community_risk | binary | Graph module |
| psychometric_score | float [0-1] | Booster (0 if not triggered) |
| psychometric_honesty | binary | Consistency check |
| segment_id | categorical | Segment classifier |
| evidence_sufficiency | float [0-100] | Evidence scorer |
| signal_availability_mask | binary vector [5] | Which sources were available |
| integrity_status | categorical | Anomaly detector |

The signal_availability_mask is critical: it tells the stacker which modules had real data vs. zeros-by-absence. A missing graph score because there was no graph data is fundamentally different from a graph score of 0.0 indicating high risk. The mask enables the model to learn segment-specific and data-availability-specific weighting.

Calibration: Platt scaling (logistic calibration) applied on held-out validation set. Calibration quality measured via Brier score and reliability diagram. A model that outputs 20% default probability should see approximately 20% actual defaults in that bucket.

Output: calibrated_risk_probability (0-1), calibrated_confidence (0-1).

#### 2.2.5 Decision Engine Layer

**Uncertainty-Aware Decision Matrix**

| Confidence | Risk (prob) | Decision | Automation |
|---|---|---|---|
| ≥0.8 | <0.10 | APPROVE | Auto, officer notified |
| ≥0.8 | 0.10-0.30 | STARTER LOAN | Auto, reduced exposure |
| ≥0.8 | >0.30 | DECLINE | Auto, reason codes provided |
| 0.5-0.8 | <0.20 | STARTER LOAN | Auto, officer review within 24hr |
| 0.5-0.8 | ≥0.20 | REFER | Manual officer decision required |
| <0.5 | Any | REFER | Manual officer decision required |
| Any | Any + integrity flag | REFER | Manual review regardless |

**Starter Loan Calculator**

```
starter_amount = min(
    3 × estimated_monthly_surplus,
    segment_policy_cap,
    confidence × base_limit
)

Segment policy caps:
    Salaried thin-file individual: ₹50,000
    MSME working capital: ₹2,00,000
    Gig / informal worker: ₹25,000

Tenor: min(12 months, confidence × 18 months), rounded to nearest 3-month interval
Rate band: base_rate + (1 - confidence) × risk_premium_spread
```

**Explanation Generator**

Three-part explanation for every decision:

1. **Why this recommendation** — Top 3 SHAP-driven reason codes in plain language. Example: "Strong monthly surplus (+), consistent bill payments (+), limited transaction history (-)."

2. **What would strengthen eligibility** — Counterfactual actions generated via DiCE library. Example: "3 more months of consistent bank activity would upgrade this case from Refer to Starter Loan."

3. **What data was unavailable or weak** — Signal gap report from the availability mask. Example: "No GST data available. MSME assessment is based on bank statements only, which reduces confidence."

#### 2.2.6 Governance & Policy Layer

**Policy Engine**  
The policy engine has absolute authority. It overrides model output when:
- Sector or segment exposure caps are breached
- Total bank exposure to borrower exceeds internal limits
- Borrower age is below minimum (18) or business vintage below policy threshold
- Mandatory documentation is incomplete per RBI digital lending guidelines
- Regulatory constraints apply (RBI norms on unsecured lending limits, priority sector targets)

The AI is a recommendation under governance. Never an autonomous decision-maker.

**Human Override Handler**  
Every officer override is logged with:
- Override direction: approve → decline, decline → approve, modify amount/tenor
- Reason category: additional information | relationship context | policy exception | model disagreement
- Optional free-text note
- Timestamp and officer ID

Override performance is tracked: repayment outcomes of overridden decisions vs. model-recommended decisions. This feedback loop enables:
- Identifying officers who consistently improve on model recommendations
- Detecting override patterns that degrade portfolio quality
- Calibrating model thresholds based on real-world officer judgment

**Audit Logger**  
Immutable append-only log (write-once storage) recording:
- Every consent grant, modification, and revocation
- Every data fetch with timestamp and data hash
- Every scoring decision with full input feature vector
- Every explanation generated
- Every policy override applied
- Every human override with reason

Retention: 7 years per RBI record-keeping requirements for lending decisions.

#### 2.2.7 Presentation Layer

**Borrower Portal (React SPA)**  
Progressive disclosure flow:
1. Consent screen: what data, why, what benefit, what if declined
2. AA linking: connect bank accounts through AA app redirect
3. Pre-check result (30 seconds): evidence sufficiency badge + preliminary eligibility
4. If partial evidence: psychometric quiz (5-8 minutes) or GST upload prompt
5. Decision screen: Pramaan score, recommended loan terms, top contributing factors
6. Improvement path: "How to strengthen your profile" with actionable steps
7. Consent management: view, modify, or revoke data sharing permissions

**Officer Dashboard (React SPA)**  
Five-card layout:

| Card | Content | Color coding |
|---|---|---|
| Decision | APPROVE / STARTER / REFER / DECLINE | Green / Amber / Blue / Red |
| Loan terms | Amount (₹), tenor (months), indicative rate | — |
| Top 3 reasons | SHAP reason codes in plain language | — |
| Confidence | Evidence sufficiency badge (78/100), data sources available | Green / Amber / Red |
| Improvement | "What would strengthen this case" — actionable next steps | — |

Additional elements: integrity flag alert (if triggered), override button with mandatory reason capture, borrower timeline view (transaction history visualization).

---

## 3. Security Architecture

This section describes the security architecture blueprint for Pramaan. These are design specifications and control targets — not attestations of implemented controls. Production deployment requires implementation validation, penetration testing, and security audit by the bank's CISO/information security team. The architecture is designed to meet banking-grade security requirements when fully implemented.

### 3.1 Security Principles

1. **Defense in depth**: Multiple independent security layers; no single point of failure
2. **Least privilege**: Every component accesses only the data it needs
3. **Zero trust**: Every request is authenticated and authorized regardless of network location
4. **Encryption everywhere**: Data encrypted at rest and in transit; decrypted only in secure processing context
5. **Auditability**: Every data access, processing step, and decision is logged immutably

### 3.2 Data Security

**In Transit**
- TLS 1.3 for all external communications
- Mutual TLS (mTLS) for AA Gateway connections per ReBIT specification
- Certificate pinning on mobile/web clients to prevent MITM attacks

**At Rest**
- AES-256-GCM encryption for any persisted data
- Encryption keys managed via dedicated Key Vault (HashiCorp Vault or AWS KMS)
- Key rotation: automated 90-day rotation with zero-downtime key transition
- Database-level encryption with separate keys per tenant (if multi-bank deployment)

**In Processing**
- Financial data decrypted only within the scoring service memory space
- No raw financial data written to logs — only hashed identifiers and aggregated features
- Feature vectors (not raw transactions) are what the ML models consume
- Raw data purged from memory after feature extraction; only scores and explanations persist

### 3.3 Authentication & Authorization

**API Authentication**
- OAuth 2.0 with PKCE for browser-based clients
- JWT tokens with short expiry (15 minutes) and refresh token rotation
- API keys with IP allowlisting for bank CBS integration
- Service-to-service: mTLS with certificate-based identity

**Role-Based Access Control (RBAC)**

| Role | Permissions |
|---|---|
| Borrower | View own score, manage consent, view improvement path |
| Loan Officer | View scores, override decisions (with reason), view dashboard |
| Branch Manager | All officer permissions + approve policy exceptions |
| Risk Admin | Model performance monitoring, fairness dashboards, threshold configuration |
| System Admin | Infrastructure management, no access to borrower data |
| Auditor | Read-only access to audit logs and compliance reports |

**Session Management**
- Session timeout: 15 minutes idle, 4 hours absolute
- Concurrent session limit: 1 per user (new login terminates old session)
- Session binding: tied to device fingerprint + IP range

### 3.4 Application Security

**Input Validation**
- Strict schema validation on all API inputs against OpenAPI specification
- File upload validation: PDF/XML only, max 10MB, virus scan before processing
- SQL injection prevention: parameterized queries only, no dynamic SQL
- XSS prevention: output encoding on all rendered content, Content-Security-Policy headers

**Rate Limiting & Abuse Prevention**
- API rate limits: 100 requests/minute per authenticated user, 10 requests/minute for scoring endpoint
- Progressive backoff on failed authentication attempts (lockout after 5 failures)
- Bot detection on psychometric quiz (CAPTCHAs not required for AA-authenticated flows)
- DDoS protection: WAF with geo-filtering and behavioral analysis

**Dependency Security**
- Automated dependency scanning (Snyk/Dependabot) in CI/CD pipeline
- No direct internet access from scoring services (air-gapped from public internet)
- Container image scanning before deployment
- SBOM (Software Bill of Materials) maintained for all components

### 3.5 Infrastructure Security

**Network Architecture**
```
Internet → WAF → Load Balancer → API Gateway
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
              ┌─────────┐     ┌─────────┐      ┌─────────┐
              │ Frontend │     │ Scoring │      │ AA/GST  │
              │ Services │     │ Services│      │ Connectors│
              │ (DMZ)   │     │(Private)│      │(Private) │
              └─────────┘     └────┬────┘      └─────────┘
                                   │
                              ┌────┴────┐
                              │  Data   │
                              │  Layer  │
                              │(Isolated)│
                              └─────────┘
```

- Three-tier network segmentation: DMZ (frontend), Private (scoring), Isolated (data)
- No direct internet access from scoring or data tiers
- Scoring services communicate with AA Gateway through dedicated internal connector only
- Database accessible only from scoring services via private subnet

**Container Security**
- Minimal base images (distroless or Alpine-based)
- Non-root container execution
- Read-only filesystem for scoring containers
- Resource limits (CPU, memory) to prevent resource exhaustion attacks
- No shell access in production containers

### 3.6 Data Privacy Architecture

**DPDP Act 2023 Alignment**

The following table describes Pramaan's design alignment with the Digital Personal Data Protection Act 2023 and the DPDP Rules 2025. Specific implementation timelines and thresholds are Pramaan's design choices, not statutory mandates. Final legal validation is required before deployment.

| DPDP Principle | Pramaan Design Choice |
|---|---|
| Purpose limitation | Data used exclusively for credit assessment; purpose code embedded in AA consent artifact |
| Data minimization | Only bank statement transactions and GST summary fetched; no social media, contacts, call logs, or device data (aligned with RBI's Aug 2022 digital lending framework restricting DLA access to phone resources) |
| Consent specificity | Granular consent per data source with clear purpose statement, time-bound validity, and revocation mechanism |
| Right to erasure | Borrower can revoke consent; raw data purge initiated promptly upon revocation (target: within 48 hours — operational SLA, not statutory mandate) |
| Data retention | Raw data: session-only. Features: 30 days for quality monitoring under separate consent. Decisions: retained per RBI record-keeping norms for lending decisions |
| Breach notification | Automated breach detection pipeline; notification to Data Protection Board and affected data principals upon becoming aware of a breach, in the manner prescribed under DPDP Rules 2025 |
| Cross-border data | System designed for India-based processing as a policy choice; DPDP Rules 2025 permit cross-border transfer unless the government restricts specific destinations — Pramaan's India-first architecture is a trust signal, not a legal obligation |
| Data Protection Officer | DPO to be designated per DPDP Act requirements prior to production deployment |

**Privacy by Design**
- Feature extraction happens in a secure enclave; raw financial data never leaves the enclave
- ML models train on aggregated features, not raw transactions
- Synthetic data used for model development; real data used only for validation with explicit consent
- No cross-borrower data linkage except through anonymized graph features
- Borrower identity is decoupled from scoring features via pseudonymization

### 3.7 Threat Model

| Threat | Vector | Mitigation |
|---|---|---|
| Unauthorized data access | API exploitation, stolen credentials | mTLS, OAuth 2.0 + PKCE, RBAC, audit logging |
| Data in transit interception | Network sniffing, MITM | TLS 1.3, certificate pinning, mTLS for AA |
| Insider threat | Privileged user accessing borrower data | Least privilege RBAC, audit trail, separation of duties |
| Model extraction | Repeated scoring queries to reverse-engineer model | Rate limiting, query fingerprinting, model output rounding |
| Adversarial inputs | Manipulated bank statements, gamed psychometrics | Tamper detection, anomaly detector, metadata consistency checks |
| Supply chain attack | Compromised dependencies | SBOM, automated scanning, air-gapped scoring services |
| Consent manipulation | Fake or expired consent artifacts | AA consent verification via Central Registry, real-time consent status check |
| Data residuality | Raw data persisting after session | Automatic purge on session close, verified by audit log |

---

## 4. Compliance & Regulatory Framework

### 4.1 Regulatory Compliance Matrix

| Regulation | Scope | Pramaan Compliance |
|---|---|---|
| RBI Master Direction on Digital Lending (2022) | Digital lending practices | Consent-first data access, no invasive device data, transparent pricing, key fact statement |
| RBI AA Master Direction (2016, updated 2024) | Account Aggregator operations | Full ReBIT API compliance, consent lifecycle management |
| DPDP Act 2023 + Rules 2025 | Personal data protection | Purpose limitation, consent management, right to erasure, breach notification (see Section 3.6) |
| RBI Fair Practices Code | Lending fairness | Explainable decisions, non-discriminatory scoring, reason codes on decline |
| RBI Guidelines on Outsourcing (2006) | Outsourcing of financial services activities | Applicable if Pramaan is operated by a third-party technology provider on behalf of a bank; requires audit rights, SLA enforcement, and board-approved outsourcing policy. Not applicable if operated in-house by the bank. |
| IT Act 2000 + CERT-In Directions (2022) | Cybersecurity incident reporting | Incident reporting to CERT-In within 6 hours of becoming aware, as per April 2022 directions; security audit per reasonable security practices rules |
| SEBI Guidelines on AI/ML (emerging) | Algorithmic governance | Model documentation, bias monitoring, human oversight — monitored for applicability as guidelines evolve |

Note: This compliance matrix represents Pramaan's design alignment with the regulatory landscape as of April 2026. Final legal validation by the bank's compliance and legal teams is required before any production deployment.

### 4.2 Model Governance

**Model Risk Management Framework**  
Aligned with RBI guidelines on model risk and SR 11-7 (US Fed) best practices:

1. **Model Documentation**: Full technical specification including training data description, feature engineering logic, algorithm selection rationale, hyperparameter choices, and validation results.

2. **Independent Validation**: Model validated on out-of-time holdout set. Segment-wise performance reported separately for salaried, MSME, and gig borrowers. Thin-file subgroup (borrowers with <6 months history) evaluated independently.

3. **Ongoing Monitoring**: Monthly model performance reports tracking AUC, Brier score, approval rate, default rate, and fairness metrics by segment and geography. Automated alerts on performance degradation (AUC drop >0.02 or calibration drift >5%).

4. **Model Lifecycle**: Annual full model review. Retraining triggered by performance degradation alerts or significant portfolio composition change. All model versions archived with full reproducibility information.

### 4.3 Fairness & Non-Discrimination

**Protected attributes monitored**: Gender, geography (urban/semi-urban/rural), age group, segment (salaried/MSME/gig).

**Fairness metrics computed**:
- Demographic parity: approval rate difference across protected groups
- Equalized odds: true positive and false positive rate parity
- Disparate impact ratio: minimum 0.8 (80% rule)

**Mitigation**: If fairness metrics breach thresholds, the system triggers:
1. Automated alert to Risk Admin
2. Root cause analysis on feature contributions (which features drive the disparity)
3. Fairness constraint injection during next model retraining (using Fairlearn library)

**Important design choice**: The system does NOT use protected attributes as model features. Fairness is monitored post-hoc on model outputs, not enforced by including sensitive attributes in the model.

---

## 5. Scalability & Performance

### 5.1 Performance Requirements

| Operation | Target Latency | Throughput |
|---|---|---|
| AA data fetch + decrypt | <5 seconds | 100 concurrent sessions |
| Feature engineering | <3 seconds | — |
| Model scoring (all modules) | <2 seconds | 500 requests/minute |
| Decision + explanation generation | <1 second | — |
| Total end-to-end (borrower perspective) | <30 seconds | — |
| Officer dashboard load | <2 seconds | — |
| Psychometric quiz submission + scoring | <3 seconds | — |

### 5.2 Scalability Architecture

**Horizontal scaling**: Scoring services are stateless and containerized. Scaling is achieved by adding container replicas behind a load balancer. No shared state between scoring instances.

**Caching**: Redis caching layer for:
- Feature store lookups (Feast online serving)
- Repeated scoring requests for same borrower within session
- Static reference data (MCC mappings, policy parameters)

**Async processing**: Graph construction and psychometric scoring can run asynchronously when triggered, with results pushed via WebSocket to the borrower portal.

**Database**: PostgreSQL for decision logs and audit trail. Read replicas for dashboard queries. Write-ahead logging for durability.

### 5.3 Availability & Disaster Recovery

- Target availability: 99.9% (8.76 hours downtime/year)
- Active-passive failover with <5 minute RTO
- Database: synchronous replication to standby
- RPO (Recovery Point Objective): zero data loss for audit logs
- Graceful degradation: if AA Gateway is unavailable, system accepts PDF uploads as fallback

---

## 6. Monitoring & Observability

### 6.1 Operational Monitoring

- **Application metrics**: Request latency (p50, p95, p99), error rate, throughput — exposed via Prometheus
- **Infrastructure metrics**: CPU, memory, disk, network — standard container monitoring
- **Alerting**: PagerDuty/Slack integration for latency >5s (p95), error rate >1%, or service health check failure

### 6.2 ML Model Monitoring (Evidently AI)

- **Data drift**: KL divergence on input feature distributions, monitored weekly
- **Prediction drift**: PSI (Population Stability Index) on score distributions, monitored weekly
- **Performance drift**: AUC and Brier score on outcomes as they mature (30/60/90 DPD)
- **Fairness drift**: Demographic parity and equalized odds tracked monthly by protected group
- **Calibration drift**: Reliability diagram and ECE (Expected Calibration Error) tracked monthly

### 6.3 Business Monitoring

| Metric | Frequency | Owner |
|---|---|---|
| Approval rate by segment | Daily | Risk Admin |
| Starter loan utilization rate | Weekly | Business |
| First-payment default rate | Monthly (as data matures) | Risk Admin |
| Officer override rate and direction | Weekly | Risk Admin |
| Evidence sufficiency distribution | Weekly | Product |
| Psychometric trigger rate | Weekly | Product |
| Consent completion rate | Daily | Product |
| Borrower drop-off by stage | Daily | Product |

---

## 7. API Specification

### 7.1 Core Endpoints

**POST /api/v1/score**  
Initiates a scoring session for a borrower.

Request:
```json
{
  "borrower_id": "string (pseudonymized)",
  "consent_artifact_id": "string (AA consent reference)",
  "declared_segment": "salaried | msme | gig",
  "fi_data": { "/* ReBIT FI schema */" },
  "gst_data": { "/* optional GSTN data */" },
  "psychometric_responses": { "/* optional, if quiz completed */" }
}
```

Response:
```json
{
  "session_id": "uuid",
  "decision": "APPROVE | STARTER_LOAN | REFER | DECLINE",
  "pramaan_score": 720,
  "risk_probability": 0.08,
  "confidence": 0.82,
  "evidence_sufficiency": 78,
  "recommended_amount": 45000,
  "recommended_tenor_months": 12,
  "rate_band": "base + 2.5%",
  "segment_detected": "salaried",
  "segment_mismatch": false,
  "integrity_status": "clean",
  "explanations": {
    "reason_codes": [
      {"factor": "Monthly surplus consistency", "direction": "positive", "rank": 1},
      {"factor": "UPI transaction diversity", "direction": "positive", "rank": 2},
      {"factor": "Limited credit history length", "direction": "negative", "rank": 3}
    ],
    "improvement_actions": [
      "3 additional months of consistent bank activity would increase confidence to HIGH",
      "GST registration would enable MSME-track underwriting with higher limits"
    ],
    "data_gaps": [
      "No bureau data available (thin-file borrower)",
      "GST data not provided"
    ]
  },
  "policy_overrides_applied": [],
  "requires_officer_review": false,
  "psychometric_triggered": false,
  "scoring_modules_used": ["cashflow_champion", "graph_challenger"],
  "signal_availability": {
    "bank_statements": true,
    "gst": false,
    "psychometric": false,
    "telecom": false,
    "ecommerce": false
  }
}
```

**POST /api/v1/override**  
Records an officer override decision.

**GET /api/v1/explain/{session_id}**  
Returns detailed SHAP explanation for a specific scoring session.

**POST /api/v1/consent/revoke**  
Processes consent revocation. Triggers data purge pipeline.

**GET /api/v1/monitor/model-health**  
Returns current model performance metrics (Risk Admin only).

### 7.2 API Security

- All endpoints require OAuth 2.0 bearer token
- Borrower endpoints scoped to own data only (tenant isolation)
- Officer endpoints scoped to assigned branch/region
- Admin endpoints require additional MFA step
- All responses include `X-Request-ID` header for audit trail correlation
- PII fields never appear in error messages or logs

---

## 8. Data Strategy

### 8.1 Scope and Limitations

This data strategy is designed for hackathon demonstration and pilot readiness. It is NOT a claim of production-validated model performance. Production deployment on a PSU bank's portfolio would additionally require: outcome validation on the bank's own historical repayment data, reject-inference strategy (modeling borrowers who were declined and never observed), cut-off backtesting against the bank's existing approval policy, and stability testing on Indian cashflow and GST distributions across economic cycles. These steps are part of the deployment ladder (Phase 1: Shadow Scoring) and are explicitly designed to occur before any live lending.

### 8.2 Training Data

| Dataset | Source | Records | Purpose |
|---|---|---|---|
| Home Credit Default Risk | Kaggle | 307,511 loans | Primary model training and validation |
| Give Me Some Credit | Kaggle | 150,000 | Secondary validation and calibration testing |
| LendingClub Loans | Kaggle | 2.2M loans | Cash flow feature engineering validation |
| BankSim | Kaggle | Synthetic | Graph construction and testing |

### 8.3 India-Specific Calibration Data

| Source | Data Available | Use |
|---|---|---|
| NPCI UPI MCC Statistics | Merchant category transaction volumes | Calibrate synthetic transaction distributions |
| RBI Payment System Data | UPI/IMPS/NEFT aggregate volumes | Macro-level calibration |
| GSTN Public Statistics | Filing compliance rates by state/sector | MSME segment calibration |
| RBI Financial Inclusion Index | State-wise FI scores | Geographic fairness baseline |

### 8.4 Semi-Synthetic Indian Data

Purpose: Demonstrate AA schema compatibility and realistic Indian transaction patterns. NOT used for model performance claims.

Method:
1. Extract distributional priors from Home Credit (income levels, default rates, age distributions)
2. Map to Indian context using NPCI MCC distributions and RBI macro statistics
3. Generate borrower profiles using Python Faker (Indian locale) with custom transaction generators
4. Output in ReBIT AA FI Schema format (XML/JSON) using Setu FIP mock data as structural template
5. Label using calibrated risk function with ~8% default rate matching real-world Indian lending portfolios

Framing: "Model metrics are anchored on real Kaggle datasets with real default outcomes. Synthetic Indian data proves AA infrastructure compatibility."

---

## 9. Deployment Strategy

### 9.1 Deployment Ladder

| Phase | Duration | Mode | Risk Control | Success Criteria |
|---|---|---|---|---|
| 1. Shadow Scoring | 4-6 weeks | Model scores alongside existing process; no lending impact | Compare model decisions vs actual decisions | Agreement rate >70%, model identifies >80% of eventual defaults |
| 2. Officer Assist | 4-8 weeks | Model recommendation shown to officer; officer decides | Track override rates and outcome quality | Override-to-model agreement improves over time |
| 3. Starter Loan Pilot | 8-12 weeks | Auto-approve high-confidence low-risk only; small amounts | Monitor first-payment default rate | FPD rate <3%, approval volume meets target |
| 4. Monitored Expansion | Ongoing | Extend to medium-confidence cases; increase limits | Weekly portfolio quality review | Portfolio NPA within bank's risk appetite |
| 5. Recalibration | Quarterly | Retrain on real repayment outcomes; adjust thresholds | Full model governance review | Sustained or improved performance metrics |

### 9.2 Rollback Plan

- Every deployment is blue-green with instant rollback capability
- Model versioning: all model versions archived with full training data lineage
- Feature flag system: individual modules (graph, psychometric) can be disabled without redeployment
- Circuit breaker: if scoring service error rate exceeds 5%, automatically falls back to manual-only mode
- Database migrations: backward-compatible only; destructive migrations require manual approval

---

## 10. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| ML Core | XGBoost, LightGBM, scikit-learn | Best-in-class for tabular data; well-understood in banking |
| Graph ML | PyTorch Geometric (GraphSAGE) | Production-ready GNN library with inductive learning |
| Calibration | scikit-learn CalibratedClassifierCV | Platt scaling for probability calibration |
| Explainability | SHAP, DiCE, Fairlearn | Industry-standard XAI tools |
| Feature Store | Feast | Open-source, point-in-time correct feature serving |
| Backend API | FastAPI (Python) | Async, high-performance, auto-generated OpenAPI docs |
| Caching | Redis | Sub-millisecond feature serving and session management |
| Database | PostgreSQL | ACID compliance for audit trail; battle-tested in banking |
| Frontend | React, Recharts, Tailwind CSS | Component-based UI with responsive data visualization |
| ML Monitoring | Evidently AI | Open-source drift and fairness monitoring |
| Experiment Tracking | MLflow | Model versioning, parameter tracking, reproducibility |
| Containerization | Docker, Docker Compose | Consistent deployment across environments |
| CI/CD | GitHub Actions | Automated testing, security scanning, deployment |

---

## 11. Testing Strategy

### 11.1 Testing Pyramid

| Level | Scope | Tools | Coverage Target |
|---|---|---|---|
| Unit tests | Individual functions, feature engineering logic | pytest | ≥80% |
| Integration tests | API endpoints, database interactions, AA connector | pytest + httpx | All critical paths |
| Model tests | Prediction correctness, calibration, fairness | Custom + Fairlearn | All segments |
| Security tests | OWASP Top 10, authentication bypass, injection | SAST + DAST | All endpoints |
| End-to-end tests | Full borrower journey, officer workflow | Playwright | Happy path + edge cases |
| Load tests | Throughput and latency under load | Locust | Target SLAs verified |

### 11.2 Model-Specific Tests

- **Invariance tests**: Score should not change significantly if borrower name changes (feature leakage check)
- **Directional tests**: Higher income with same expenses should never increase default probability
- **Boundary tests**: Edge cases — exactly 0 months history, exactly at segment routing boundary
- **Fairness tests**: Approval rate disparity <20% across gender and urban/rural splits
- **Calibration tests**: Hosmer-Lemeshow test p-value > 0.05 across all deciles

---

## 12. Presentation Strategy

### 12.1 Demo Flow (7 minutes)

| Time | Content | Purpose |
|---|---|---|
| 0:00-0:30 | Problem statement + one statistic (160M excluded adults) | Set urgency |
| 0:30-1:00 | Product identity sentence + deployment ladder overview | Set trust |
| 1:00-4:00 | Live borrower journey: consent → evidence sufficiency badge → scoring → decision → explanation | Show the system works |
| 4:00-5:30 | Officer dashboard: 5-card view → override flow → audit trail | Show banking judgment |
| 5:30-6:30 | Ablation table + one headline business number | Prove the system is better |
| 6:30-7:00 | Closing line: "Pramaan builds the bureau of tomorrow" | Be memorable |

### 12.2 Judge Challenge Preparation

**"Why is this safer than existing lending?"**
> We don't replace underwriting with a black box. We combine governed cashflow analysis, uncertainty-aware AI, and staged starter-loan exposure. The bank expands inclusion without relaxing risk discipline. Policy always overrides the model.

**"Why not just Perfios plus bureau plus rules?"**
> Perfios parses statements. We underwrite thin-file borrowers beyond bureau reach, adding graph-based contextual intelligence, psychometric assessment for the truly new-to-credit, and uncertainty-aware starter-loan decisioning. No existing tool combines these into a unified, officer-ready copilot.

**"What about data privacy?"**
> Every data point enters through RBI's Account Aggregator framework with explicit, revocable, purpose-limited consent. We process data but don't store raw financial information beyond the scoring session. The consent trail is auditable. The architecture is aligned with DPDP Act 2023 and RBI's digital lending framework, with final legal validation part of the deployment process.

**"What if the model is wrong?"**
> Starter loans cap exposure. The deployment ladder starts with shadow scoring — zero lending risk. Officers can override with logged reasons. The system learns from overrides and outcomes. We designed for safe failure, not just accuracy.

---

## Appendices

### A. Glossary

| Term | Definition |
|---|---|
| AA | Account Aggregator — RBI-regulated NBFC for consent-based financial data sharing |
| DPD | Days Past Due — number of days a payment is overdue |
| NPA | Non-Performing Asset — loan classified as defaulted per RBI norms |
| FIP | Financial Information Provider — entity that holds customer financial data |
| FIU | Financial Information User — entity that consumes customer financial data |
| ReBIT | Reserve Bank Information Technology Pvt. Ltd. — frames AA technical specifications |
| DPDP | Digital Personal Data Protection Act 2023 |
| MCC | Merchant Category Code — standardized code classifying merchant business type |
| CBS | Core Banking System — central banking software |
| SHAP | SHapley Additive exPlanations — method for interpreting ML model predictions |
| PSI | Population Stability Index — measures shift in score distributions over time |
| ECE | Expected Calibration Error — measures alignment between predicted probabilities and actual outcomes |

### B. References

1. RBI Master Direction — NBFC Account Aggregator, Sep 2016 (updated Sep 2024)
2. RBI Guidelines on Digital Lending, Sep 2022
3. Digital Personal Data Protection Act, Aug 2023
4. Digital Personal Data Protection Rules, 2025
5. Sahamati — AA Technical Specifications and Sandbox Documentation
6. ReBIT — FI Schema Specifications v2.0 (api.rebit.org.in)
7. TransUnion CIBIL — CreditVision CMR Methodology
8. Perfios — Bank Statement Analyzer Technical Documentation
9. Home Credit Default Risk — Kaggle Competition Dataset and Solution Papers
10. Zandi et al. — Attention-based Dynamic Multilayer Graph Neural Networks for Loan Default Prediction, EJOR 2025
11. SAT-GNN — Consumer Credit Evaluation Using Sparse Attention Transformer and Graph Neural Network, Scientific Reports 2026
12. LenddoEFL — Psychometric Credit Scoring Methodology and Validation Studies
13. Flower Framework — Federated Learning for Financial Applications
14. NPCI — UPI Ecosystem Statistics and MCC-wise Transaction Data
15. CERT-In Directions on Information Security Practices, Apr 2022
16. RBI Master Direction on Outsourcing of Financial Services, Nov 2006
