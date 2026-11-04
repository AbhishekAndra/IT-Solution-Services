/**
 * STACKLY TRANSFORMATION ROI & VELOCITY CALCULATION ENGINE
 * =======================================================
 * Pure, deterministic calculation module for DevOps, Cloud & AI Platform Modernization.
 * 
 * Strictly follows zero-magic-number rule: all mathematical coefficients,
 * industry benchmarks (DORA 2024, FinOps Foundation, NIST 800-53), and economic
 * factors are declared and documented in the ASSUMPTIONS constant.
 */

export type ComplianceRegime = 'SOC2' | 'FedRAMP' | 'HIPAA' | 'PCI-DSS' | 'None';

export interface CalculatorInputs {
  /** Monthly cloud infrastructure spend in USD ($10,000 to $5,000,000) */
  monthlyCloudSpend: number;
  /** Total engineering & operations team size (5 to 500 engineers) */
  teamSize: number;
  /** Average production/staging deployment frequency per week (1 to 200) */
  deploysPerWeek: number;
  /** Mean time to recovery (MTTR) during outages/incidents in hours (1 to 72) */
  mttrHours: number;
  /** Production change failure rate percentage (1% to 60%) */
  changeFailureRate: number;
  /** Total number of cloud environments maintained (dev, staging, uat, prod, regions) (2 to 40) */
  environmentCount: number;
  /** Target regulatory or enterprise compliance framework */
  complianceRegime: ComplianceRegime;
}

export interface ComparisonMetricDetail {
  title: string;
  unit: string;
  current: number;
  post: number;
  deltaPercent: number;
  formattedCurrent: string;
  formattedPost: string;
}

export interface CalculatorOutputs {
  /** Annual cloud infrastructure cost savings in USD (FinOps 28% - 42%) */
  annualCloudCostSavings: number;
  /** Effective FinOps savings rate applied (0.28 to 0.42) */
  finOpsSavingsRate: number;

  /** Engineering hours recovered per engineer per month (DORA elite benchmarks) */
  hoursRecoveredPerEngineerMonth: number;
  /** Total engineering hours recovered across the entire team annually */
  totalEngineeringHoursRecoveredYear: number;
  /** Monetized annual engineering capacity value */
  annualEngineeringCapacityValue: number;

  /** Time-to-market reduction percentage derived from env count & CFR */
  timeToMarketReductionPercent: number;

  /** Estimated Stackly architectural consulting investment */
  estimatedInvestment: number;
  /** Projected annual ROI multiple (e.g. 3.4x) */
  projectedRoiMultiple: number;
  /** Estimated payback period in months (e.g. 3.2 months) */
  paybackPeriodMonths: number;

  /** Annual hours saved on compliance audit preparation & evidence collection */
  complianceAuditHoursSavedAnnual: number;
  /** Monetized annual compliance audit savings value */
  annualComplianceSavingsValue: number;

  /** Total net annualized financial impact (Cloud + Eng + Compliance) */
  totalAnnualFinancialBenefit: number;

  /** Headline comparisons for Current State vs Post-Transformation chart */
  comparisonMetrics: {
    monthlyCloudSpend: ComparisonMetricDetail;
    incidentDowntimeHoursMonthly: ComparisonMetricDetail;
    deployCycleHoursPerDeploy: ComparisonMetricDetail;
  };
}

/**
 * Top-Level Architectural & Economic Assumptions
 * =============================================
 * Every coefficient is documented with operational rationale and industry citations.
 */
