/**
 * Tests für den Review-Router
 * Prüft: submit (Consent-Validierung), Admin-Auth (getAll/approve/reject)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

// vi.mock muss vor den Imports stehen und darf keine Top-Level-Variablen referenzieren
vi.mock("./db", () => {
  const mockInsertValues = vi.fn().mockResolvedValue(undefined);
  const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

  const mockOrderBy = vi.fn().mockResolvedValue([]);
  const mockLimit = vi.fn().mockResolvedValue([]);
  const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy, limit: mockLimit });
  const mockFrom = vi.fn().mockReturnValue({ where: mockWhere, orderBy: mockOrderBy });
  const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

  const mockUpdateWhere = vi.fn().mockResolvedValue(undefined);
  const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
  const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });

  return {
    getDb: vi.fn().mockResolvedValue({
      insert: mockInsert,
      select: mockSelect,
      update: mockUpdate,
    }),
    getCourseAccessBySessionToken: vi.fn(),
  };
});

import { getCourseAccessBySessionToken, getDb } from "./db";
import { reviewRouter } from "./routers/review";
import type { TrpcContext } from "./_core/context";

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const caller = reviewRouter.createCaller(makeCtx());

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────

function mockAdminSession() {
  (getCourseAccessBySessionToken as ReturnType<typeof vi.fn>).mockResolvedValue({
    email: "elvis@darvismedia.de",
    isActive: true,
  });
}

function mockNonAdminSession() {
  (getCourseAccessBySessionToken as ReturnType<typeof vi.fn>).mockResolvedValue({
    email: "other@example.com",
    isActive: true,
  });
}

function mockNoSession() {
  (getCourseAccessBySessionToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("review.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wirft einen Fehler wenn consentGiven=false", async () => {
    await expect(
      caller.submit({
        email: "mama@example.de",
        stars: 5,
        consentGiven: false,
      })
    ).rejects.toThrow(TRPCError);
  });

  it("speichert eine Bewertung erfolgreich mit consentGiven=true", async () => {
    const db = await getDb();
    const result = await caller.submit({
      email: "mama@example.de",
      stars: 5,
      childAge: "2 Jahre",
      beforeText: "Täglich Wutanfälle",
      afterText: "Viel ruhiger",
      recommendation: "Ja, auf jeden Fall!",
      consentGiven: true,
    });

    expect(result.success).toBe(true);
    expect(db!.insert).toHaveBeenCalled();
  });

  it("wirft einen Fehler bei ungültiger E-Mail", async () => {
    await expect(
      caller.submit({
        email: "keine-email",
        stars: 5,
        consentGiven: true,
      })
    ).rejects.toThrow();
  });

  it("wirft einen Fehler bei Sternebewertung ausserhalb 1-5", async () => {
    await expect(
      caller.submit({
        email: "mama@example.de",
        stars: 0,
        consentGiven: true,
      })
    ).rejects.toThrow();

    await expect(
      caller.submit({
        email: "mama@example.de",
        stars: 6,
        consentGiven: true,
      })
    ).rejects.toThrow();
  });
});

describe("review.getAll (Admin-Auth)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("erlaubt Zugriff für Admin", async () => {
    mockAdminSession();
    const db = await getDb();
    // Simulate DB returning empty array
    (db!.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    });

    const result = await caller.getAll({ sessionToken: "admin-token" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("wirft FORBIDDEN für Nicht-Admin", async () => {
    mockNonAdminSession();

    await expect(
      caller.getAll({ sessionToken: "non-admin-token" })
    ).rejects.toThrow(TRPCError);
  });

  it("wirft FORBIDDEN wenn kein Session-Token gefunden", async () => {
    mockNoSession();

    await expect(
      caller.getAll({ sessionToken: "invalid-token" })
    ).rejects.toThrow(TRPCError);
  });
});

describe("review.approve (Admin-Auth)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gibt Bewertung frei für Admin", async () => {
    mockAdminSession();
    const result = await caller.approve({ sessionToken: "admin-token", id: 1 });
    expect(result.success).toBe(true);
  });

  it("wirft FORBIDDEN für Nicht-Admin", async () => {
    mockNonAdminSession();
    await expect(
      caller.approve({ sessionToken: "non-admin-token", id: 1 })
    ).rejects.toThrow(TRPCError);
  });
});

describe("review.reject (Admin-Auth)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zieht Freigabe zurück für Admin", async () => {
    mockAdminSession();
    const result = await caller.reject({ sessionToken: "admin-token", id: 1 });
    expect(result.success).toBe(true);
  });

  it("wirft FORBIDDEN für Nicht-Admin", async () => {
    mockNonAdminSession();
    await expect(
      caller.reject({ sessionToken: "non-admin-token", id: 1 })
    ).rejects.toThrow(TRPCError);
  });
});
