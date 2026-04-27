# Design System: Pramaan (Evidence-Based Underwriting)

## 1. Visual Theme & Atmosphere
**Clinical & Evidentiary**. The interface must feel like a high-precision medical instrument or a legal evidence dossier. 
- **Density:** 7/10 (Professional, data-rich but not cluttered)
- **Variance:** 6/10 (Structured asymmetry to guide the eye toward "Evidence")
- **Motion:** 4/10 (Restrained, functional spring physics; no "whiz-bang" effects)
- **Key Metaphor:** The "Evidence Badge". Every score is a claim that needs visual proof.

## 2. Color Palette & Roles
- **Evidence White** (#FDFDFD) — Primary background
- **Steel Surface** (#F1F5F9) — Card backgrounds and secondary areas
- **Dossier Ink** (#0F172A) — Primary text (Slate-900 depth)
- **Muted Signal** (#64748B) — Meta-data and secondary labels
- **Pramaan Blue** (#2563EB) — The "Trust" accent for verified signals
- **Risk Amber** (#D97706) — Warning/Partial evidence states
- **Security Border** (rgba(15, 23, 42, 0.08)) — Ultra-thin 1px structural lines

## 3. Typography Rules
- **Display:** "Montserrat" — Bold, authoritative, and stable. Used for primary headers and logo.
- **Body:** "Manrope" — High legibility with a modern, clean geometric character.
- **Mono:** "JetBrains Mono" — **Mandatory** for all transaction IDs, timestamps, and raw evidence values.
- **Hierarchy:** Use bold weights (700-900) for Montserrat headers to convey institutional trust.

## 4. Component Stylings
- **Evidence Badges:** Small, high-contrast pills (e.g., "78/100 SUFFICIENCY").
- **Dossier Cards:** Sharp 4px borders (not heavily rounded). Zero box-shadow; use 1px borders to define space.
- **The "Confidence Gauge":** A custom SVG component showing probability distribution, not a simple progress bar.
- **SHAP Reason Codes:** Represented as "Positive/Negative Impact" tags with monotonic color coding.

## 5. Layout Principles
- **Left-Heavy Dashboard:** Decisions on the left, Evidence Dossier on the right.
- **Single-Column Collapse:** Strict collapse for mobile; loan officers often review on the go.
- **Data Grids:** High-density, mono-spaced numbers.

## 6. Anti-Patterns (Banned)
- No Emojis (use Lucide-React icons for technical signals).
- No Purple Gradients.
- No "Inter" font.
- No rounded corners > 8px (keep it professional and sharp).
- No generic "Learn More" CTAs.
- No fake numbers or filler text.