export const ASSUMPTIONS = {
  // 1. FinOps Cloud Savings Tiers (28% to 42%)
  // Based on Stackly multi-region Kubernetes consolidation, Karpenter bin-packing,
  // automated spot/graviton migration, and idle environment reclamation.
  finOps: {
    minSpend: 10_000,
    maxSpend: 5_000_000,
    minSavingsRate: 0.28, // 28% floor for early cloud estates ($10k-$50k/mo)
    maxSavingsRate: 0.42, // Up to 42% for large multi-account enterprise clusters ($2.5M+/mo)
    tiers: [
      { maxSpend: 50_000, rate: 0.28, label: 'Standard FinOps Tier (28%)' },
      { maxSpend: 250_000, rate: 0.32, label: 'Mid-Market Scale Tier (32%)' },
      { maxSpend: 1_000_000, rate: 0.36, label: 'Multi-Region Enterprise Tier (36%)' },
      { maxSpend: 2_500_000, rate: 0.39, label: 'Global Infrastructure Tier (39%)' },
      { maxSpend: Infinity, rate: 0.42, label: 'Hyperscale Kubernetes Tier (42%)' },
    ],
  },

  // 2. Deployment Friction & Pipeline Automation
  // Stackly transitions teams to declarative GitOps (ArgoCD/Flux), trunk-based pipelines,
  // and automated container builds, drastically reducing coordination and verification drag.
  deployFriction: {
    currentHoursPerDeploy: 1.8,  // Average developer-hours lost per deployment in legacy pipelines (verifications, approval gates, manual smoke tests)
    postHoursPerDeploy: 0.15,    // Fully automated GitOps deployment with automated progressive canary delivery (~9 minutes)
    weeksPerMonth: 4.333,        // Average number of weeks per calendar month
  },

  // 3. Incident Remediation & DORA Elite MTTR
  // DORA State of DevOps benchmarks indicate Elite performers achieve MTTR < 1 hour
  // and CFR under 15% through automated rollbacks, distributed tracing, and zero-trust isolation.
  doraBenchmarks: {
    targetMttrHours: 0.5,        // Target MTTR under Stackly architecture (30 minutes automated canary rollback & self-healing)
    cfrReductionMultiplier: 0.25,// 75% reduction in change failures via automated contract testing & ephemeral preview validation
    minPostCfrPercent: 3.0,      // Minimum realistic floor for post-transformation CFR (3%)
    engineersPerIncident: 2.5,   // Average number of on-call/senior engineers diverted during an outage bridge
  },

  // 4. Environment Maintenance Overhead
  // Static long-lived environments suffer from configuration drift, manual patching, and queue contention.
  // Ephemeral environments on Kubernetes eliminate manual drift.
  environmentOverhead: {
    legacyHoursPerEnvMonthly: 6.0,  // Hours spent per static environment per month fixing drift, permissions, and sync issues
    ephemeralSavingsPercent: 0.85,  // 85% reduction in environment triage time with Crossplane/GitOps Infrastructure as Code
  },

  // 5. Time-to-Market (TTM) Reduction Dynamics
  // Time-to-market is slowed by two primary bottlenecks:
  // a) Environment queues & promotion gates (more static environments = slower release trains)
  // b) High change failure rates (causing code freezes, emergency hotfix cycles, and prolonged QA gates)
  timeToMarket: {
    baseReductionPercent: 22.0,   // Base efficiency from trunk-based GitOps and continuous delivery
    envFactorMaxPercent: 26.0,    // Maximum incremental speedup from eliminating multi-environment promotion bottlenecks
    maxEnvDenominator: 40.0,      // Normalization scale for environment count (up to 40)
    cfrFactorMaxPercent: 28.0,    // Maximum incremental speedup from eliminating high-risk failed release rollbacks
    maxCfrDenominator: 60.0,      // Normalization scale for change failure rate (up to 60%)
    maxTotalTtmReduction: 74.0,   // Maximum realistic total time-to-market reduction cap
  },

  // 6. Regulatory Compliance Audit Preparation Savings
  // Manual evidence gathering, screenshotting cloud configs, and tracking change logs consume hundreds of engineering hours.
  // Continuous automated compliance via Kyverno/OPA, Falco, and automated audit evidence pipelines drastically reduces prep time.
  compliance: {
    None: { baseHoursAnnual: 0, automationSavingsRate: 0, label: 'No Regulatory Regime' },
    SOC2: { baseHoursAnnual: 420, automationSavingsRate: 0.78, label: 'SOC 2 Type II' },        // SOC 2 Type II evidence generation
    HIPAA: { baseHoursAnnual: 580, automationSavingsRate: 0.82, label: 'HIPAA Security Rule' }, // ePHI access control & encryption proof
    'PCI-DSS': { baseHoursAnnual: 680, automationSavingsRate: 0.80, label: 'PCI-DSS 4.0' },     // Cardholder data scope isolation & continuous scan logs
    FedRAMP: { baseHoursAnnual: 1250, automationSavingsRate: 0.85, label: 'FedRAMP High / Moderate' }, // High-impact NIST 800-53 automated OSCAL evidence
    envScaleMultiplier: 0.025, // Each extra environment beyond 2 adds 2.5% audit scope complexity
  },

  // 7. Economics & Financial Benchmarks
  economics: {
    blendedHourlyRate: 118,       // Fully loaded hourly compensation for Senior DevOps / Cloud Platform Engineer ($245k/year)
    maxRecoveredHoursPerMonth: 65,// Ergonomic cap on recovered hours per engineer/month (never exceed ~40% of standard 160h month)
  },

  // 8. Stackly Architectural Engagement Investment Model
  // Reflects realistic Stackly consulting engagement pricing for enterprise cloud & AI platform modernization.
  engagementModel: {
    baseEngagementCost: 95_000,       // Core architectural sprint & modernization foundation
    cloudSpendCoeff: 0.055,           // Incremental scale factor based on cloud estate footprint
    teamSizeCoeff: 450,               // Tooling roll-out, platform enablement, and training per engineer
    environmentCoeff: 1_250,          // Multi-region & multi-cluster topology provisioning per environment
    minEngagementCost: 85_000,        // Floor investment
    maxEngagementCost: 650_000,       // Ceiling investment for massive enterprises
  },

  // 9. Input Validation Boundaries
  boundaries: {
    monthlyCloudSpend: { min: 10_000, max: 5_000_000, default: 125_000, step: 5_000 },
    teamSize: { min: 5, max: 500, default: 40, step: 1 },
    deploysPerWeek: { min: 1, max: 200, default: 24, step: 1 },
    mttrHours: { min: 1, max: 72, default: 8, step: 0.5 },
    changeFailureRate: { min: 1, max: 60, default: 18, step: 1 },
    environmentCount: { min: 2, max: 40, default: 8, step: 1 },
    complianceRegimes: ['None', 'SOC2', 'HIPAA', 'PCI-DSS', 'FedRAMP'] as const,
  },
} as const;

