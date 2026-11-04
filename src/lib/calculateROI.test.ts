/**
 * UNIT TESTS: STACKLY TRANSFORMATION ROI & VELOCITY CALCULATION ENGINE
 * ====================================================================
 * Compatible with Vitest, Jest, and Node 25 native test runner (`node --test`).
 * 
 * Coverage:
 * 1. Minimum boundary inputs
 * 2. Maximum boundary inputs
 * 3. Out-of-boundary input clamping
 * 4. All 5 FinOps spend tiers (28% to 42%)
 * 5. All 5 Compliance regimes (None, SOC2, HIPAA, PCI-DSS, FedRAMP)
 * 6. DORA Elite hours recovered & MTTR mechanics
 * 7. Time-to-market reduction bounds
 * 8. ROI Multiple & Payback Period validity
 * 9. Plain-text executive summary generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateROI,
  ASSUMPTIONS,
  generateSummaryText,
  formatCurrency,
  formatCompactCurrency,
  type CalculatorInputs,
  type ComplianceRegime,
} from './calculateROI.ts';

describe('calculateROI() Unit Test Suite', () => {

  describe('1. Default & Typical Mid-Market Enterprise Scenario', () => {
    it('calculates expected metrics for a typical mid-market enterprise ($125k/mo, 40 eng, SOC2)', () => {
      const inputs: CalculatorInputs = {
        monthlyCloudSpend: 125_000,
        teamSize: 40,
        deploysPerWeek: 24,
        mttrHours: 8,
        changeFailureRate: 18,
        environmentCount: 8,
        complianceRegime: 'SOC2',
      };

      const result = calculateROI(inputs);

      // FinOps spend is in tier 2 ($50k - $250k) -> 32%
      assert.equal(result.finOpsSavingsRate, 0.32);
      assert.equal(result.annualCloudCostSavings, 125_000 * 12 * 0.32); // $480,000

      // DORA hours recovered
      assert.ok(result.hoursRecoveredPerEngineerMonth > 5);
      assert.ok(result.hoursRecoveredPerEngineerMonth <= ASSUMPTIONS.economics.maxRecoveredHoursPerMonth);
      assert.equal(
        result.totalEngineeringHoursRecoveredYear,
        Math.round(result.hoursRecoveredPerEngineerMonth * 12 * 40)
      );

      // Time-to-Market reduction should be within [22%, 74%]
      assert.ok(result.timeToMarketReductionPercent >= 22);
      assert.ok(result.timeToMarketReductionPercent <= 74);

      // Compliance audit prep for SOC2
      assert.ok(result.complianceAuditHoursSavedAnnual > 300);
      assert.equal(
        result.annualComplianceSavingsValue,
        Math.round(result.complianceAuditHoursSavedAnnual * ASSUMPTIONS.economics.blendedHourlyRate)
      );

      // Financials & ROI
      assert.ok(result.estimatedInvestment >= ASSUMPTIONS.engagementModel.minEngagementCost);
      assert.ok(result.estimatedInvestment <= ASSUMPTIONS.engagementModel.maxEngagementCost);
      assert.ok(result.projectedRoiMultiple > 2.0);
      assert.ok(result.paybackPeriodMonths > 0.5 && result.paybackPeriodMonths < 12);
    });
  });

  describe('2. Boundary Testing: Minimum Allowed Inputs', () => {
    it('handles absolute minimum boundary inputs without divide-by-zero or NaN', () => {
      const minInputs: CalculatorInputs = {
        monthlyCloudSpend: 10_000,
        teamSize: 5,
        deploysPerWeek: 1,
        mttrHours: 1,
        changeFailureRate: 1,
        environmentCount: 2,
        complianceRegime: 'None',
      };

      const result = calculateROI(minInputs);

      // Tier 1 FinOps floor -> 28%
      assert.equal(result.finOpsSavingsRate, 0.28);
      assert.equal(result.annualCloudCostSavings, 10_000 * 12 * 0.28); // $33,600

      // Hours recovered is positive and realistic
      assert.ok(result.hoursRecoveredPerEngineerMonth >= 1.5);
      assert.ok(Number.isFinite(result.hoursRecoveredPerEngineerMonth));

      // Compliance hours for 'None' should strictly be 0
      assert.equal(result.complianceAuditHoursSavedAnnual, 0);
      assert.equal(result.annualComplianceSavingsValue, 0);

      // Investment floor respected
      assert.ok(result.estimatedInvestment >= ASSUMPTIONS.engagementModel.minEngagementCost);
      assert.ok(result.estimatedInvestment <= 110_000);

      // Zero NaN checks
      assert.ok(Number.isFinite(result.projectedRoiMultiple));
      assert.ok(Number.isFinite(result.paybackPeriodMonths));
      assert.ok(result.projectedRoiMultiple > 0);
    });
  });

  describe('3. Boundary Testing: Maximum Allowed Inputs', () => {
    it('handles absolute maximum boundary inputs ($5M/mo, 500 eng, 200 deploys/wk, 72h MTTR, 60% CFR, FedRAMP)', () => {
      const maxInputs: CalculatorInputs = {
        monthlyCloudSpend: 5_000_000,
        teamSize: 500,
        deploysPerWeek: 200,
        mttrHours: 72,
        changeFailureRate: 60,
        environmentCount: 40,
        complianceRegime: 'FedRAMP',
      };

      const result = calculateROI(maxInputs);

      // Tier 5 FinOps ceiling -> 42%
      assert.equal(result.finOpsSavingsRate, 0.42);
      assert.equal(result.annualCloudCostSavings, 5_000_000 * 12 * 0.42); // $25,200,000

      // Hours recovered is clamped to the ergonomic ceiling
      assert.ok(result.hoursRecoveredPerEngineerMonth <= ASSUMPTIONS.economics.maxRecoveredHoursPerMonth);
      assert.ok(result.hoursRecoveredPerEngineerMonth >= 40);

      // Time-to-Market is clamped to maximum realistic ceiling
      assert.equal(result.timeToMarketReductionPercent, ASSUMPTIONS.timeToMarket.maxTotalTtmReduction); // 74%

      // FedRAMP compliance prep savings
      assert.ok(result.complianceAuditHoursSavedAnnual > 1000);
      assert.ok(result.annualComplianceSavingsValue > 100_000);

      // Investment is capped near max engagement cost
      assert.ok(result.estimatedInvestment <= ASSUMPTIONS.engagementModel.maxEngagementCost);
      assert.ok(result.estimatedInvestment >= 600_000);

      // ROI multiple should be very strong for a $5M spend enterprise
      assert.ok(result.projectedRoiMultiple > 30);
      assert.ok(result.paybackPeriodMonths <= 1.0);
    });
  });

  describe('4. Input Clamping & Out-of-Bounds Sanitization', () => {
    it('clamps negative or zero inputs to valid minimums', () => {
      const invalidNegative: Partial<CalculatorInputs> = {
        monthlyCloudSpend: -50_000,
        teamSize: -10,
        deploysPerWeek: 0,
        mttrHours: -5,
        changeFailureRate: -20,
        environmentCount: 0,
      };

      const result = calculateROI(invalidNegative);

      // Clamped to minimum spend of $10,000
      assert.equal(result.comparisonMetrics.monthlyCloudSpend.current, 10_000);
      assert.equal(result.finOpsSavingsRate, 0.28);
      assert.ok(result.hoursRecoveredPerEngineerMonth >= 1.5);
    });

    it('clamps excessive inputs beyond domain boundaries to valid maximums', () => {
      const excessiveInputs: Partial<CalculatorInputs> = {
        monthlyCloudSpend: 99_000_000,
        teamSize: 10_000,
        deploysPerWeek: 5_000,
        mttrHours: 500,
        changeFailureRate: 150,
        environmentCount: 200,
      };

      const result = calculateROI(excessiveInputs);

      // Clamped to maximum spend of $5,000,000
      assert.equal(result.comparisonMetrics.monthlyCloudSpend.current, 5_000_000);
      assert.equal(result.finOpsSavingsRate, 0.42);
      assert.equal(result.timeToMarketReductionPercent, ASSUMPTIONS.timeToMarket.maxTotalTtmReduction);
    });
  });

  describe('5. Compliance Tiers Verification', () => {
    const regimes: ComplianceRegime[] = ['None', 'SOC2', 'HIPAA', 'PCI-DSS', 'FedRAMP'];

    it('verifies compliance hours hierarchy: FedRAMP > PCI-DSS > HIPAA > SOC2 > None', () => {
      const baseInput: CalculatorInputs = {
        monthlyCloudSpend: 100_000,
        teamSize: 30,
        deploysPerWeek: 15,
        mttrHours: 4,
        changeFailureRate: 10,
        environmentCount: 6,
        complianceRegime: 'None',
      };

      const results = regimes.map(regime => ({
        regime,
        ...calculateROI({ ...baseInput, complianceRegime: regime }),
      }));

      // None must be strictly 0
      const noneResult = results.find(r => r.regime === 'None');
      assert.equal(noneResult?.complianceAuditHoursSavedAnnual, 0);

      // Check strictly ascending ordering for active regimes
      const soc2 = results.find(r => r.regime === 'SOC2')!.complianceAuditHoursSavedAnnual;
      const hipaa = results.find(r => r.regime === 'HIPAA')!.complianceAuditHoursSavedAnnual;
      const pci = results.find(r => r.regime === 'PCI-DSS')!.complianceAuditHoursSavedAnnual;
      const fedramp = results.find(r => r.regime === 'FedRAMP')!.complianceAuditHoursSavedAnnual;

      assert.ok(soc2 > 0, 'SOC2 hours should be > 0');
      assert.ok(hipaa > soc2, 'HIPAA audit prep hours should exceed SOC2');
      assert.ok(pci > hipaa, 'PCI-DSS audit prep hours should exceed HIPAA');
      assert.ok(fedramp > pci, 'FedRAMP audit prep hours should exceed PCI-DSS');
    });

    it('scales compliance prep time with environment count', () => {
      const lowEnv = calculateROI({
        monthlyCloudSpend: 100_000,
        teamSize: 25,
        deploysPerWeek: 10,
        mttrHours: 4,
        changeFailureRate: 12,
        environmentCount: 2,
        complianceRegime: 'SOC2',
      });

      const highEnv = calculateROI({
        monthlyCloudSpend: 100_000,
        teamSize: 25,
        deploysPerWeek: 10,
        mttrHours: 4,
        changeFailureRate: 12,
        environmentCount: 16,
        complianceRegime: 'SOC2',
      });

      assert.ok(
        highEnv.complianceAuditHoursSavedAnnual > lowEnv.complianceAuditHoursSavedAnnual,
        'More environments should require more audit evidence gathering'
      );
    });
  });

  describe('6. FinOps Spend Tiers Verification (28% to 42%)', () => {
    const tierTestCases = [
      { spend: 25_000, expectedRate: 0.28, label: 'Tier 1 (<= $50k)' },
      { spend: 100_000, expectedRate: 0.32, label: 'Tier 2 ($50k - $250k)' },
      { spend: 500_000, expectedRate: 0.36, label: 'Tier 3 ($250k - $1M)' },
      { spend: 1_800_000, expectedRate: 0.39, label: 'Tier 4 ($1M - $2.5M)' },
      { spend: 3_500_000, expectedRate: 0.42, label: 'Tier 5 (> $2.5M)' },
    ];

    for (const { spend, expectedRate, label } of tierTestCases) {
      it(`accurately applies ${label} with rate ${expectedRate * 100}%`, () => {
        const result = calculateROI({ monthlyCloudSpend: spend });
        assert.equal(result.finOpsSavingsRate, expectedRate);
        assert.equal(result.annualCloudCostSavings, Math.round(spend * 12 * expectedRate));
      });
    }
  });

  describe('7. Comparison Metrics for Bar Chart', () => {
    it('produces valid Current vs Post comparison metrics with negative delta percentages', () => {
      const result = calculateROI({
        monthlyCloudSpend: 150_000,
        mttrHours: 12,
        changeFailureRate: 25,
        deploysPerWeek: 20,
      });

      const metrics = result.comparisonMetrics;

      // Spend: current > post
      assert.ok(metrics.monthlyCloudSpend.current > metrics.monthlyCloudSpend.post);
      assert.ok(metrics.monthlyCloudSpend.deltaPercent < 0);

      // Downtime: current > post
      assert.ok(metrics.incidentDowntimeHoursMonthly.current > metrics.incidentDowntimeHoursMonthly.post);
      assert.ok(metrics.incidentDowntimeHoursMonthly.deltaPercent < 0);

      // Lead time: current > post
      assert.ok(metrics.deployCycleHoursPerDeploy.current > metrics.deployCycleHoursPerDeploy.post);
      assert.ok(metrics.deployCycleHoursPerDeploy.deltaPercent < 0);
    });
  });

  describe('8. Plain-Text Summary Generator & Formatters', () => {
    it('generates a complete executive clipboard summary containing all inputs, outputs, and contact link', () => {
      const inputs: CalculatorInputs = {
        monthlyCloudSpend: 200_000,
        teamSize: 50,
        deploysPerWeek: 30,
        mttrHours: 6,
        changeFailureRate: 15,
        environmentCount: 10,
        complianceRegime: 'HIPAA',
      };

      const outputs = calculateROI(inputs);
      const summary = generateSummaryText(inputs, outputs);

      assert.ok(summary.includes('STACKLY TRANSFORMATION ROI & VELOCITY MODEL'));
      assert.ok(summary.includes('$200,000 / month'));
      assert.ok(summary.includes('HIPAA'));
      assert.ok(summary.includes('PROJECTED VALUE & EFFICIENCY DELIVERABLES'));
      assert.ok(summary.toUpperCase().includes('TOTAL NET ANNUAL FINANCIAL BENEFIT'));
      assert.ok(summary.includes('https://stackly.systems/contact'));
      assert.ok(summary.includes('Estimates based on Stackly engagement averages; not a binding quote.'));
    });

    it('formats currencies and compact amounts cleanly', () => {
      assert.equal(formatCurrency(125000), '$125,000');
      assert.equal(formatCompactCurrency(2500000), '$2.50M');
      assert.equal(formatCompactCurrency(450000), '$450k');
    });
  });

});
