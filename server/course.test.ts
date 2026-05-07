/**
 * Tests für den Kurs-Router (course.ts)
 * Testet: requestAccess, verifyToken, getAccess
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// Datenbank-Mocks
vi.mock("./db", () => ({
  getCourseAccessByEmail: vi.fn(),
  getCourseAccessByMagicToken: vi.fn(),
  getCourseAccessBySessionToken: vi.fn(),
  upsertCourseAccess: vi.fn(),
  updateCourseAccessSession: vi.fn(),
}));

import * as db from "./db";
import { courseRouter } from "./routers/course";
import { TRPCError } from "@trpc/server";

// Hilfsfunktion: Caller ohne Auth-Kontext erstellen
function createCaller() {
  return courseRouter.createCaller({} as any);
}

describe("course.requestAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.upsertCourseAccess).mockResolvedValue(undefined);
  });

  it("gibt ein testModeToken zurück bei gültiger E-Mail", async () => {
    const caller = createCaller();
    const result = await caller.requestAccess({ email: "test@example.com" });

    expect(result.success).toBe(true);
    expect(result.testModeToken).toBeDefined();
    expect(typeof result.testModeToken).toBe("string");
    expect(result.testModeToken!.length).toBeGreaterThan(10);
  });

  it("normalisiert die E-Mail-Adresse (Kleinbuchstaben)", async () => {
    const caller = createCaller();
    await caller.requestAccess({ email: "TEST@EXAMPLE.COM" });

    expect(db.upsertCourseAccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com" })
    );
  });

  it("wirft einen Fehler bei ungültiger E-Mail", async () => {
    const caller = createCaller();
    await expect(
      caller.requestAccess({ email: "keine-email" })
    ).rejects.toThrow();
  });
});

describe("course.verifyToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("erstellt eine Session bei gültigem Token", async () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    vi.mocked(db.getCourseAccessByMagicToken).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      magicToken: "valid-token",
      tokenExpiresAt: futureDate,
      sessionToken: null,
      sessionExpiresAt: null,
      grantedAt: new Date(),
      isActive: true,
    });
    vi.mocked(db.updateCourseAccessSession).mockResolvedValue(undefined);

    const caller = createCaller();
    const result = await caller.verifyToken({ token: "valid-token" });

    expect(result.success).toBe(true);
    expect(result.sessionToken).toBeDefined();
    expect(result.email).toBe("test@example.com");
  });

  it("wirft NOT_FOUND bei unbekanntem Token", async () => {
    vi.mocked(db.getCourseAccessByMagicToken).mockResolvedValue(undefined);

    const caller = createCaller();
    await expect(
      caller.verifyToken({ token: "unknown-token" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("wirft UNAUTHORIZED bei abgelaufenem Token", async () => {
    const pastDate = new Date(Date.now() - 1000);
    vi.mocked(db.getCourseAccessByMagicToken).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      magicToken: "expired-token",
      tokenExpiresAt: pastDate,
      sessionToken: null,
      sessionExpiresAt: null,
      grantedAt: new Date(),
      isActive: true,
    });

    const caller = createCaller();
    await expect(
      caller.verifyToken({ token: "expired-token" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("wirft FORBIDDEN bei deaktiviertem Zugang", async () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    vi.mocked(db.getCourseAccessByMagicToken).mockResolvedValue({
      id: 1,
      email: "blocked@example.com",
      magicToken: "valid-token",
      tokenExpiresAt: futureDate,
      sessionToken: null,
      sessionExpiresAt: null,
      grantedAt: new Date(),
      isActive: false,
    });

    const caller = createCaller();
    await expect(
      caller.verifyToken({ token: "valid-token" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("course.getAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gibt Zugangsdaten zurück bei gültiger Session", async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    vi.mocked(db.getCourseAccessBySessionToken).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      magicToken: null,
      tokenExpiresAt: null,
      sessionToken: "valid-session",
      sessionExpiresAt: futureDate,
      grantedAt: new Date(),
      isActive: true,
    });

    const caller = createCaller();
    const result = await caller.getAccess({ sessionToken: "valid-session" });

    expect(result.hasAccess).toBe(true);
    expect(result.email).toBe("test@example.com");
  });

  it("wirft UNAUTHORIZED bei unbekannter Session", async () => {
    vi.mocked(db.getCourseAccessBySessionToken).mockResolvedValue(undefined);

    const caller = createCaller();
    await expect(
      caller.getAccess({ sessionToken: "unknown-session" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("wirft UNAUTHORIZED bei abgelaufener Session", async () => {
    const pastDate = new Date(Date.now() - 1000);
    vi.mocked(db.getCourseAccessBySessionToken).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      magicToken: null,
      tokenExpiresAt: null,
      sessionToken: "expired-session",
      sessionExpiresAt: pastDate,
      grantedAt: new Date(),
      isActive: true,
    });

    const caller = createCaller();
    await expect(
      caller.getAccess({ sessionToken: "expired-session" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
