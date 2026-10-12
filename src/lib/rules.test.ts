import { describe, it, expect } from "vitest";
import { canShowFee, regularAdmissionsListing, normalizeMobile, isValidIndianMobile } from "./rules";
import { whatsappLink } from "./site";

const today = new Date("2026-10-12T12:00:00");
const fee = { amount: 150000, currency: "INR", period: "total" as const, verified: true, valid_until: "2027-03-31" };

describe("fee display", () => {
  it("never shows fees for regular/campus courses, even if verified", () => {
    expect(canShowFee({ mode: "regular", fee }, today)).toBe(false);
  });
  it("shows verified, current online fees", () => {
    expect(canShowFee({ mode: "online", fee }, today)).toBe(true);
  });
  it("hides unverified online fees", () => {
    expect(canShowFee({ mode: "online", fee: { ...fee, verified: false } }, today)).toBe(false);
  });
  it("hides expired online fees", () => {
    expect(canShowFee({ mode: "online", fee: { ...fee, valid_until: "2026-10-11" } }, today)).toBe(false);
  });
});

describe("regular admissions listing", () => {
  it("excludes government institutions", () => {
    const list = [
      { id: 1, is_government: true, ownership: "government" as const, modes: ["regular" as const] },
      { id: 2, is_government: false, ownership: "government" as const, modes: ["regular" as const] },
      { id: 3, is_government: false, ownership: "private" as const, modes: ["regular" as const] },
      { id: 4, is_government: false, ownership: "private" as const, modes: ["online" as const] },
    ];
    expect(regularAdmissionsListing(list).map((i) => i.id)).toEqual([3]);
  });
});

describe("mobile + whatsapp", () => {
  it("normalises +91 numbers", () => {
    expect(normalizeMobile("+91 98765-43210")).toBe("9876543210");
    expect(isValidIndianMobile("12345")).toBe(false);
  });
  it("encodes the WhatsApp message to the official number", () => {
    expect(whatsappLink("Hi & <test>")).toBe("https://wa.me/917471166366?text=Hi%20%26%20%3Ctest%3E");
  });
});
