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
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 999,
        padding: "4px",
        gap: "4px",
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: "none",
        },
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "999px !important",
          color: "primary.contrastText",
          textTransform: "none",
          fontWeight: 600,
          px: 2,
        },
        "& .MuiToggleButton-root:hover": {
          bgcolor: "rgba(255, 255, 255, 0.1)",
        },
        "& .MuiToggleButton-root.Mui-selected": {
          bgcolor: "background.paper",
          color: "primary.main",
        },
        "& .MuiToggleButton-root.Mui-selected:hover": {
          bgcolor: "background.paper",
        },
      }}
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
