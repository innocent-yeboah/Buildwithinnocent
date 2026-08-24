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
  it("admin inquiry email includes escaped contact fields and inquiry wording", () => {
    const html = buildAdminLeadEmailHtml(baseLead());
    expect(html).toContain("BUILD WITH INNOCENT");
    expect(html).toContain("Ama Doe");
    expect(html).toContain("ama@example.com");
    expect(html).toContain("Modern Website");
    expect(html).toContain("NEW INQUIRY");
    expect(html).toContain("New inquiry from Ama Doe");
    expect(html).toContain("View in Dashboard");
    expect(html).toContain("Reply on WhatsApp");
    expect(html).not.toContain("consultation");
    expect(html).not.toContain("NEW LEAD");
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

  it("customer inquiry email is the short I-voice note", () => {
    const html = buildCustomerLeadEmailHtml(baseLead());
    expect(html).toContain("I have this.");
    expect(html).toContain("one business day");
    expect(html).toContain("— Innocent");
    expect(html).toContain("BUILD WITH INNOCENT");
    expect(html).toContain("buildwithinnocent.com");
    expect(html).not.toContain("consultation");
    expect(html).not.toContain("We have received");
    expect(html).not.toContain("Hello Ama!");
    expect(html).not.toContain("free prototype");
    expect(html).not.toContain("Bootcamp");
    expect(html).not.toContain("within <strong>24 hours</strong>");
  });

  it("customer registration copy differs from inquiry", () => {
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
    expect(adminText).toContain("NEW INQUIRY");
    expect(adminText).toContain("Ama Doe");
    expect(adminText).toContain("internal/leads");
    expect(adminText).not.toContain("NEW LEAD");

    const customerText = buildCustomerLeadEmailText(baseLead());
    expect(customerText).toContain("I have this.");
    expect(customerText).toContain("one business day");
    expect(customerText).toContain("— Innocent");
    expect(customerText).not.toContain("Hello Ama!");
    expect(customerText).not.toContain("consultation");
    expect(customerText).not.toContain("24 hours");
  });
});
