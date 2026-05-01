import { motion } from "motion/react";

interface WelcomePageProps {
  onContinue: () => void;
}

export function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text flex items-center justify-center px-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl rounded-[28px] border border-brand-border bg-brand-card p-10 md:p-12"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-accent mb-4">
          Research Study
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-brand-text mb-5">
          Welcome to the Reflection-to-Action Health Experience
        </h1>
        <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
          <p>
            This study explores how AI-supported feedback can help people translate health metrics
            into practical behavior changes.
          </p>
          <p>
            You will complete a short questionnaire, then interact with a personalized dashboard
            and coach. Your responses are used only to tailor feedback during this session.
          </p>
          <p>
            The process takes around 2-4 minutes and focuses on sleep, activity, recovery, and
            training goals.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-4">
          <span className="text-[11px] text-brand-muted">By continuing, you confirm informed participation.</span>
          <button
            type="button"
            onClick={onContinue}
            className="px-6 py-3 rounded-xl bg-brand-accent text-black text-xs uppercase tracking-[0.14em] font-black hover:brightness-105 transition-all"
          >
            Start Questionnaire
          </button>
        </div>
      </motion.section>
    </div>
  );
}