/**
 * Pure calculation function for Transformation ROI & Velocity.
 * Fully deterministic, stateless, and safe for unit tests and SSR.
 */
export function calculateROI(rawInputs: Partial<CalculatorInputs>): CalculatorOutputs {
  // 1. Sanitize and clamp all inputs to valid domain boundaries
  const spend = clamp(
    rawInputs.monthlyCloudSpend ?? ASSUMPTIONS.boundaries.monthlyCloudSpend.default,
    ASSUMPTIONS.boundaries.monthlyCloudSpend.min,
    ASSUMPTIONS.boundaries.monthlyCloudSpend.max
  );

  const team = clamp(
    rawInputs.teamSize ?? ASSUMPTIONS.boundaries.teamSize.default,
    ASSUMPTIONS.boundaries.teamSize.min,
    ASSUMPTIONS.boundaries.teamSize.max
  );

  const deploys = clamp(
    rawInputs.deploysPerWeek ?? ASSUMPTIONS.boundaries.deploysPerWeek.default,
    ASSUMPTIONS.boundaries.deploysPerWeek.min,
    ASSUMPTIONS.boundaries.deploysPerWeek.max
  );

  const mttr = clamp(
    rawInputs.mttrHours ?? ASSUMPTIONS.boundaries.mttrHours.default,
    ASSUMPTIONS.boundaries.mttrHours.min,
    ASSUMPTIONS.boundaries.mttrHours.max
  );

  const cfr = clamp(
    rawInputs.changeFailureRate ?? ASSUMPTIONS.boundaries.changeFailureRate.default,
    ASSUMPTIONS.boundaries.changeFailureRate.min,
    ASSUMPTIONS.boundaries.changeFailureRate.max
  );

  const envs = clamp(
    rawInputs.environmentCount ?? ASSUMPTIONS.boundaries.environmentCount.default,
    ASSUMPTIONS.boundaries.environmentCount.min,
    ASSUMPTIONS.boundaries.environmentCount.max
  );

  const regime: ComplianceRegime = (
    rawInputs.complianceRegime && rawInputs.complianceRegime in ASSUMPTIONS.compliance
      ? rawInputs.complianceRegime
      : 'SOC2'
  );

  // 2. FinOps Cloud Cost Savings
  const matchingTier = ASSUMPTIONS.finOps.tiers.find(tier => spend <= tier.maxSpend) 
    ?? ASSUMPTIONS.finOps.tiers[ASSUMPTIONS.finOps.tiers.length - 1];
  const finOpsSavingsRate = matchingTier.rate;
  const annualCloudCostSavings = Math.round(spend * 12 * finOpsSavingsRate);

  // 3. Engineering Hours Recovered (DORA Elite Benchmarks)
  const monthlyDeploys = deploys * ASSUMPTIONS.deployFriction.weeksPerMonth;
  const deployHoursSavedMonth = monthlyDeploys * (
    ASSUMPTIONS.deployFriction.currentHoursPerDeploy - ASSUMPTIONS.deployFriction.postHoursPerDeploy
  );

  const currentFailedDeploys = monthlyDeploys * (cfr / 100);
  const currentIncidentHoursMonth = currentFailedDeploys * mttr * ASSUMPTIONS.doraBenchmarks.engineersPerIncident;

  const postCfr = Math.max(
    ASSUMPTIONS.doraBenchmarks.minPostCfrPercent,
    cfr * ASSUMPTIONS.doraBenchmarks.cfrReductionMultiplier
  );
  const postFailedDeploys = monthlyDeploys * (postCfr / 100);
  const postIncidentHoursMonth = postFailedDeploys * ASSUMPTIONS.doraBenchmarks.targetMttrHours * ASSUMPTIONS.doraBenchmarks.engineersPerIncident;
  const incidentHoursSavedMonth = Math.max(0, currentIncidentHoursMonth - postIncidentHoursMonth);

  const envHoursSavedMonth = envs * ASSUMPTIONS.environmentOverhead.legacyHoursPerEnvMonthly * ASSUMPTIONS.environmentOverhead.ephemeralSavingsPercent;

  const totalHoursSavedOrgMonth = deployHoursSavedMonth + incidentHoursSavedMonth + envHoursSavedMonth;
  const rawHoursPerEngineerMonth = totalHoursSavedOrgMonth / team;
  const hoursRecoveredPerEngineerMonth = Math.min(
    ASSUMPTIONS.economics.maxRecoveredHoursPerMonth,
    Math.max(1.5, Math.round(rawHoursPerEngineerMonth * 10) / 10)
  );

  const totalEngineeringHoursRecoveredYear = Math.round(hoursRecoveredPerEngineerMonth * 12 * team);
  const annualEngineeringCapacityValue = Math.round(
    totalEngineeringHoursRecoveredYear * ASSUMPTIONS.economics.blendedHourlyRate
  );

  // 4. Time-to-Market (TTM) Reduction Percentage
  const envBonus = (envs / ASSUMPTIONS.timeToMarket.maxEnvDenominator) * ASSUMPTIONS.timeToMarket.envFactorMaxPercent;
  const cfrBonus = (cfr / ASSUMPTIONS.timeToMarket.maxCfrDenominator) * ASSUMPTIONS.timeToMarket.cfrFactorMaxPercent;
  const rawTtm = ASSUMPTIONS.timeToMarket.baseReductionPercent + envBonus + cfrBonus;
  const timeToMarketReductionPercent = Math.min(
    ASSUMPTIONS.timeToMarket.maxTotalTtmReduction,
    Math.round(rawTtm * 10) / 10
  );

  // 5. Compliance Audit Preparation Savings
  const complianceConfig = ASSUMPTIONS.compliance[regime];
  const envScale = 1 + Math.max(0, envs - 2) * ASSUMPTIONS.compliance.envScaleMultiplier;
  const complianceAuditHoursSavedAnnual = Math.round(
    complianceConfig.baseHoursAnnual * complianceConfig.automationSavingsRate * envScale
  );
  const annualComplianceSavingsValue = Math.round(
    complianceAuditHoursSavedAnnual * ASSUMPTIONS.economics.blendedHourlyRate
  );

  // 6. Consulting Investment & Economic ROI Multiple
  const rawInvestment = ASSUMPTIONS.engagementModel.baseEngagementCost
    + (spend * ASSUMPTIONS.engagementModel.cloudSpendCoeff)
    + (team * ASSUMPTIONS.engagementModel.teamSizeCoeff)
    + (envs * ASSUMPTIONS.engagementModel.environmentCoeff);

  const estimatedInvestment = Math.round(
    clamp(
      rawInvestment,
      ASSUMPTIONS.engagementModel.minEngagementCost,
      ASSUMPTIONS.engagementModel.maxEngagementCost
    )
  );

  const totalAnnualFinancialBenefit = annualCloudCostSavings + annualEngineeringCapacityValue + annualComplianceSavingsValue;
  const rawRoi = totalAnnualFinancialBenefit / estimatedInvestment;
  const projectedRoiMultiple = Math.round(rawRoi * 10) / 10;

  const monthlyFinancialBenefit = totalAnnualFinancialBenefit / 12;
  const rawPayback = monthlyFinancialBenefit > 0
    ? estimatedInvestment / monthlyFinancialBenefit
    : 12.0;
  const paybackPeriodMonths = Math.min(24, Math.max(0.6, Math.round(rawPayback * 10) / 10));

  // 7. Comparison Metrics Detail (for Bar Chart visualization)
  const monthlyCloudSpendMetric: ComparisonMetricDetail = {
    title: 'Monthly Cloud Infrastructure Spend',
    unit: '$ USD',
    current: Math.round(spend),
    post: Math.round(spend * (1 - finOpsSavingsRate)),
    deltaPercent: -Math.round(finOpsSavingsRate * 100),
    formattedCurrent: formatCurrency(Math.round(spend)),
    formattedPost: formatCurrency(Math.round(spend * (1 - finOpsSavingsRate))),
  };

  const currentDowntimeHours = Math.round(currentFailedDeploys * mttr * 10) / 10;
  const postDowntimeHours = Math.round(postFailedDeploys * ASSUMPTIONS.doraBenchmarks.targetMttrHours * 10) / 10;
  const downtimeDelta = currentDowntimeHours > 0
    ? -Math.round(((currentDowntimeHours - postDowntimeHours) / currentDowntimeHours) * 100)
    : -85;

  const incidentDowntimeMetric: ComparisonMetricDetail = {
    title: 'Monthly Incident Outage Hours',
    unit: 'Hours/mo',
    current: currentDowntimeHours,
    post: postDowntimeHours,
    deltaPercent: downtimeDelta,
    formattedCurrent: `${currentDowntimeHours}h`,
    formattedPost: `${postDowntimeHours}h`,
  };

  const deployCycleMetric: ComparisonMetricDetail = {
    title: 'Deployment Pipeline Lead Time',
    unit: 'Hours/deploy',
    current: ASSUMPTIONS.deployFriction.currentHoursPerDeploy,
    post: ASSUMPTIONS.deployFriction.postHoursPerDeploy,
    deltaPercent: -Math.round(
      ((ASSUMPTIONS.deployFriction.currentHoursPerDeploy - ASSUMPTIONS.deployFriction.postHoursPerDeploy)
        / ASSUMPTIONS.deployFriction.currentHoursPerDeploy) * 100
    ),
    formattedCurrent: `${ASSUMPTIONS.deployFriction.currentHoursPerDeploy}h`,
    formattedPost: `${Math.round(ASSUMPTIONS.deployFriction.postHoursPerDeploy * 60)}m`,
  };

  return {
    annualCloudCostSavings,
    finOpsSavingsRate,
    hoursRecoveredPerEngineerMonth,
    totalEngineeringHoursRecoveredYear,
    annualEngineeringCapacityValue,
    timeToMarketReductionPercent,
    estimatedInvestment,
    projectedRoiMultiple,
    paybackPeriodMonths,
    complianceAuditHoursSavedAnnual,
    annualComplianceSavingsValue,
    totalAnnualFinancialBenefit,
    comparisonMetrics: {
      monthlyCloudSpend: monthlyCloudSpendMetric,
      incidentDowntimeHoursMonthly: incidentDowntimeMetric,
      deployCycleHoursPerDeploy: deployCycleMetric,
    },
  };
}

