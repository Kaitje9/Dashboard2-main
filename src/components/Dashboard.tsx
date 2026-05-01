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
import { EditorialHeader } from "./layout/EditorialHeader";
import { TodayTab } from "./tabs/TodayTab";
import { DailyRecommendation } from "./coach/DailyRecommendation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DashboardProps {
  participantProfile: ParticipantProfile | null;
  onCompleteStudy: () => void;
  onTranscriptChange: (messages: ChatMessage[]) => void;
}

export function Dashboard({ participantProfile, onCompleteStudy, onTranscriptChange }: DashboardProps) {
  const [activeMetricDetail, setActiveMetricDetail] = useState<HealthMetric | null>(null);
  const [activePage, setActivePage] = useState<"today" | "recovery" | "sleep" | "activity">("today");
  const participantName = participantProfile?.firstName?.trim();

  const hrvMetric = MOCK_METRICS.find(metric => metric.id === "hrv");
  const rhrMetric = MOCK_METRICS.find(metric => metric.id === "rhr");

  return (
    <div className="h-[100dvh] overflow-hidden bg-brand-bg text-brand-text font-sans" id="main-dashboard-container">
      <div className="max-w-[1800px] h-full mx-auto px-3 md:px-4 py-4 flex flex-col">
        <header className="mb-0 shrink-0">
          <EditorialHeader name={participantName} />
        </header>

        <Tabs
          value={activePage}
          onValueChange={(value) => setActivePage(value as "today" | "recovery" | "sleep" | "activity")}
          className="flex-1 min-h-0 flex flex-col"
        >
          <div className="mb-4 shrink-0">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_340px] gap-5 flex-1 min-h-0 items-start">
            <main className="space-y-4 min-h-0 overflow-y-auto pr-1">
              <TabsContent value="today" className="space-y-4 mt-0">
                <TodayTab metrics={MOCK_METRICS} />
              </TabsContent>

              <TabsContent value="recovery" className="space-y-4 mt-0">
                <section>
                  <h2>Recovery metrics</h2>
                  <p className="lead">
                    Daily recovery state based on autonomic signals and cardiovascular rest response.
                  </p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hrvMetric && (
                    <MetricCard
                      label={hrvMetric.label}
                      value={hrvMetric.value}
                      unit={hrvMetric.unit}
                      trend={mapTrend(hrvMetric.trend)}
                      delta={signedDelta(hrvMetric)}
                      deltaSuffix={hrvMetric.unit}
                      baseline={buildBaselineText(hrvMetric)}
                      unusual={hrvMetric.unusual}
                      sparklineData={hrvMetric.sparkline}
                      baselineRange={hrvMetric.baselineRange}
                      sentence={hrvMetric.sentence}
                      onClick={() => setActiveMetricDetail(hrvMetric)}
                    />
                  )}
                  {rhrMetric && (
                    <MetricCard
                      label={rhrMetric.label}
                      value={rhrMetric.value}
                      unit={rhrMetric.unit}
                      trend={mapTrend(rhrMetric.trend)}
                      delta={signedDelta(rhrMetric)}
                      deltaSuffix={rhrMetric.unit}
                      baseline={buildBaselineText(rhrMetric)}
                      unusual={rhrMetric.unusual}
                      sparklineData={rhrMetric.sparkline}
                      baselineRange={rhrMetric.baselineRange}
                      sentence={rhrMetric.sentence}
                      onClick={() => setActiveMetricDetail(rhrMetric)}
                    />
                  )}
                </div>
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

            <aside className="space-y-3 h-full min-h-0 flex flex-col">
              {activePage === "today" ? (
                <>
                  <DailyRecommendation />
                  <div className="panel-surface rounded-2xl overflow-hidden flex-1 min-h-0">
                    <AIPanel participantProfile={participantProfile} onTranscriptChange={onTranscriptChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="panel-surface rounded-2xl overflow-hidden max-h-[480px] min-h-[380px]">
                    <AIPanel participantProfile={participantProfile} onTranscriptChange={onTranscriptChange} />
                  </div>
                  <section
                    style={{
                      background: "var(--surface-raised)",
                      border: "var(--border-hairline)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-5)",
                    }}
                  >
                    <h3>This week's pattern</h3>
                    <p className="lead" style={{ marginTop: "var(--space-2)" }}>
                      Your HRV held steady through Wednesday, then dipped after two consecutive late nights.
                      Sleep consistency is your weakest link this week.
                    </p>
                  </section>
                </>
              )}
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

