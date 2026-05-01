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
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
      <div className="max-w-[1380px] mx-auto px-6 py-6">
        <header className="flex items-start justify-between mb-6 border-b border-brand-border pb-5">
          <div>
            <Badge variant="secondary" className="mb-2">Hi {participantName}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">{pageTitle}</h1>
          </div>
          <Button type="button" onClick={onCompleteStudy} variant="outline">Finish</Button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          <main className="space-y-6">
            <Tabs value={activePage} onValueChange={(value) => setActivePage(value as "today" | "fitness" | "biology")}>
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="fitness">Fitness</TabsTrigger>
                <TabsTrigger value="biology">Biology</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-4">
                <SectionTitle title="Daily Snapshot" subtitle="Last sync 09:24" />
                <Card>
                  <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    <RingMeter label="Strain" value={strainPercent} color="#f59e0b" icon={<Zap className="w-4 h-4" />} />
                    <RingMeter label="Recovery" value={recoveryPercent} color="#65d645" icon={<Gauge className="w-4 h-4" />} />
                    <RingMeter label="Sleep" value={sleepPercent} color="#7488ff" icon={<BedDouble className="w-4 h-4" />} />
                  </div>
                  <div className="mt-4 bg-[#0d1526] rounded-lg px-4 py-3 flex items-center justify-between border border-brand-border">
                    <div>
                      <p className="text-xs uppercase text-brand-muted">Readiness</p>
                      <p className="text-sm font-semibold">{snapshotStatus}</p>
                    </div>
                    <p className="text-lg font-semibold">{snapshotAverage}%</p>
                  </div>
                  </CardContent>
                </Card>

                <SectionTitle title="Key Metrics" subtitle="Tap any card for details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard metric={MOCK_METRICS[3]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[1]} onOpenDetails={setActiveMetricDetail} />
                </div>
              </TabsContent>

              <TabsContent value="fitness" className="space-y-4">
                <SectionTitle title="Fitness Trends" subtitle="Load and readiness over time" />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Performance Timeline</CardTitle>
                    <CardDescription>Compare training load and recovery across windows.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Button size="sm" variant={selectedMetric === "strain" ? "default" : "outline"} onClick={() => setSelectedMetric("strain")}>Strain</Button>
                    <Button size="sm" variant={selectedMetric === "recovery" ? "default" : "outline"} onClick={() => setSelectedMetric("recovery")}>Recovery</Button>
                    {[7, 14, 28].map(range => (
                      <Button key={range} size="sm" variant={selectedRange === range ? "secondary" : "ghost"} onClick={() => setSelectedRange(range as 7 | 14 | 28)}>
                        {range === 28 ? "4W" : `${range}D`}
                      </Button>
                    ))}
                  </div>
                  <div className="h-[360px]">
                    <ActivityChart
                      data={chartData}
                      metric={selectedMetric}
                      color={selectedMetric === "recovery" ? "var(--color-brand-accent)" : "#3E92F9"}
                    />
                  </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="biology" className="space-y-4">
                <SectionTitle title="Biology Metrics" subtitle="Recovery physiology and baseline indicators" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard metric={MOCK_METRICS[2]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[4]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[5]} onOpenDetails={setActiveMetricDetail} />
                  <MetricCard metric={MOCK_METRICS[6]} onOpenDetails={setActiveMetricDetail} />
                </div>
              </TabsContent>
            </Tabs>
          </main>

          <aside className="bg-brand-card rounded-xl border border-brand-border overflow-hidden h-[calc(100dvh-120px)] sticky top-6 shadow-sm">
            <AIPanel participantProfile={participantProfile} onTranscriptChange={onTranscriptChange} />
          </aside>
        </div>
      </div>

      {activeMetricDetail && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] p-4 lg:p-10 flex items-end lg:items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-xl p-6 relative shadow-xl"
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
              <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Trend Signal</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.trendNote ?? activeMetricDetail.insight}</p>
              </div>
              <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Goal Impact</p>
                <p className="text-sm text-brand-text">{activeMetricDetail.goalImpact ?? "Supports your readiness and consistency targets."}</p>
              </div>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-3">Built From</p>
              <div className="flex flex-wrap gap-2">
                {(activeMetricDetail.composition ?? ["Daily sensor inputs", "Historical baseline", "Trend analysis"]).map(part => (
                  <span
                    key={part}
                    className="px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.08em] font-semibold bg-slate-100 text-brand-text border border-brand-border"
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

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-1">
      <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-1">{title}</h3>
      <p className="text-sm text-brand-muted">{subtitle}</p>
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
    <div className="rounded-lg border border-brand-border bg-[#0d1526] px-2 py-3 flex flex-col items-center gap-2 shadow-sm">
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
