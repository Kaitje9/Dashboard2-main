/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Activity, Zap, Moon, Heart, Bell, Menu, User, ShieldCheck, Search, History, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ActivityChart } from "./ActivityChart";
import { AIPanel } from "./AIPanel";
import { MOCK_METRICS, MOCK_DAILY_HISTORY } from "../constants";
import { HealthMetric, ParticipantProfile } from "../types";

interface DashboardProps {
  participantProfile: ParticipantProfile | null;
}

export function Dashboard({ participantProfile }: DashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<"strain" | "recovery">("recovery");
  const [selectedRange, setSelectedRange] = useState<7 | 14 | 28>(14);
  const [chartFocus, setChartFocus] = useState<"full" | "latest7">("full");
  const [activeMetricDetail, setActiveMetricDetail] = useState<HealthMetric | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const chartData = useMemo(() => {
    const rangeData = MOCK_DAILY_HISTORY.slice(-selectedRange);
    return chartFocus === "latest7" ? rangeData.slice(-7) : rangeData;
  }, [selectedRange, chartFocus]);
  const participantName = participantProfile?.firstName?.trim() || "there";
  const encouragement = participantProfile
    ? `You reported feeling ${participantProfile.recoveryFeeling.toLowerCase()} today with ${participantProfile.weeklySleepQuality.toLowerCase()} sleep this week. Keep building toward: ${participantProfile.currentGoal}.`
    : "You are building consistency. Small daily wins compound quickly when recovery and sleep stay aligned.";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-brand-bg text-brand-text overflow-hidden font-sans" id="main-dashboard-container">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto" id="dashboard-content">
        {/* Header (Refined with Search) */}
        <header className="px-10 py-8 flex items-center justify-between bg-brand-bg/95 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <Menu className="w-5 h-5 lg:hidden" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-1">Status Report</span>
              <h1 className="text-2xl font-light tracking-tight">Hi {participantName}, your health overview</h1>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-12 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search across biosensors..." 
                className="w-full bg-brand-card border border-brand-border rounded-xl py-3 pl-12 pr-4 text-xs text-brand-text focus:outline-none focus:border-brand-accent/30 transition-all placeholder:text-brand-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-brand-border rounded-xl border border-white/5">
                <button className="p-2 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg transition-all"><History className="w-4 h-4" /></button>
                <button className="p-2 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg transition-all"><Users className="w-4 h-4" /></button>
                <button className="p-2 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg transition-all relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-accent rounded-full border border-brand-bg" />
                </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAssistant(prev => !prev)}
              className={`px-4 py-2 rounded-xl border text-[10px] uppercase tracking-[0.14em] font-black transition-colors ${
                showAssistant
                  ? "border-brand-accent text-brand-accent bg-brand-accent/10"
                  : "border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {showAssistant ? "Hide Coach" : "Show Coach"}
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="px-10 pb-10 space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-card border border-brand-border rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-accent mb-2">Personal Brief</p>
              <p className="text-sm text-brand-text leading-relaxed">{encouragement}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-[10px] uppercase tracking-[0.14em] font-black text-brand-muted">
              Sport Focus: {participantProfile?.primarySports || "General fitness"}
            </div>
          </motion.section>

          {/* Top Performance Row */}
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Primary Analysis Column */}
            <div className="w-full xl:w-[35%] flex flex-col gap-6">
               <div className="h-full flex flex-col">
                 <MetricCard metric={MOCK_METRICS[0]} onOpenDetails={setActiveMetricDetail} /> {/* Recovery Circle */}
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <MetricCard metric={MOCK_METRICS[3]} onOpenDetails={setActiveMetricDetail} /> {/* Sleep */}
                  <MetricCard metric={MOCK_METRICS[1]} onOpenDetails={setActiveMetricDetail} /> {/* Strain */}
               </div>
            </div>

            {/* Trends & Insights Column */}
            <div className="flex-1 flex flex-col gap-8">
                <motion.section 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-brand-card border border-brand-border rounded-[32px] p-10 flex flex-col h-[420px] shadow-2xl"
                >
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-[10px] uppercase font-black text-brand-muted tracking-[0.2em] mb-2 block">System Analytics</span>
                            <h2 className="text-3xl font-extralight mb-1 tracking-tight text-brand-text">Monitoring over time</h2>
                            <p className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.1em] mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> Live synchronization: Active
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
                              <button
                                onClick={() => setSelectedMetric("strain")}
                                className={`px-5 py-2 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                                  selectedMetric === "strain"
                                    ? "bg-brand-accent text-black shadow-lg"
                                    : "text-brand-muted hover:text-brand-text"
                                }`}
                              >
                                Strain
                              </button>
                              <button
                                onClick={() => setSelectedMetric("recovery")}
                                className={`px-5 py-2 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                                  selectedMetric === "recovery"
                                    ? "bg-brand-accent text-black shadow-lg"
                                    : "text-brand-muted hover:text-brand-text"
                                }`}
                              >
                                Recovery
                              </button>
                          </div>
                          <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
                            {[7, 14, 28].map(range => (
                              <button
                                key={range}
                                onClick={() => setSelectedRange(range as 7 | 14 | 28)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                                  selectedRange === range
                                    ? "bg-white/10 text-white"
                                    : "text-brand-muted hover:text-brand-text"
                                }`}
                              >
                                {range === 28 ? "4W" : `${range}D`}
                              </button>
                            ))}
                          </div>
                          <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
                            <button
                              onClick={() => setChartFocus("full")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                                chartFocus === "full" ? "bg-white/10 text-brand-text" : "text-brand-muted hover:text-brand-text"
                              }`}
                            >
                              Trend
                            </button>
                            <button
                              onClick={() => setChartFocus("latest7")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                                chartFocus === "latest7" ? "bg-white/10 text-brand-text" : "text-brand-muted hover:text-brand-text"
                              }`}
                            >
                              Last 7
                            </button>
                          </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ActivityChart
                          data={chartData}
                          metric={selectedMetric}
                          color={selectedMetric === "recovery" ? "var(--color-brand-accent)" : "#3E92F9"}
                        />
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-brand-card rounded-[32px] p-8 border border-brand-border flex flex-col justify-between group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div>
                            <p className="text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] mb-4">Neural Recovery Plan</p>
                            <p className="text-xl leading-snug font-light text-brand-text/90">Your parasympathetic tone is high. Primed for deep technical skill acquisition today.</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A1A1D] border border-white/5 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-brand-accent" />
                                </div>
                                <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest">Optimized Load</span>
                            </div>
                            <span className="text-2xl font-light text-brand-accent">75.5%</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-brand-card rounded-[32px] p-8 border border-brand-border flex flex-col justify-between group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E92F9]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div>
                            <p className="text-[10px] text-[#3E92F9] font-black uppercase tracking-[0.2em] mb-4">Sleep Architecture</p>
                            <p className="text-xl leading-snug font-light text-brand-text/90">Fragmented REM cycle detected at 3:15AM. Core temperature might be too high.</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A1A1D] border border-white/5 flex items-center justify-center">
                                    <Moon className="w-4 h-4 text-[#3E92F9]" />
                                </div>
                                <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest">Sleep Sync</span>
                            </div>
                            <span className="text-2xl font-light text-[#3E92F9]">23 <span className="text-xs uppercase font-black tracking-widest">ms</span></span>
                        </div>
                    </motion.div>
                </div>
            </div>
          </div>

          {/* Tertiary Data Area */}
          <div className="pt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-muted mb-6 px-1">Tertiary Array</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard metric={MOCK_METRICS[2]} onOpenDetails={setActiveMetricDetail} /> {/* HRV */}
                <MetricCard metric={MOCK_METRICS[4]} onOpenDetails={setActiveMetricDetail} /> {/* RHR */}
                <MetricCard metric={MOCK_METRICS[5]} onOpenDetails={setActiveMetricDetail} /> {/* Respiratory */}
                <MetricCard metric={MOCK_METRICS[6]} onOpenDetails={setActiveMetricDetail} /> {/* Sleep Debt */}
            </div>
          </div>
        </div>
      </main>

      {activeMetricDetail && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm p-4 lg:p-10 flex items-end lg:items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-[28px] p-8 relative"
          >
            <button
              type="button"
              onClick={() => setActiveMetricDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted font-black mb-3">Metric Deep Dive</p>
            <h3 className="text-2xl font-light text-brand-text mb-2">{activeMetricDetail.label}</h3>
            <p className="text-sm text-brand-muted mb-6">{activeMetricDetail.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-brand-muted font-black mb-2">Trend Signal</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.trendNote ?? activeMetricDetail.insight}</p>
              </div>
              <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-brand-muted font-black mb-2">Goal Impact</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.goalImpact ?? "Supports your readiness and consistency targets."}</p>
              </div>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-black mb-3">Built From</p>
              <div className="flex flex-wrap gap-2">
                {(activeMetricDetail.composition ?? ["Daily sensor inputs", "Historical baseline", "Trend analysis"]).map(part => (
                  <span
                    key={part}
                    className="px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.08em] font-black bg-brand-border text-brand-text"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      )}

      {/* AI Assistant Sidebar */}
      {showAssistant && (
        <aside className="w-full lg:w-[320px] xl:w-[360px] border-l border-brand-border bg-brand-bg" id="ai-sidebar-container">
          <AIPanel participantProfile={participantProfile} />
        </aside>
      )}

      {!showAssistant && (
        <button
          type="button"
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-brand-accent text-black text-[10px] uppercase tracking-[0.14em] font-black shadow-2xl"
        >
          Open AI Coach
        </button>
      )}
    </div>
  );
}
