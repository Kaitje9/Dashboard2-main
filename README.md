# health_30d.csv — data dictionary

30 rows, one per day. Date range: April 1-30, 2026. Daily aggregates designed to look like what a wearable would output after processing.

## Columns

| Column | Type | Description |
|---|---|---|
| `date` | ISO date | YYYY-MM-DD |
| `day_of_week` | string | Monday, Tuesday, etc. |
| `hrv_morning_ms` | float | Heart rate variability on wake, RMSSD in ms |
| `rhr_morning_bpm` | float | Resting heart rate on wake |
| `sleep_total_min` | int | Total sleep duration in minutes |
| `sleep_deep_min` | int | Deep sleep minutes |
| `sleep_rem_min` | int | REM sleep minutes |
| `sleep_light_min` | int | Light sleep minutes |
| `sleep_awake_min` | int | Time awake during sleep window |
| `sleep_bedtime` | HH:MM | Time fell asleep (24h format) |
| `sleep_wake` | HH:MM | Time woke up |
| `sleep_consistency_pct` | float | 0-100, based on bedtime/waketime regularity |
| `breathing_rate_rpm` | float | Avg respiratory rate during sleep, breaths/minute |
| `steps` | int | Total steps for the day |
| `active_min_low` | int | Light activity minutes (walking pace) |
| `active_min_moderate` | int | Moderate activity minutes (brisk/jogging) |
| `active_min_high` | int | High intensity minutes (vigorous/anaerobic) |
| `vo2max` | float | Estimated VO2 max in ml/kg/min |
| `calories_kcal` | int | Total calories burned (BMR + activity) |
| `spo2_mean_pct` | float | Mean SpO2 during sleep |
| `spo2_min_pct` | float | Minimum SpO2 during sleep |
| `skin_temp_delta_c` | float | Skin temperature deviation from personal baseline (°C) |
| `stress_mean` | int | Daily mean stress score, 0-100 |
| `stress_peak` | int | Daily peak stress score, 0-100 |

## Plausible ranges

For sanity-checking dashboard rendering and outlier handling:

- **HRV**: 35-65 ms is normal range. Values below 30 indicate severe stress/illness.
- **RHR**: 50-65 bpm is normal range. Above 70 suggests illness or overtraining.
- **Sleep total**: 5-9.5 hours is plausible. <5h or >10h is unusual.
- **Steps**: 0-25,000 is plausible for an active adult. >30k is rare even for athletes.
- **VO2 max**: 35-55 ml/kg/min for fit non-elite adults.
- **SpO2**: 95-99% is healthy at sea level. <93% during sleep warrants attention.
- **Skin temp delta**: ±0.3°C is normal noise. >+0.5°C suggests fever or hormonal shift.
- **Breathing rate**: 12-18 rpm during sleep is normal. >20 suggests illness or stress.

## Baseline calculation guidance

For "trends vs baseline" charts, use a **rolling 14-day median** rather than a fixed value. Exclude days where `skin_temp_delta_c > 0.4` (likely illness) from baseline calculation — these would otherwise pollute the baseline for weeks.

The personal baseline for this dataset, computed on the healthy days, is approximately:

- HRV baseline: 47 ms (normal range ±6 ms)
- RHR baseline: 58 bpm (normal range ±3 bpm)
- Sleep baseline: 7.2 hours (normal range ±1 hour)
- Stress baseline: 42 (normal range ±10)

## Generation

Generated synthetically with `generate.py`. Reproducible with seed 42. The data encodes a deliberate narrative — see `ANSWER_KEY.md` for what the data is "telling".
