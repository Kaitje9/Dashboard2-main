/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { X, Zap, BedDouble, Gauge } from "lucide-react";
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
  const [activeMetricDetail, setActiveMetricDetail] = useState<HealthMetric | null>(null);
  const [activePage, setActivePage] = useState<"today" | "fitness" | "biology">("today");
  const chartData = useMemo(() => {
    return MOCK_DAILY_HISTORY.slice(-selectedRange);
  }, [selectedRange]);
  const participantName = participantProfile?.firstName?.trim() || "there";
  const pageTitle = activePage === "today" ? "Today" : activePage === "fitness" ? "Fitness" : "Biology";
  const strainMetric = MOCK_METRICS.find(metric => metric.id === "strain");
  const recoveryMetric = MOCK_METRICS.find(metric => metric.id === "recovery");
  const sleepMetric = MOCK_METRICS.find(metric => metric.id === "sleep");
  const strainPercent = Math.round((Number(strainMetric?.value ?? 0) / 21) * 100);
  const recoveryPercent = Math.round(Number(recoveryMetric?.value ?? 0));
  const sleepPercent = Math.round((Number(sleepMetric?.value ?? 0) / 10) * 100);
  const snapshotAverage = Math.round((strainPercent + recoveryPercent + sleepPercent) / 3);
  const snapshotStatus = snapshotAverage >= 70 ? "Strong daily readiness" : snapshotAverage >= 50 ? "Moderate readiness" : "Low readiness";

  return (
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text font-sans" id="main-dashboard-container">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <header className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-brand-muted mb-1">Hi {participantName}</p>
            <h1 className="text-4xl font-semibold">{pageTitle}</h1>
          </div>
          <button
            type="button"
            onClick={onCompleteStudy}
            className="px-4 py-2 rounded-lg border border-brand-border text-sm text-brand-muted"
          >
            Finish
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          <main className="space-y-6">
            <div className="flex gap-2">
              <PageButton active={activePage === "today"} onClick={() => setActivePage("today")}>
                Today
              </PageButton>
              <PageButton active={activePage === "fitness"} onClick={() => setActivePage("fitness")}>
                Fitness
              </PageButton>
              <PageButton active={activePage === "biology"} onClick={() => setActivePage("biology")}>
                Biology
              </PageButton>
            </div>

            {activePage === "today" && (
              <section className="space-y-4">
                <SectionTitle title="Daily Snapshot" subtitle="Last sync 09:24" />
                <div className="bg-brand-card rounded-xl p-4 border border-brand-border">
                  <div className="grid grid-cols-3 gap-3">
                    <RingMeter label="Strain" value={strainPercent} color="#f59e0b" icon={<Zap className="w-4 h-4" />} />
                    <RingMeter label="Recovery" value={recoveryPercent} color="#65d645" icon={<Gauge className="w-4 h-4" />} />
                    <RingMeter label="Sleep" value={sleepPercent} color="#7488ff" icon={<BedDouble className="w-4 h-4" />} />
                  </div>
                  <div className="mt-4 bg-brand-bg rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-brand-muted">Readiness</p>
                      <p className="text-sm font-semibold">{snapshotStatus}</p>
                    </div>
                    <p className="text-lg font-semibold">{snapshotAverage}%</p>
                  </div>
                </div>

                <SectionTitle title="Key Metrics" subtitle="Tap any card for details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard metric={MOCK_METRICS[3]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[1]} onOpenDetails={setActiveMetricDetail} />
                </div>
              </section>
            )}

            {activePage === "fitness" && (
              <section className="space-y-4">
                <SectionTitle title="Fitness Trends" subtitle="Load and readiness over time" />
                <div className="bg-brand-card rounded-xl p-5 border border-brand-border">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <PageButton active={selectedMetric === "strain"} onClick={() => setSelectedMetric("strain")}>Strain</PageButton>
                    <PageButton active={selectedMetric === "recovery"} onClick={() => setSelectedMetric("recovery")}>Recovery</PageButton>
                    {[7, 14, 28].map(range => (
                      <PageButton key={range} active={selectedRange === range} onClick={() => setSelectedRange(range as 7 | 14 | 28)}>
                        {range === 28 ? "4W" : `${range}D`}
                      </PageButton>
                    ))}
                  </div>
                  <div className="h-[360px]">
                    <ActivityChart
                      data={chartData}
                      metric={selectedMetric}
                      color={selectedMetric === "recovery" ? "var(--color-brand-accent)" : "#3E92F9"}
                    />
                  </div>
                </div>
              </section>
            )}

            {activePage === "biology" && (
              <section className="space-y-4">
                <SectionTitle title="Biology Metrics" subtitle="Recovery physiology and baseline indicators" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard metric={MOCK_METRICS[2]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[4]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[5]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[6]} onOpenDetails={setActiveMetricDetail} />
                </div>
              </section>
            )}
          </main>

          <aside className="bg-brand-card rounded-xl border border-brand-border overflow-hidden h-[calc(100dvh-120px)] sticky top-6">
            <AIPanel participantProfile={participantProfile} onTranscriptChange={onTranscriptChange} />
          </aside>
        </div>
      </div>

      {activeMetricDetail && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm p-4 lg:p-10 flex items-end lg:items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-xl p-6 relative"
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

    </div>
  );
}

function PageButton({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
        active ? "bg-brand-accent text-black" : "bg-brand-card border border-brand-border text-brand-muted"
      }`}
    >
      {children}
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
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
}) {
  const percentage = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="rounded-lg border border-brand-border bg-brand-bg/60 px-2 py-3 flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-full grid place-items-center relative"
        style={{
          background: `conic-gradient(${color} ${percentage}%, #e7e9ee ${percentage}% 100%)`,
        }}
      >
        <div className="absolute inset-[6px] rounded-full bg-brand-card" />
        <div className="relative flex flex-col items-center">
          <span className="text-sm font-semibold leading-none">{percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-brand-muted">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
    </div>
  );
}
