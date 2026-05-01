import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WelcomePageProps {
  onContinue: () => void;
}

export function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text flex items-center justify-center px-3 md:px-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <Card className="border-brand-border/80 bg-brand-card/95">
          <CardHeader className="space-y-4">
            <Badge variant="secondary" className="w-fit">Research Study</Badge>
            <CardTitle className="font-editorial text-5xl md:text-6xl font-medium tracking-tight leading-[0.95]">
              Reflection-to-Action Health Experience
            </CardTitle>
            <p className="text-base text-brand-muted leading-relaxed max-w-2xl">
              AI-supported feedback designed to turn health signals into concrete decisions. In this
              session you can directly explore a personalized dashboard and AI coach.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoTile title="Duration" value="2-4 min" />
              <InfoTile title="Focus" value="Sleep, Recovery, Load" />
              <InfoTile title="Output" value="Personalized Coaching" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-brand-border pt-5">
              <span className="text-xs text-brand-muted">By continuing, you confirm informed participation.</span>
              <Button onClick={onContinue}>Open Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-brand-border bg-[#333842] px-4 py-3">
      <p className="text-xs text-brand-muted">{title}</p>
      <p className="font-editorial text-xl font-medium text-brand-text mt-1">{value}</p>
    </div>
  );
}
