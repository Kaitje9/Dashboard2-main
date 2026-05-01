/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Moon, ShieldCheck, X, Home, BarChart3, HeartPulse, Bot, ChevronDown, Zap, BedDouble, Gauge } from "lucide-react";
import { useMemo, useState } from "react";
import { ReactNode } from "react";
import { MetricCard } from "./MetricCard";
import { ActivityChart } from "./ActivityChart";
import { AIPanel } from "./AIPanel";
import { MOCK_METRICS, MOCK_DAILY_HISTORY } from "../constants";
import { ChatMessage, HealthMetric, ParticipantProfile } from "../types";

interface DashboardProps {
  participantProfile: ParticipantProfile | null;
  onCompleteStudy: () => void;
  onTranscriptChange: (messages: ChatMessage[]) => void;
}

export function Dashboard({ participantProfile, onCompleteStudy, onTranscriptChange }: DashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<"strain" | "recovery">("recovery");
  const [selectedRange, setSelectedRange] = useState<7 | 14 | 28>(14);
  const [chartFocus, setChartFocus] = useState<"full" | "latest7">("full");
  const [activeMetricDetail, setActiveMetricDetail] = useState<HealthMetric | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [activePage, setActivePage] = useState<"today" | "fitness" | "biology">("today");
  const chartData = useMemo(() => {
    const rangeData = MOCK_DAILY_HISTORY.slice(-selectedRange);
    return chartFocus === "latest7" ? rangeData.slice(-7) : rangeData;
  }, [selectedRange, chartFocus]);
  const participantName = participantProfile?.firstName?.trim() || "there";
  const pageTitle = activePage === "today" ? "Today" : activePage === "fitness" ? "Fitness" : "Biology";
  const encouragement = participantProfile
    ? `You reported feeling ${participantProfile.recoveryFeeling.toLowerCase()} today with ${participantProfile.weeklySleepQuality.toLowerCase()} sleep this week. Keep building toward: ${participantProfile.currentGoal}.`
    : "You are building consistency. Small daily wins compound quickly when recovery and sleep stay aligned.";

  return (
    <div className="flex flex-col min-h-[100dvh] lg:h-[100dvh] bg-brand-bg text-brand-text overflow-x-hidden font-sans" id="main-dashboard-container">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-8" id="dashboard-content">
        {/* Header (Refined with Search) */}
        <header className="px-4 md:px-10 py-5 md:py-7 bg-brand-bg/95 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-brand-muted mb-1">Hi {participantName}</span>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl leading-none font-semibold tracking-tight">{pageTitle}</h1>
              <ChevronDown className="w-5 h-5 text-brand-muted mt-1" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="px-4 md:px-10 pb-10 space-y-8 max-w-6xl mx-auto w-full">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-card border border-brand-border rounded-[18px] px-4 py-3 flex items-center justify-between shadow-[0_4px_14px_rgba(16,19,23,0.05)]"
          >
            <p className="text-[12px] text-brand-muted truncate pr-3">{encouragement}</p>
            <button
              type="button"
              onClick={onCompleteStudy}
              className="px-3 py-1.5 rounded-full border border-brand-border text-[10px] uppercase tracking-[0.12em] font-semibold text-brand-muted shrink-0"
            >
              Finish
            </button>
          </motion.section>

          {activePage === "today" && (
            <div className="space-y-8">
              <SectionTitle title="Daily Snapshot" subtitle="Last sync 09:24" />
              <div className="bg-brand-card border border-brand-border rounded-[24px] p-5 shadow-[0_6px_18px_rgba(16,19,23,0.06)]">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <RingMeter
                    label="Belasting"
                    value={Number(MOCK_METRICS[1].value)}
                    max={21}
                    color="#f59e0b"
                    icon={<Zap className="w-3.5 h-3.5" />}
                  />
                  <RingMeter
                    label="Herstel"
                    value={Number(MOCK_METRICS[0].value)}
                    max={100}
                    color="#65d645"
                    suffix="%"
                    icon={<Gauge className="w-3.5 h-3.5" />}
                  />
                  <RingMeter
                    label="Slaap"
                    value={Number(MOCK_METRICS[3].value)}
                    max={10}
                    color="#7488ff"
                    icon={<BedDouble className="w-3.5 h-3.5" />}
                  />
                </div>
              </div>

              <SectionTitle title="Coaching Highlights" subtitle="Context and interpretation" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-brand-card rounded-[28px] p-6 border border-brand-border flex flex-col justify-between group relative overflow-hidden shadow-[0_6px_18px_rgba(16,19,23,0.06)]"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div>
                        <p className="text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] mb-4">Neural Recovery Plan</p>
                        <p className="text-xl leading-snug font-light text-brand-text/90">Your parasympathetic tone is high. Primed for deep technical skill acquisition today.</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-brand-accent" />
                            </div>
                            <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest">Optimized Load</span>
                        </div>
                        <span className="text-2xl font-light text-brand-accent">75.5%</span>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-brand-card rounded-[28px] p-6 border border-brand-border flex flex-col justify-between group relative overflow-hidden shadow-[0_6px_18px_rgba(16,19,23,0.06)]"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3E92F9]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div>
                        <p className="text-[10px] text-[#3E92F9] font-black uppercase tracking-[0.2em] mb-4">Sleep Architecture</p>
                        <p className="text-xl leading-snug font-light text-brand-text/90">Fragmented REM cycle detected at 3:15AM. Core temperature might be too high.</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center">
                                <Moon className="w-4 h-4 text-[#3E92F9]" />
                            </div>
                            <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest">Sleep Sync</span>
                        </div>
                        <span className="text-2xl font-light text-[#3E92F9]">23 <span className="text-xs uppercase font-black tracking-widest">ms</span></span>
                    </div>
                </motion.div>
              </div>

              <SectionTitle title="Key Metrics" subtitle="Tap any card for deeper explanation" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard metric={MOCK_METRICS[0]} onOpenDetails={setActiveMetricDetail} />
                <MetricCard metric={MOCK_METRICS[3]} onOpenDetails={setActiveMetricDetail} />
                <MetricCard metric={MOCK_METRICS[1]} onOpenDetails={setActiveMetricDetail} />
              </div>
            </div>
          )}

          {activePage === "fitness" && (
            <div className="space-y-8">
              <SectionTitle title="Fitness Trends" subtitle="Load and readiness over time" />
              {/* Trends & Insights Column */}
              <motion.section 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-card border border-brand-border rounded-[30px] p-6 md:p-8 flex flex-col h-[430px] shadow-[0_6px_18px_rgba(16,19,23,0.06)]"
              >
                <div className="flex justify-between items-end mb-10 gap-4">
                    <div>
                        <span className="text-[10px] uppercase font-black text-brand-muted tracking-[0.2em] mb-2 block">System Analytics</span>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1 tracking-tight text-brand-text">Monitoring over time</h2>
                        <p className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.1em] mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> Live synchronization: Active
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
                          <button
                            onClick={() => setSelectedMetric("strain")}
                            className={`px-4 py-2 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
                              selectedMetric === "strain"
                                ? "bg-brand-accent text-black shadow-lg"
                                : "text-brand-muted hover:text-brand-text"
                            }`}
                          >
                            Strain
                          </button>
                          <button
                            onClick={() => setSelectedMetric("recovery")}
                            className={`px-4 py-2 rounded-lg text-[10px] uppercase font-black tracking-widest transition-colors ${
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
                                ? "bg-white/10 text-brand-text"
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

              <SectionTitle title="Load Detail" subtitle="Current load and sleep debt impact" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard metric={MOCK_METRICS[1]} onOpenDetails={setActiveMetricDetail} />
                <MetricCard metric={MOCK_METRICS[6]} onOpenDetails={setActiveMetricDetail} />
              </div>
            </div>
          )}

          {activePage === "biology" && (
            <div className="space-y-6">
              <SectionTitle title="Biology Metrics" subtitle="Recovery physiology and baseline indicators" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <MetricCard metric={MOCK_METRICS[2]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[4]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[5]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[6]} onOpenDetails={setActiveMetricDetail} />
              </div>
            </div>
          )}
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

      {/* Mobile/desktop page tabs */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-brand-card border border-brand-border rounded-full shadow-[0_10px_24px_rgba(16,19,23,0.12)] p-1.5 flex items-center gap-1 w-[min(88vw,420px)]">
        <TabButton
          icon={<Home className="w-4 h-4" />}
          label="Today"
          active={activePage === "today"}
          onClick={() => setActivePage("today")}
        />
        <TabButton
          icon={<BarChart3 className="w-4 h-4" />}
          label="Fitness"
          active={activePage === "fitness"}
          onClick={() => setActivePage("fitness")}
        />
        <TabButton
          icon={<HeartPulse className="w-4 h-4" />}
          label="Biology"
          active={activePage === "biology"}
          onClick={() => setActivePage("biology")}
        />
      </nav>

      <button
        type="button"
        onClick={() => setShowAssistant(prev => !prev)}
        className="fixed bottom-5 right-4 z-[60] w-14 h-14 rounded-full bg-brand-card border border-brand-border text-brand-text shadow-[0_10px_24px_rgba(16,19,23,0.12)] flex items-center justify-center"
        aria-label={showAssistant ? "Close AI panel" : "Open AI panel"}
      >
        {showAssistant ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {showAssistant && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={() => setShowAssistant(false)}
            className="absolute inset-0"
            aria-label="Close AI panel backdrop"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-[390px] bg-white/70 backdrop-blur-xl border-l border-white/50 shadow-[0_10px_24px_rgba(16,19,23,0.2)] z-10">
            <AIPanel
              participantProfile={participantProfile}
              onTranscriptChange={onTranscriptChange}
              onClose={() => setShowAssistant(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
        active ? "bg-brand-bg text-brand-text" : "text-brand-muted hover:text-brand-text"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-1">
      <h3 className="text-[11px] uppercase tracking-[0.24em] font-black text-brand-muted mb-1">{title}</h3>
      <p className="text-[13px] text-brand-muted/90">{subtitle}</p>
    </div>
  );
}

function RingMeter({
  label,
  value,
  max,
  color,
  icon,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: ReactNode;
  suffix?: string;
}) {
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-bg/60 px-2 py-3 sm:px-3 sm:py-4 flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-full grid place-items-center relative"
        style={{
          background: `conic-gradient(${color} ${percentage}%, #e7e9ee ${percentage}% 100%)`,
        }}
      >
        <div className="absolute inset-[7px] rounded-full bg-brand-card" />
        <div className="relative flex flex-col items-center">
          <span className="text-[18px] font-semibold leading-none">{Math.round(value)}{suffix}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-brand-muted">
        {icon}
        <span className="text-[11px] font-semibold">{label}</span>
      </div>
    </div>
  );
}
