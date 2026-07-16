"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useQueryState, parseAsInteger } from "nuqs";
import { PERIOD_DAYS, PERIOD_LABELS, type PeriodDays } from "@/lib/period";

export function usePeriod() {
  return useQueryState("period", parseAsInteger.withDefault(7));
}

export default function PeriodFilter() {
  const [period, setPeriod] = usePeriod();

  return (
    <ToggleButtonGroup
      value={period}
      exclusive
      size="small"
      onChange={(_, value: PeriodDays | null) => {
        if (value !== null) setPeriod(value);
      }}
      aria-label="Time period"
    >
      {PERIOD_DAYS.map((days) => (
        <ToggleButton key={days} value={days} aria-label={PERIOD_LABELS[days]}>
          {PERIOD_LABELS[days]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
