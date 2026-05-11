import { describe, expect, it } from "vitest";
import { buildAdminLeadEmailHtml, buildCustomerLeadEmailHtml } from "./lead-emails.js";

const baseLead = () => ({
  name: "Ama Doe",
  email: "ama@example.com",
  phone: "+233 530 000 000",
  service_interest: "Consultation",
  message: "Hello there",
  goals: null,
  experience_level: null,
  source: "website",
  form_type: "consultation",
});

describe("lead email HTML", () => {
  it("admin email includes escaped contact fields", () => {
    const html = buildAdminLeadEmailHtml(baseLead());
    expect(html).toContain("Ama Doe");
    expect(html).toContain("ama@example.com");
    expect(html).toContain("+233");
    expect(html).toContain("NEW LEAD");
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
    expect(html).toContain("BOOTCAMP");
    expect(html).toContain("Beginner");
    expect(html).toContain("Become a backend dev");
  });

  it("customer acknowledgment includes branding and escapes name", () => {
    const html = buildCustomerLeadEmailHtml(baseLead());
    expect(html).toContain("Hello Ama Doe!");
    expect(html).toContain("Build With Innocent");
    expect(html).toMatch(/Build With Innocent<\/strong>\. Your consultation request is logged/);
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
    expect(html).toContain("Coding Bootcamp");
    expect(html).toContain("Some JS");
    expect(html).toContain("Learn shipping");
  });
});
