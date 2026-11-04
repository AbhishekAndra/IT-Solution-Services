# Stackly Transformation ROI & Velocity Calculator

An enterprise-grade, single-file React component (Tailwind CSS) modeling multi-region Kubernetes modernization, agentic AI pipelines, GitOps automation, and zero-trust security economics for CTOs, VPs of Engineering, and Platform Leaders.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+ (tested on Node 22 & Node 25)
- npm or pnpm

### 2. Run the Unit Test Suite
The calculation engine has zero external runtime dependencies and is fully tested across min/max boundaries and compliance tiers:

```bash
# Run unit tests via native Node runner:
npm test

# Or if you use Vitest:
npm run test:vitest
```

### 3. Open the Interactive Live Preview
Open [`calculator-preview.html`](calculator-preview.html) directly in any modern browser to test sliders, number inputs, the pure SVG telemetry comparison chart, and the clipboard copy functionality.

---

## 📁 Project Architecture

```
├── src/
│   ├── components/
│   │   └── TransformationCalculator.tsx  # Single-file React component (Tailwind CSS)
│   └── lib/
│       ├── calculateROI.ts               # Pure, deterministic calculation engine + ASSUMPTIONS
│       └── calculateROI.test.ts          # Unit tests covering boundary inputs & compliance regimes
├── calculator-preview.html               # Instant standalone browser preview with live React 18
├── package.json                          # Package definition and test runner scripts
└── README.md                             # Documentation & operational guide
```

---

## 🧮 Mathematical Model & Architectural Assumptions

All business logic and coefficients reside in the exported `ASSUMPTIONS` constant object in [`src/lib/calculateROI.ts`](src/lib/calculateROI.ts):

1. **FinOps Cloud Efficiency (28% to 42%)**:
   - Tiered based on monthly infrastructure spend:
     - Tier 1 ($10k – $50k/mo): **28%** savings
     - Tier 2 ($50k – $250k/mo): **32%** savings
     - Tier 3 ($250k – $1M/mo): **36%** savings
     - Tier 4 ($1M – $2.5M/mo): **39%** savings
     - Tier 5 (> $2.5M/mo): **42%** savings

2. **DORA Elite Developer Hours Recovered**:
   - Deployment pipeline cycle time reduced from **1.8 hours** to **0.15 hours (9 min)** via automated GitOps (ArgoCD) and progressive canary delivery.
   - Outage remediation (MTTR) reduced from legacy hours to **0.5 hours** via automated rollback and self-healing zero-trust ingress.
   - Change failure rate (CFR) reduced by **75%** (floor of 3%).
   - Environment triage reduced by **85%** with ephemeral Kubernetes clusters.

3. **Time-to-Market (TTM) Reduction**:
   - Derived from environment friction (scaling up to 40 environments) and change failure rate (up to 60%).
   - Capped realistically at **74%** total lead time acceleration.

4. **Compliance Audit Preparation**:
   - **None**: 0 hours
   - **SOC 2 Type II**: 78% automation of ~420 baseline audit hours
   - **HIPAA**: 82% automation of ~580 baseline audit hours
   - **PCI-DSS 4.0**: 80% automation of ~680 baseline audit hours
   - **FedRAMP High/Moderate**: 85% automation of ~1,250 baseline audit hours

5. **Financial ROI Multiple & Payback**:
   - Blended fully-loaded engineer rate: **$118/hr** ($245k/yr enterprise compensation).
   - Dynamic Stackly consulting engagement investment curve ($85k to $650k).
   - Annual ROI multiple = `Total Annual Financial Benefit / Estimated Investment`.
   - Payback period = `Estimated Investment / (Total Annual Financial Benefit / 12)`.

---

## 💻 React Integration Example

```tsx
import React from 'react';
import { TransformationCalculator } from './components/TransformationCalculator';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0F14]">
      {/* Other homepage sections */}
      <TransformationCalculator />
    </main>
  );
}
```

### Tailwind CSS Setup
Ensure your `tailwind.config.js` includes the component path:

```js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#22D3EE',
          dark: '#0B0F14',
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🔒 Enterprise Quality & Accessibility
- **WCAG 2.1 AA Compliant**: High-contrast text on dark background (#0B0F14), explicit labels, and focus rings.
- **Accessible Sliders**: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and descriptive `aria-valuetext`.
- **Keyboard Operable**: Full tab indexing and numeric field synchronization.
- **Copy to Clipboard**: Seamless plain-text breakdown generation with live visual toast confirmation.
- **Pure SVG Telemetry Chart**: Zero external charting dependencies; lightweight and lightning-fast.

