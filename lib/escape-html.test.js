import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escape-html.js";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`a<b>"c"&'`)).toBe("a&lt;b&gt;&quot;c&quot;&amp;&#039;");
  });

  it("handles null and undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});
