# Answer Key — what the data is hiding

This is the "story map" for `health_30d.csv`. Use it to verify your dashboard surfaces the right patterns. **Do not show this to participants** — discovering these is the point.

The persona: a 32-year-old active professional with a desk job. Baseline HRV around 48 ms, RHR around 58 bpm, typical sleep 7-7.5h, typical day 7-9k steps with two workouts per week.

## The story arc, week by week

### Week 1 (Apr 1-7) — Baseline
A normal, stable week. This is what "in range" looks like for this person. Two moderate workouts (Tuesday and Thursday). Bedtime around 23:00. Sleep consistency in the high 80s. HRV hovers around 46-48.

**What to find here:** nothing dramatic. This week exists as the reference point against which everything else stands out.

### Week 2 (Apr 8-14) — Creeping sleep debt
This is the **subtle pattern** — the reward for actually paying attention.

Bedtime drifts later each weekday: from 23:00 → 23:30 → 0:00 → 0:30 → ~1:00 by Friday. Sleep drops from 7.5h to ~5.5h. Sleep consistency falls into the 50s-60s. HRV trends downward (~3-5 ms below baseline). Stress score climbs. Steps and activity stay roughly normal — *the body is compensating but losing reserves*.

A mini-recovery on Saturday (8.7h sleep, HRV bumps up). Then Sunday late again.

**What to find here:** HRV trending down + sleep trending down + stress trending up, all simultaneously. None of these are alarming individually. The insight is in seeing them together.

### Apr 15-16 — Prodrome
Tuesday and Wednesday have unusually high stress (0.65-0.80). Sleep stays short. By Wednesday evening, the body is showing the first hints — slightly elevated breathing rate, HRV continues to fall. Most people miss this in real life.

### Apr 17 (Fri) — ACUTE ILLNESS 🚨
The **obvious anomaly**. Four signals fire simultaneously:

| Metric | Normal | Apr 17 | Change |
|---|---|---|---|
| HRV | ~48 ms | 23.6 ms | -50% |
| RHR | ~58 bpm | 71.6 bpm | +13 bpm |
| Skin temp delta | ~0°C | +0.68°C | fever |
| SpO2 min | ~95% | 92.0% | -3 pp |
| Breathing rate | ~14.5 rpm | 18.0 rpm | +24% |
| Steps | ~8500 | 934 | crashed |

This is what an acute viral illness looks like in tracker data. Easy to spot — the trick for the participant is connecting it to the prior week.

**The deeper lesson:** the illness wasn't random. The week of sleep debt and rising stress preceded it by days. Immune systems pay the price for chronic under-recovery.

### Apr 18-21 — Recovery
Saturday-Sunday: long sleeps (8+ hours), HRV slowly returning. By Sunday HRV is back around 42-44. Still not full baseline.

### Apr 22 (Mon) — Comeback too soon
Person feels better, jumps back into a full workout (high-intensity training). The data on Apr 23 punishes them: HRV drops sharply again, RHR ticks back up, stress rises.

**What to find here:** even when subjective feeling returns, recovery isn't complete. The body keeps the score.

### Apr 23 — Paying for the comeback
Lower HRV, slightly worse sleep. Body is asking for more rest.

### Apr 24 (Wed) — The hike day 🥾
**The legitimate outlier.** 23,000+ steps. 346 active minutes total. This is what a real long-distance walk looks like. Not erroneous — exceptional.

### Apr 25-26 — Post-hike fatigue
Long sleep needed. HRV slightly suppressed. Normal response to extreme exertion.

### Apr 27-30 — Stabilization
Returning to baseline. Two workouts. Sleep back in 7-7.5h range. By the end of the month, HRV is back near 48.

## Detective questions your dashboard should help answer

If your dashboard is doing its job, a thoughtful user should be able to discover:

1. **"Why did I get sick on April 17?"** → Trace back to week 2 sleep debt
2. **"Was 23k steps on Apr 24 a real day or a glitch?"** → Cross-reference active minutes, calories, and the next day's HRV. Real.
3. **"Did my comeback workout on Apr 22 work?"** → Look at HRV on Apr 23. No.
4. **"What's my actual baseline HRV?"** → Need to exclude the illness/recovery period. Around 47-49 ms when fully recovered.
5. **"How many days does it take me to recover from illness?"** → ~5-7 days for HRV to return.
6. **"Do I sleep better on weekends?"** → Yes, slightly. Weekend mean ~7.8h vs weekday ~6.8h.

## Built-in "noise" — patterns that are NOT meaningful

To make it realistic, the data also contains things participants might wrongly interpret:

- **Apr 3** has lower HRV (43.6) — not a story, just noise from the previous day's training
- **VO2 max** trends slightly upward through the month — gradual fitness gain, not story-relevant
- **SpO2** has a few low-94 readings outside illness — normal nightly variation
- **Skin temperature delta** has small daily fluctuations — natural

A good dashboard distinguishes signal from noise. A great one helps the user learn to do the same.
