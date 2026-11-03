import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { scenario } from "../../cskh/model.js";
import { createTicket, updateTicket, visibleTickets } from "../../cskh/operations.js";
import { ticketLinks, ticketView } from "../../cskh/operations-ui.js";
import { overlayView } from "../../cskh/overlays.js";
import { cskhUrl } from "../lib/cskh-navigation";

describe("CSKH request tickets", () => {
  it("links the CRM menu to working web and offline ticket routes", () => {
    expect(cskhUrl("portal", "M-49", "http:")).toBe("/cskh/index.html?frame=M-49");
    expect(cskhUrl("portal", "M-49", "file:")).toBe(
      "./cskh-prototype.html?surface=portal&frame=M-49",
    );
    expect(cskhUrl("review", undefined, "file:")).toBe("./cskh-prototype.html?surface=review");
    expect(cskhUrl("review", undefined, "https:")).toBe("/cskh/review-ai.html");
  });

  it("opens M-49 with all 25 fixtures and a linked detail", () => {
    const state = scenario("M-49");
    expect(state.screen).toBe("tickets");
    expect(visibleTickets(state)).toHaveLength(25);
    state.ticketId = state.tickets[0].id;
    const html = ticketView(state);
    expect(html).toContain("<h1>Phiếu yêu cầu</h1>");
    expect(html).toContain('id="ticket-update-form"');
    expect(html).toContain(state.tickets[0].sourceId);
  });

  it("creates a ticket once, tracks its lifecycle and keeps the source case open", () => {
    const state = scenario("M-46");
    const source = state.cases.find((item) => item.id === state.caseId);
    const status = source.status;
    const count = state.tickets.length;
    const data = {
      requestType: "support",
      priority: "NORMAL",
      unit: "cskh",
      dueAt: new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 16),
      description: "Liên hệ lại để xác nhận thông tin yêu cầu.",
      requestKey: "ticket-regression",
    };
    const ticket = createTicket(state, source, data);
    expect(createTicket(state, source, data).id).toBe(ticket.id);
    expect(state.tickets).toHaveLength(count + 1);
    expect(() => updateTicket(state, ticket.id, "IN_PROGRESS", "")).toThrow();
    updateTicket(state, ticket.id, "IN_PROGRESS", "Đã nhận thụ lý.");
    updateTicket(state, ticket.id, "WAITING", "Chờ đơn vị phản hồi.");
    updateTicket(state, ticket.id, "RESOLVED", "Đã phản hồi khách hàng.");
    expect(ticket.history).toHaveLength(4);
    expect(source.status).toBe(status);
    expect(ticketLinks(state, source)).toContain(ticket.id);
    state.revoked = true;
    expect(visibleTickets(state)).toHaveLength(0);
    expect(() => updateTicket(state, ticket.id, "IN_PROGRESS", "Mở lại.")).toThrow();
  });

  it("uses Phiếu yêu cầu in the creation flow and empty state", () => {
    const state = scenario("M-46");
    const source = state.cases.find((item) => item.id === state.caseId);
    expect(ticketLinks(state, source)).toContain("Tạo phiếu yêu cầu");
    expect(overlayView(state)).toContain("Tạo phiếu yêu cầu");
    state.tickets = [];
    expect(ticketView(state)).toContain("Chưa có phiếu yêu cầu");
    expect(ticketLinks(state, source) + overlayView(state) + ticketView(state)).not.toMatch(
      /phiếu xử lý/i,
    );
  });

  it("serves the same ticket implementation as the source module", () => {
    for (const file of [
      "operations-ui.js",
      "operations-controller.js",
      "operations.js",
      "overlays.js",
      "views.js",
      "model.js",
    ]) {
      expect(readFileSync(resolve("public/cskh", file), "utf8")).toBe(
        readFileSync(resolve("cskh", file), "utf8"),
      );
    }
  });
});
