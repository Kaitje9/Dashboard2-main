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
        className="w-full max-w-3xl rounded-2xl border border-brand-border bg-brand-card p-8 md:p-10 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-accent mb-3">
          Research Study
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-text mb-4">
          Welcome to the Reflection-to-Action Health Experience
        </h1>
        <div className="space-y-3 text-sm text-brand-muted leading-relaxed">
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
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-brand-border pt-5">
          <span className="text-xs text-brand-muted">By continuing, you confirm informed participation.</span>
          <button
            type="button"
            onClick={onContinue}
            className="px-5 py-2.5 rounded-lg bg-brand-accent text-white text-xs font-semibold hover:brightness-95 transition-colors"
          >
            Start Questionnaire
          </button>
        </div>
      </motion.section>
    </div>
  );
}
