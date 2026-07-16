import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import PeriodFilter from "./PeriodFilter";

describe("PeriodFilter", () => {
  it("defaults to Last week and switches the pressed button on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PeriodFilter />);

    expect(screen.getByRole("button", { name: "Last week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Last quarter" }));

    expect(screen.getByRole("button", { name: "Last quarter" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Last week" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
