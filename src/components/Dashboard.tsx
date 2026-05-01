/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { MetricCard as LegacyMetricCard } from "./MetricCard";
import { AIPanel } from "./AIPanel";
import { MOCK_METRICS } from "../constants";
import { ChatMessage, HealthMetric, ParticipantProfile } from "../types";
import { Button } from "./ui/button";
import { MetricCard } from "./metrics/MetricCard";
import { TopBar } from "./layout/TopBar";
import { TodayTab } from "./tabs/TodayTab";
import { RecoveryTab } from "./tabs/RecoveryTab";
import { DailyRecommendation } from "./coach/DailyRecommendation";
import { Tabs, TabsContent } from "./ui/tabs";

interface DashboardProps {
  participantProfile: ParticipantProfile | null;
  onCompleteStudy: () => void;
  onTranscriptChange: (messages: ChatMessage[]) => void;
}

export function Dashboard({ participantProfile, onCompleteStudy, onTranscriptChange }: DashboardProps) {
  const [activeMetricDetail, setActiveMetricDetail] = useState<HealthMetric | null>(null);
  const [activePage, setActivePage] = useState<"today" | "recovery" | "sleep" | "activity">("today");
  const participantName = participantProfile?.firstName?.trim();

  return (
    <div className="h-[100dvh] overflow-hidden bg-brand-bg text-brand-text font-sans" id="main-dashboard-container">
      <TopBar name={participantName} activeTab={activePage} onTabChange={setActivePage} />
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "var(--space-5)",
          height: "calc(100vh - 48px - (2 * var(--space-5)))",
        }}
      >

        <Tabs
          value={activePage}
          onValueChange={(value) => setActivePage(value as "today" | "recovery" | "sleep" | "activity")}
          className="h-full min-h-0"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 280px",
              gap: "var(--space-4)",
              height: "100%",
              minHeight: 0,
              alignItems: "start",
            }}
          >
            <main className="space-y-4 min-h-0 overflow-y-auto">
              <TabsContent value="today" className="space-y-4 mt-0">
                <TodayTab metrics={MOCK_METRICS} />
              </TabsContent>

              <TabsContent value="recovery" className="space-y-4 mt-0">
                <RecoveryTab metrics={MOCK_METRICS} />
              </TabsContent>

              <TabsContent value="sleep" className="space-y-4">
                <SectionTitle title="Sleep metrics" subtitle="Sleep quality, architecture, and restorative consistency" />
                <MetricGrid metrics={MOCK_METRICS.filter((metric) => metric.category === "sleep")} onOpenDetails={setActiveMetricDetail} />
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <SectionTitle title="Activity metrics" subtitle="Daily load, capacity, and energy output" />
                <MetricGrid metrics={MOCK_METRICS.filter((metric) => metric.category === "activity")} onOpenDetails={setActiveMetricDetail} />
              </TabsContent>
            </main>

            <aside className="panel-surface rounded-2xl overflow-hidden h-full min-h-0 flex flex-col">
              <DailyRecommendation />
              <div className="min-h-0 flex-1">
                <AIPanel
                  participantProfile={participantProfile}
                  activeTab={activePage}
                  onTranscriptChange={onTranscriptChange}
                />
              </div>
            </aside>
          </div>
        </Tabs>
      </div>

      {activeMetricDetail && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] p-4 lg:p-10 flex items-end lg:items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl panel-surface rounded-2xl p-6 relative"
          >
            <Button
              type="button"
              onClick={() => setActiveMetricDetail(null)}
              variant="ghost"
              size="icon"
              className="absolute top-5 right-5"
            >
              <X className="w-4 h-4" />
            </Button>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted font-black mb-3">Metric Deep Dive</p>
            <h3 className="text-2xl font-light text-brand-text mb-2">{activeMetricDetail.label}</h3>
            <p className="text-sm text-brand-muted mb-6">{activeMetricDetail.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-[#333842] border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Trend Signal</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.trendNote ?? activeMetricDetail.insight}</p>
              </div>
              <div className="bg-[#333842] border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Goal Impact</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.goalImpact ?? "Supports your readiness and consistency targets."}</p>
              </div>
            </div>
            <div className="bg-[#333842] border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-3">Built From</p>
              <div className="flex flex-wrap gap-2">
                {(activeMetricDetail.composition ?? ["Daily sensor inputs", "Historical baseline", "Trend analysis"]).map(part => (
                  <span
                    key={part}
                    className="px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.08em] font-semibold bg-[#3b404c] text-[#ddd5c7] border border-brand-border"
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

function MetricGrid({
  metrics,
  onOpenDetails,
}: {
  metrics: HealthMetric[];
  onOpenDetails: (metric: HealthMetric) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {metrics.map((metric) => (
        metric.id === "sleepStages" ? (
          <LegacyMetricCard key={metric.id} metric={metric} onOpenDetails={onOpenDetails} />
        ) : (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            trend={mapTrend(metric.trend)}
            delta={signedDelta(metric)}
            deltaSuffix={metric.unit}
            baseline={buildBaselineText(metric)}
            sparklineData={metric.sparkline}
            baselineRange={metric.baselineRange}
            sentence={metric.sentence}
            unusual={metric.unusual}
            onClick={() => onOpenDetails(metric)}
          />
        )
      ))}
    </div>
  );
}

function signedDelta(metric: HealthMetric) {
  if (metric.trend === "down") return -metric.change;
  if (metric.trend === "stable") return 0;
  return metric.change;
}

function mapTrend(trend: HealthMetric["trend"]): "up" | "down" | "flat" {
  if (trend === "stable") return "flat";
  return trend;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildBaselineText(metric: HealthMetric) {
  if (typeof metric.baselineValue === "number") {
    return `14-day baseline ${metric.baselineValue.toFixed(1)} ${metric.unit}`.trim();
  }
  const series = metric.sparkline ?? [];
  const mean = average(series);
  return `14-day baseline ${mean.toFixed(1)} ${metric.unit}`.trim();
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-1">
      <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-1">{title}</h3>
      <p className="text-sm text-brand-muted">{subtitle}</p>
    </div>
  );
}

