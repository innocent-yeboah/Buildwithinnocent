import { describe, expect, it } from "vitest";
import {
  buildAdminLeadEmailHtml,
  buildAdminLeadEmailText,
  buildCustomerLeadEmailHtml,
  buildCustomerLeadEmailText,
} from "./lead-emails.js";

const baseLead = () => ({
  name: "Ama Doe",
  email: "ama@example.com",
  phone: "+233 530 000 000",
  service_interest: "website",
  message: "Hello there",
  goals: null,
  experience_level: null,
  source: "website",
  form_type: "consultation",
});

describe("lead email HTML", () => {
  it("admin email includes escaped contact fields and brand header", () => {
    const html = buildAdminLeadEmailHtml(baseLead());
    expect(html).toContain("BUILD WITH INNOCENT");
    expect(html).toContain("Ama Doe");
    expect(html).toContain("ama@example.com");
    expect(html).toContain("Modern Website");
    expect(html).toContain("NEW LEAD");
    expect(html).toContain("View in Dashboard");
    expect(html).toContain("Reply on WhatsApp");
    expect(html).not.toContain("<script");
  });

  it("sanitizes attacker-controlled name", () => {
    const malicious = `<img src=x onerror=alert(1)>`;
    const html = buildAdminLeadEmailHtml({
      ...baseLead(),
      name: malicious,
    });
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("registration admin email shows bootcamp copy", () => {
    const html = buildAdminLeadEmailHtml({
      ...baseLead(),
      source: "bootcamp_registration",
      form_type: "registration",
      service_interest: "Coding Bootcamp",
      goals: "Become a backend dev",
      experience_level: "Beginner",
    });
    expect(html).toContain("BOOTCAMP REGISTRATION");
    expect(html).toContain("Beginner");
    expect(html).toContain("Become a backend dev");
  });

  it("customer acknowledgment includes branding and escapes name", () => {
    const html = buildCustomerLeadEmailHtml(baseLead());
    expect(html).toContain("Hello Ama!");
    expect(html).toContain("BUILD WITH INNOCENT");
    expect(html).toContain("within <strong>24 hours</strong>");
    expect(html).toContain("Chat on WhatsApp");
    expect(html).toContain("buildwithinnocent.com");
  });

  it("customer registration copy differs from consultation", () => {
    const html = buildCustomerLeadEmailHtml({
      ...baseLead(),
      source: "bootcamp_registration",
      form_type: "registration",
      service_interest: "Coding Bootcamp",
      goals: "Learn shipping",
      experience_level: "Some JS",
    });
    expect(html).toContain("Bootcamp");
    expect(html).toContain("Some JS");
    expect(html).toContain("Learn shipping");
  });

  it("plain-text fallbacks include key fields", () => {
    const adminText = buildAdminLeadEmailText(baseLead());
    expect(adminText).toContain("NEW LEAD");
    expect(adminText).toContain("Ama Doe");
    expect(adminText).toContain("internal/leads");

    const customerText = buildCustomerLeadEmailText(baseLead());
    expect(customerText).toContain("Hello Ama!");
    expect(customerText).toContain("24 hours");
    expect(customerText).toContain("wa.me/233530710628");
  });
});
