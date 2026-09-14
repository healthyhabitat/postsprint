import { describe, it, expect } from "vitest";
import {
  PAYMENTS_SOON_MESSAGE,
  safeCheckoutUserMessage,
} from "./checkout-errors";

describe("safeCheckoutUserMessage", () => {
  it("never leaks env names", () => {
    expect(safeCheckoutUserMessage("STRIPE_SECRET_KEY missing")).toBe(
      PAYMENTS_SOON_MESSAGE
    );
    expect(safeCheckoutUserMessage(null, "payments_not_configured")).toBe(
      PAYMENTS_SOON_MESSAGE
    );
  });

  it("passes short safe messages", () => {
    expect(safeCheckoutUserMessage("Could not start checkout. Try again.")).toBe(
      "Could not start checkout. Try again."
    );
  });
});