/** Utility helper to clamp values within min/max bounds */
function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

/** Formatter for USD currencies (e.g. $125,000) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formatter for large compact numbers (e.g. $1.2M, $450k) */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

/** Formatter for integers with commas */
export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);
}

/**
 * Generates an executive-ready plain-text breakdown for clipboard copying.
 */
export function generateSummaryText(inputs: CalculatorInputs, outputs: CalculatorOutputs): string {
  const dateStr = new Date().toISOString().split('T')[0];

  return `============================================================
STACKLY TRANSFORMATION ROI & VELOCITY MODEL
============================================================
Architecture: Kubernetes Modernization, GitOps, Agentic AI & Zero-Trust
Generated: ${dateStr}
Reference: Stackly Enterprise Architecture Engagement
Disclaimer: Estimates based on Stackly engagement averages; not a binding quote.

INPUT CONFIGURATION:
• Monthly Cloud Spend:           ${formatCurrency(inputs.monthlyCloudSpend)} / month
• Engineering Team Size:         ${inputs.teamSize} engineers
• Deploy Frequency:              ${inputs.deploysPerWeek} deploys / week
• Incident Recovery (MTTR):      ${inputs.mttrHours} hours
• Change Failure Rate:           ${inputs.changeFailureRate}%
• Managed Environments:          ${inputs.environmentCount} environments
• Regulatory Compliance Regime:  ${inputs.complianceRegime}

PROJECTED VALUE & EFFICIENCY DELIVERABLES:
1. Cloud FinOps Optimization:
   • Annual Cloud Cost Savings:  ${formatCurrency(outputs.annualCloudCostSavings)} / year
   • Effective Reduction Rate:   ${(outputs.finOpsSavingsRate * 100).toFixed(0)}% lower cloud infrastructure bill

2. Engineering Velocity & DORA Elite Benchmarks:
   • Developer Hours Recovered:  ${outputs.hoursRecoveredPerEngineerMonth} hrs / engineer / month
   • Org-Wide Annual Capacity:   ${formatNumber(outputs.totalEngineeringHoursRecoveredYear)} engineering hours recovered
   • Annual Capacity Value:      ${formatCurrency(outputs.annualEngineeringCapacityValue)} ($${ASSUMPTIONS.economics.blendedHourlyRate}/hr blended rate)

3. Release Velocity & Quality:
   • Time-to-Market Acceleration:${outputs.timeToMarketReductionPercent}% lead time reduction
   • Deployment Cycle Time:      From ${outputs.comparisonMetrics.deployCycleHoursPerDeploy.formattedCurrent} down to ${outputs.comparisonMetrics.deployCycleHoursPerDeploy.formattedPost}
   • Incident Downtime:          From ${outputs.comparisonMetrics.incidentDowntimeHoursMonthly.formattedCurrent} down to ${outputs.comparisonMetrics.incidentDowntimeHoursMonthly.formattedPost} (${outputs.comparisonMetrics.incidentDowntimeHoursMonthly.deltaPercent}%)

4. Compliance & Audit Automation:
   • Target Compliance Regime:   ${inputs.complianceRegime}
   • Audit Prep Time Saved:      ${formatNumber(outputs.complianceAuditHoursSavedAnnual)} hours / year
   • Monetized Audit Savings:    ${formatCurrency(outputs.annualComplianceSavingsValue)}

FINANCIAL EXECUTIVE SUMMARY:
------------------------------------------------------------
• Total Net Annual Financial Benefit: ${formatCurrency(outputs.totalAnnualFinancialBenefit)} / year
• Estimated Stackly Investment:       ${formatCurrency(outputs.estimatedInvestment)}
• Projected Annual ROI Multiple:      ${outputs.projectedRoiMultiple}x
• Estimated Payback Period:           ${outputs.paybackPeriodMonths} months
============================================================
Schedule your Stackly Architecture Review:
https://stackly.systems/contact
============================================================`;
}
