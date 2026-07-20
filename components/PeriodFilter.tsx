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
        width: { xs: "100%", sm: "auto" },
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: "none",
          borderRadius: "8px !important",
        },
        "& .MuiToggleButton-root": {
          flex: { xs: 1, sm: "initial" },
          border: "none",
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
          color: "rgba(255, 255, 255, 0.85)",
          textTransform: "none",
          fontWeight: 500,
          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
          padding: { xs: "6px 8px !important", sm: "6px 16px !important" },
          "&:last-of-type": {
            borderRight: "none",
          },
        },
        "& .MuiToggleButton-root:hover": {
          bgcolor: "rgba(255, 255, 255, 0.1)",
        },
        "& .MuiToggleButton-root.Mui-selected": {
          bgcolor: "background.paper",
          color: "text.primary",
          fontWeight: 700,
          boxShadow: 2,
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
