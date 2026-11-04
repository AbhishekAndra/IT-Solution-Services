'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  calculateROI,
  ASSUMPTIONS,
  generateSummaryText,
  formatCurrency,
  formatCompactCurrency,
  type CalculatorInputs,
  type ComplianceRegime,
} from '../lib/calculateROI.ts';

/**
 * STACKLY TRANSFORMATION ROI & VELOCITY CALCULATOR
 * ================================================
 * Enterprise single-file React component styled with Tailwind CSS.
 * 
 * Aesthetic:
 * - Near-black enterprise background (#0B0F14)
 * - Electric cyan/teal accent (#22D3EE)
 * - Monospace typography for numeric telemetry & financial models
 * - Responsive 2-column layout (inputs left, outputs & SVG telemetry chart right)
 */

export function TransformationCalculator() {
  // 1. Reactive State for all 7 Enterprise Inputs
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyCloudSpend: ASSUMPTIONS.boundaries.monthlyCloudSpend.default,
    teamSize: ASSUMPTIONS.boundaries.teamSize.default,
    deploysPerWeek: ASSUMPTIONS.boundaries.deploysPerWeek.default,
    mttrHours: ASSUMPTIONS.boundaries.mttrHours.default,
    changeFailureRate: ASSUMPTIONS.boundaries.changeFailureRate.default,
    environmentCount: ASSUMPTIONS.boundaries.environmentCount.default,
    complianceRegime: 'SOC2',
  });

  const [copied, setCopied] = useState(false);

  // 2. Pure, Memoized Calculation
  const outputs = useMemo(() => calculateROI(inputs), [inputs]);

  // 3. State update helpers with domain clamping
  const updateField = useCallback(<K extends keyof CalculatorInputs>(
    field: K,
    val: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({
      ...prev,
      [field]: val,
    }));
  }, []);

  // 4. Clipboard summary generator handler
  const handleCopySummary = useCallback(async () => {
    try {
      const summary = generateSummaryText(inputs, outputs);
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      // Fallback for non-secure contexts
      setCopied(false);
    }
  }, [inputs, outputs]);

  const { monthlyCloudSpend, incidentDowntimeHoursMonthly, deployCycleHoursPerDeploy } =
    outputs.comparisonMetrics;

  return (
    <section
      id="transformation-roi-calculator"
      aria-labelledby="calculator-title"
      className="w-full bg-[#0B0F14] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased"
    >
      <div className="max-w-7xl mx-auto">
        {/* ====================================================================
            Header & Narrative
            ==================================================================== */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium tracking-wide uppercase mb-4 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Stackly Architectural Modeling Engine
          </div>

          <h2
            id="calculator-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]"
          >
            Transformation ROI &amp; Velocity Calculator
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Model your projected cloud efficiency savings, time-to-market reduction, and testing velocity with Stackly architectural models.
          </p>
        </div>

        {/* ====================================================================
            Main 2-Column Responsive Layout
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Inputs & Architectural Sliders (5 cols on lg)
              ------------------------------------------------------------------ */}
          <div className="lg:col-span-5 bg-[#0F141C] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Cyan Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white tracking-wide">Infrastructure Parameters</h3>
                <p className="text-xs text-slate-400">Calibrate to your current engineering topology</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setInputs({
                    monthlyCloudSpend: ASSUMPTIONS.boundaries.monthlyCloudSpend.default,
                    teamSize: ASSUMPTIONS.boundaries.teamSize.default,
                    deploysPerWeek: ASSUMPTIONS.boundaries.deploysPerWeek.default,
                    mttrHours: ASSUMPTIONS.boundaries.mttrHours.default,
                    changeFailureRate: ASSUMPTIONS.boundaries.changeFailureRate.default,
                    environmentCount: ASSUMPTIONS.boundaries.environmentCount.default,
                    complianceRegime: 'SOC2',
                  })
                }
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors py-1 px-2.5 rounded bg-slate-900 border border-slate-800"
              >
                Reset Defaults
              </button>
            </div>

            <div className="space-y-6">
              {/* Input 1: Monthly Cloud Spend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="spend-slider" className="font-medium text-slate-300">
                    Monthly Cloud Spend ($ USD)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      id="spend-number"
                      min={ASSUMPTIONS.boundaries.monthlyCloudSpend.min}
                      max={ASSUMPTIONS.boundaries.monthlyCloudSpend.max}
                      step={ASSUMPTIONS.boundaries.monthlyCloudSpend.step}
                      value={inputs.monthlyCloudSpend}
                      onChange={e => updateField('monthlyCloudSpend', Number(e.target.value))}
                      className="w-28 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct Monthly Cloud Spend input"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  id="spend-slider"
                  min={ASSUMPTIONS.boundaries.monthlyCloudSpend.min}
                  max={ASSUMPTIONS.boundaries.monthlyCloudSpend.max}
                  step={ASSUMPTIONS.boundaries.monthlyCloudSpend.step}
                  value={inputs.monthlyCloudSpend}
                  aria-valuemin={ASSUMPTIONS.boundaries.monthlyCloudSpend.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.monthlyCloudSpend.max}
                  aria-valuenow={inputs.monthlyCloudSpend}
                  aria-valuetext={formatCurrency(inputs.monthlyCloudSpend)}
                  onChange={e => updateField('monthlyCloudSpend', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>$10k/mo</span>
                  <span>$1M/mo</span>
                  <span>$5M/mo</span>
                </div>
              </div>

              {/* Input 2: Engineering Team Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="team-slider" className="font-medium text-slate-300">
                    Engineering Team Size
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="team-number"
                      min={ASSUMPTIONS.boundaries.teamSize.min}
                      max={ASSUMPTIONS.boundaries.teamSize.max}
                      step={ASSUMPTIONS.boundaries.teamSize.step}
                      value={inputs.teamSize}
                      onChange={e => updateField('teamSize', Number(e.target.value))}
                      className="w-20 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct Engineering Team Size input"
                    />
                    <span className="text-xs text-slate-500">eng</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="team-slider"
                  min={ASSUMPTIONS.boundaries.teamSize.min}
                  max={ASSUMPTIONS.boundaries.teamSize.max}
                  step={ASSUMPTIONS.boundaries.teamSize.step}
                  value={inputs.teamSize}
                  aria-valuemin={ASSUMPTIONS.boundaries.teamSize.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.teamSize.max}
                  aria-valuenow={inputs.teamSize}
                  aria-valuetext={`${inputs.teamSize} engineers`}
                  onChange={e => updateField('teamSize', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>5 eng</span>
                  <span>250 eng</span>
                  <span>500 eng</span>
                </div>
              </div>

              {/* Input 3: Deploys Per Week */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="deploys-slider" className="font-medium text-slate-300">
                    Deploy Frequency
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="deploys-number"
                      min={ASSUMPTIONS.boundaries.deploysPerWeek.min}
                      max={ASSUMPTIONS.boundaries.deploysPerWeek.max}
                      step={ASSUMPTIONS.boundaries.deploysPerWeek.step}
                      value={inputs.deploysPerWeek}
                      onChange={e => updateField('deploysPerWeek', Number(e.target.value))}
                      className="w-20 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct Deploys per week input"
                    />
                    <span className="text-xs text-slate-500">/wk</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="deploys-slider"
                  min={ASSUMPTIONS.boundaries.deploysPerWeek.min}
                  max={ASSUMPTIONS.boundaries.deploysPerWeek.max}
                  step={ASSUMPTIONS.boundaries.deploysPerWeek.step}
                  value={inputs.deploysPerWeek}
                  aria-valuemin={ASSUMPTIONS.boundaries.deploysPerWeek.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.deploysPerWeek.max}
                  aria-valuenow={inputs.deploysPerWeek}
                  aria-valuetext={`${inputs.deploysPerWeek} deploys per week`}
                  onChange={e => updateField('deploysPerWeek', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1 /wk</span>
                  <span>100 /wk</span>
                  <span>200 /wk</span>
                </div>
              </div>

              {/* Input 4: MTTR in Hours */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="mttr-slider" className="font-medium text-slate-300">
                    Incident Recovery (MTTR)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="mttr-number"
                      min={ASSUMPTIONS.boundaries.mttrHours.min}
                      max={ASSUMPTIONS.boundaries.mttrHours.max}
                      step={ASSUMPTIONS.boundaries.mttrHours.step}
                      value={inputs.mttrHours}
                      onChange={e => updateField('mttrHours', Number(e.target.value))}
                      className="w-20 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct MTTR hours input"
                    />
                    <span className="text-xs text-slate-500">hrs</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="mttr-slider"
                  min={ASSUMPTIONS.boundaries.mttrHours.min}
                  max={ASSUMPTIONS.boundaries.mttrHours.max}
                  step={ASSUMPTIONS.boundaries.mttrHours.step}
                  value={inputs.mttrHours}
                  aria-valuemin={ASSUMPTIONS.boundaries.mttrHours.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.mttrHours.max}
                  aria-valuenow={inputs.mttrHours}
                  aria-valuetext={`${inputs.mttrHours} hours MTTR`}
                  onChange={e => updateField('mttrHours', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1 hr (Elite)</span>
                  <span>24 hrs</span>
                  <span>72 hrs</span>
                </div>
              </div>

              {/* Input 5: Change Failure Rate % */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="cfr-slider" className="font-medium text-slate-300">
                    Change Failure Rate (%)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="cfr-number"
                      min={ASSUMPTIONS.boundaries.changeFailureRate.min}
                      max={ASSUMPTIONS.boundaries.changeFailureRate.max}
                      step={ASSUMPTIONS.boundaries.changeFailureRate.step}
                      value={inputs.changeFailureRate}
                      onChange={e => updateField('changeFailureRate', Number(e.target.value))}
                      className="w-20 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct Change Failure Rate input"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="cfr-slider"
                  min={ASSUMPTIONS.boundaries.changeFailureRate.min}
                  max={ASSUMPTIONS.boundaries.changeFailureRate.max}
                  step={ASSUMPTIONS.boundaries.changeFailureRate.step}
                  value={inputs.changeFailureRate}
                  aria-valuemin={ASSUMPTIONS.boundaries.changeFailureRate.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.changeFailureRate.max}
                  aria-valuenow={inputs.changeFailureRate}
                  aria-valuetext={`${inputs.changeFailureRate} percent change failure rate`}
                  onChange={e => updateField('changeFailureRate', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1%</span>
                  <span>30%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* Input 6: Environment Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="env-slider" className="font-medium text-slate-300">
                    Number of Environments
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="env-number"
                      min={ASSUMPTIONS.boundaries.environmentCount.min}
                      max={ASSUMPTIONS.boundaries.environmentCount.max}
                      step={ASSUMPTIONS.boundaries.environmentCount.step}
                      value={inputs.environmentCount}
                      onChange={e => updateField('environmentCount', Number(e.target.value))}
                      className="w-20 px-2.5 py-1 bg-[#0B0F14] border border-slate-700/80 rounded-lg text-right font-mono font-semibold text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition"
                      aria-label="Direct Number of Environments input"
                    />
                    <span className="text-xs text-slate-500">envs</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="env-slider"
                  min={ASSUMPTIONS.boundaries.environmentCount.min}
                  max={ASSUMPTIONS.boundaries.environmentCount.max}
                  step={ASSUMPTIONS.boundaries.environmentCount.step}
                  value={inputs.environmentCount}
                  aria-valuemin={ASSUMPTIONS.boundaries.environmentCount.min}
                  aria-valuemax={ASSUMPTIONS.boundaries.environmentCount.max}
                  aria-valuenow={inputs.environmentCount}
                  aria-valuetext={`${inputs.environmentCount} environments`}
                  onChange={e => updateField('environmentCount', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>2 envs</span>
                  <span>20 envs</span>
                  <span>40 envs</span>
                </div>
              </div>

              {/* Input 7: Compliance Regime Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Compliance Framework
                  </label>
                  <span className="text-xs font-mono text-cyan-400">
                    {ASSUMPTIONS.compliance[inputs.complianceRegime].label}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Compliance Regime Selector"
                  className="grid grid-cols-3 sm:grid-cols-5 gap-2"
                >
                  {ASSUMPTIONS.boundaries.complianceRegimes.map(regime => {
                    const isSelected = inputs.complianceRegime === regime;
                    return (
                      <button
                        key={regime}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => updateField('complianceRegime', regime)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-semibold transition-all duration-200 border ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {regime}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: Live Output Cards, SVG Comparison Chart & CTAs (7 cols)
              ------------------------------------------------------------------ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Hero Summary Card: Annual Financial Impact, ROI & Payback */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#0F141C] to-[#0A1017] border border-cyan-500/30 rounded-2xl p-6 sm:p-7 shadow-[0_0_30px_rgba(34,211,238,0.08)] relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/70 border border-cyan-500/30 px-3 py-1 rounded-full">
                  Total Annual Enterprise Value
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Est. Stackly Engagement: <strong className="text-slate-200 font-semibold">{formatCurrency(outputs.estimatedInvestment)}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-6">
                <div>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight flex items-baseline gap-1">
                    {formatCurrency(outputs.totalAnnualFinancialBenefit)}
                    <span className="text-sm font-sans font-normal text-slate-400">/ year</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Combined FinOps Cloud Reductions + Engineering Capacity + Compliance Automation
                  </p>
                </div>

                {/* Hero Badges: ROI Multiple & Payback */}
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/10 border border-cyan-400/40 rounded-xl px-4 py-2.5 text-center min-w-[95px]">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      {outputs.projectedRoiMultiple}x
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Projected ROI
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-center min-w-[95px]">
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      {outputs.paybackPeriodMonths}mo
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Payback
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, outputs.projectedRoiMultiple * 5))}%` }}
                />
              </div>
            </div>

            {/* 2. Headline 4-Card Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Output 1: Annual Cloud Cost Savings */}
              <div className="bg-[#0F141C] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>FinOps Cloud Savings</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    -{(outputs.finOpsSavingsRate * 100).toFixed(0)}% Bill
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  {formatCurrency(outputs.annualCloudCostSavings)}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Kubernetes node bin-packing, Karpenter autoscaling, and spot tier optimization.
                </p>
              </div>

              {/* Output 2: Hours Recovered Per Engineer / Month */}
              <div className="bg-[#0F141C] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Engineering Hours Saved</span>
                  <span className="text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    DORA Elite
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1">
                  {outputs.hoursRecoveredPerEngineerMonth}
                  <span className="text-xs font-sans text-slate-400 font-normal">hrs / eng / mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {formatCompactCurrency(outputs.annualEngineeringCapacityValue)} total capacity recovered annually across {inputs.teamSize} engineers.
                </p>
              </div>

              {/* Output 3: Time-to-Market Reduction */}
              <div className="bg-[#0F141C] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Time-to-Market Reduction</span>
                  <span className="text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    GitOps Velocity
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  {outputs.timeToMarketReductionPercent}%
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Derived from {inputs.environmentCount} environments and automated rollback on change failures.
                </p>
              </div>

              {/* Output 4: Compliance Audit Prep Hours Saved */}
              <div className="bg-[#0F141C] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Compliance Prep Saved</span>
                  <span className="text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {inputs.complianceRegime}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1">
                  {outputs.complianceAuditHoursSavedAnnual}
                  <span className="text-xs font-sans text-slate-400 font-normal">hrs / year</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {inputs.complianceRegime === 'None'
                    ? 'No regulatory regime selected.'
                    : `Continuous automated policy-as-code & evidence gathering for ${inputs.complianceRegime}.`}
                </p>
              </div>

            </div>

            {/* 3. Pure SVG Bar Chart: Current State vs Post-Transformation */}
            <div className="bg-[#0F141C] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Operational Transformation: Current vs. Stackly Model
                  </h4>
                  <p className="text-xs text-slate-400">
                    Direct benchmark comparison across cloud efficiency, outage MTTR, and deploy cycle
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-600 inline-block" />
                    <span className="text-slate-400">Current Legacy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-cyan-400 inline-block shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span className="text-cyan-300 font-medium">Post-Stackly</span>
                  </div>
                </div>
              </div>

              {/* Pure SVG Bar Visualizer */}
              <div className="space-y-4">
                
                {/* Metric 1: Monthly Cloud Spend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{monthlyCloudSpend.title}</span>
                    <span className="text-emerald-400 font-semibold">{monthlyCloudSpend.deltaPercent}%</span>
                  </div>
                  <svg
                    className="w-full h-8 bg-slate-900/60 rounded-lg p-1 border border-slate-800/80"
                    viewBox="0 0 100 16"
                    preserveAspectRatio="none"
                    aria-label="Monthly cloud spend comparison bar"
                  >
                    {/* Current Bar */}
                    <rect x="0" y="2" width="100" height="5" rx="1.5" fill="#475569" />
                    {/* Post-Transformation Bar */}
                    <rect
                      x="0"
                      y="9"
                      width={Math.max(10, Math.round(100 * (1 - outputs.finOpsSavingsRate)))}
                      height="5"
                      rx="1.5"
                      fill="#22D3EE"
                    />
                  </svg>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Current: <strong className="text-slate-200">{monthlyCloudSpend.formattedCurrent}</strong></span>
                    <span>Post-Stackly: <strong className="text-cyan-300">{monthlyCloudSpend.formattedPost}</strong></span>
                  </div>
                </div>

                {/* Metric 2: Monthly Outage Downtime Hours */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{incidentDowntimeHoursMonthly.title}</span>
                    <span className="text-emerald-400 font-semibold">{incidentDowntimeHoursMonthly.deltaPercent}%</span>
                  </div>
                  <svg
                    className="w-full h-8 bg-slate-900/60 rounded-lg p-1 border border-slate-800/80"
                    viewBox="0 0 100 16"
                    preserveAspectRatio="none"
                    aria-label="Incident downtime hours comparison bar"
                  >
                    {/* Current Bar */}
                    <rect x="0" y="2" width="100" height="5" rx="1.5" fill="#475569" />
                    {/* Post-Transformation Bar */}
                    <rect
                      x="0"
                      y="9"
                      width={Math.max(
                        6,
                        incidentDowntimeHoursMonthly.current > 0
                          ? Math.round((incidentDowntimeHoursMonthly.post / incidentDowntimeHoursMonthly.current) * 100)
                          : 15
                      )}
                      height="5"
                      rx="1.5"
                      fill="#22D3EE"
                    />
                  </svg>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Current: <strong className="text-slate-200">{incidentDowntimeHoursMonthly.formattedCurrent}</strong></span>
                    <span>Post-Stackly: <strong className="text-cyan-300">{incidentDowntimeHoursMonthly.formattedPost}</strong></span>
                  </div>
                </div>

                {/* Metric 3: Deploy Cycle Time */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{deployCycleHoursPerDeploy.title}</span>
                    <span className="text-emerald-400 font-semibold">{deployCycleHoursPerDeploy.deltaPercent}%</span>
                  </div>
                  <svg
                    className="w-full h-8 bg-slate-900/60 rounded-lg p-1 border border-slate-800/80"
                    viewBox="0 0 100 16"
                    preserveAspectRatio="none"
                    aria-label="Deployment lead time comparison bar"
                  >
                    {/* Current Bar */}
                    <rect x="0" y="2" width="100" height="5" rx="1.5" fill="#475569" />
                    {/* Post-Transformation Bar (~8.3%) */}
                    <rect x="0" y="9" width="8.3" height="5" rx="1.5" fill="#22D3EE" />
                  </svg>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Current: <strong className="text-slate-200">{deployCycleHoursPerDeploy.formattedCurrent}</strong></span>
                    <span>Post-Stackly: <strong className="text-cyan-300">{deployCycleHoursPerDeploy.formattedPost}</strong></span>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Action Controls Bar: Copy Summary & Book Review */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
                aria-label="Copy summary breakdown to clipboard"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Summary Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Summary as Text</span>
                  </>
                )}
              </button>

              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5"
              >
                <span>Book Architecture Review</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>

            {/* 5. Required Enterprise Disclaimer Line */}
            <p className="text-center sm:text-left text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              Estimates based on Stackly engagement averages; not a binding quote.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}

export default TransformationCalculator;

