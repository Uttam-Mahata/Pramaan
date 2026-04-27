export const BORROWER_PORTAL_CONTENT = {
  steps: [
    { id: 1, label: 'CONSENT' },
    { id: 2, label: 'AA LINK' },
    { id: 3, label: 'EVIDENCE' },
    { id: 4, label: 'DECISION' }
  ],
  consent: {
    title: "Purpose-Limited Consent",
    description: "Your data is fetched via RBI-regulated Account Aggregators. We only use it to determine creditworthiness. No data is stored beyond this scoring session.",
    requestedData: [
      "6-Month Bank Transactions",
      "GST Return Summary (for MSME)",
      "Verified Identity Tokens",
      "Consolidated Inflow Report"
    ]
  },
  aaLink: {
    title: "Linking via Account Aggregator",
    description: "Please select your primary bank to begin the secure data fetch via Sahamati framework.",
    banks: ["STATE BANK OF INDIA", "UCO BANK", "HDFC BANK", "ICICI BANK"]
  }
}

export const OFFICER_DASHBOARD_DATA = {
  pendingQueue: [
    { id: 'TXN-9421', segment: 'SALARIED', risk: 'LOW', score: 720, decision: 'APPROVE' },
    { id: 'MSME-4402', segment: 'MSME', risk: 'MED', score: 640, decision: 'STARTER_LOAN' },
    { id: 'GIG-1033', segment: 'GIG', risk: 'HIGH', score: 410, decision: 'REFER' },
    { id: 'TXN-0052', segment: 'SALARIED', risk: 'MED', score: 590, decision: 'REFER' },
    { id: 'MSME-8812', segment: 'MSME', risk: 'LOW', score: 780, decision: 'APPROVE' },
  ],
  activeApplication: {
    id: 'TXN-9421',
    segment: 'SALARIED TRACK',
    consentTimestamp: '12-APR-2026 14:22 IST',
    score: 720,
    probability: 0.08,
    confidence: 0.82,
    evidence: {
      sufficiency: 78,
      historyLength: '188 DAYS',
      txnDepth: '942 RECORDS',
      gstStatus: 'UNAVAILABLE'
    },
    shapReasons: [
      { label: "Surplus Regularity", impact: "+12.4%", pos: true },
      { label: "Merchant Diversity", impact: "+4.1%", pos: true },
      { label: "Txn History Length", impact: "-2.8%", pos: false },
      { label: "UPI Adoption Rate", impact: "+1.2%", pos: true },
    ],
    proposedTerms: {
      limit: '₹45,000',
      tenor: '12 MO.',
      rate: '11.5%',
      eir: '12.2%'
    }
  }
}
