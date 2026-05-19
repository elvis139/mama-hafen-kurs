/**
 * Kurs-Router: Magic-Link-Login + Video-Tracking + Admin-Stats
 */

import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  getAdminStats,
  getAllCommunityQuestions,
  getAllCourseAccess,
  getCourseAccessByEmail,
  getCourseAccessByMagicToken,
  getCourseAccessBySessionToken,
  grantManualAccess,
  insertCommunityQuestion,
  insertVideoEvent,
  toggleCourseAccess,
  updateCourseAccessSession,
  upsertCourseAccess,
} from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";

const MAGIC_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 Minuten
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage

// Admin-E-Mail (Owner)
const ADMIN_EMAIL = "elvis@darvismedia.de";

export const courseRouter = router({
  /**
   * Zugang anfordern: E-Mail eingeben → Magic-Token erhalten
   * Nur für Käufer (isActive=true) oder Admin
   */
  requestAccess: publicProcedure
    .input(z.object({ email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben.") }))
    .mutation(async ({ input }) => {
      const { email } = input;
      const normalizedEmail = email.toLowerCase().trim();

      // Admin bekommt immer Zugang
      const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

      if (!isAdmin) {
        // Prüfen ob Käufer
        const { getCourseAccessByEmail } = await import("../db");
        const existing = await getCourseAccessByEmail(normalizedEmail);
        if (!existing || !existing.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Diese E-Mail-Adresse hat keinen Kurszugang. Bitte kaufe den Kurs zuerst.",
          });
        }
      }

      const magicToken = nanoid(48);
      const tokenExpiresAt = new Date(Date.now() + MAGIC_TOKEN_TTL_MS);

      await upsertCourseAccess({
        email: normalizedEmail,
        magicToken,
        tokenExpiresAt,
        isActive: true,
      });

      return {
        success: true,
        testModeToken: magicToken,
        message: "Zugang gewährt.",
      };
    }),

  /**
   * Token verifizieren: Magic-Token → Session-Token
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const access = await getCourseAccessByMagicToken(input.token);

      if (!access) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ungültiger oder abgelaufener Link. Bitte fordere einen neuen an.",
        });
      }

      if (!access.tokenExpiresAt || access.tokenExpiresAt < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Dieser Link ist abgelaufen. Bitte fordere einen neuen an.",
        });
      }

      if (!access.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Dein Zugang ist deaktiviert. Bitte kontaktiere uns.",
        });
      }

      // Session-Token erstellen
      const sessionToken = nanoid(64);
      const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await updateCourseAccessSession(access.email, sessionToken, sessionExpiresAt);

      return {
        success: true,
        sessionToken,
        email: access.email,
      };
    }),

  /**
   * Kurs-Zugang prüfen: Session-Token → Kurs-Daten
   */
  getAccess: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);

      if (!access) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Bitte melde dich an, um auf den Kurs zuzugreifen.",
        });
      }

      if (!access.sessionExpiresAt || access.sessionExpiresAt < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
        });
      }

      if (!access.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Dein Zugang ist deaktiviert.",
        });
      }

      return {
        email: access.email,
        grantedAt: access.grantedAt,
        hasAccess: true,
      };
    }),

  /**
   * Video-Event tracken: Start, Replay, Complete
   */
  trackVideoEvent: publicProcedure
    .input(z.object({
      sessionToken: z.string().min(1),
      videoId: z.string().min(1),
      videoTitle: z.string().min(1),
      eventType: z.enum(["start", "replay", "complete"]),
    }))
    .mutation(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access || !access.isActive) return { success: false };

      await insertVideoEvent({
        email: access.email,
        videoId: input.videoId,
        videoTitle: input.videoTitle,
        eventType: input.eventType,
      });

      return { success: true };
    }),

  /**
   * Einzelne E-Mail manuell anlegen (Admin)
   */
  addSingleAccess: publicProcedure
    .input(z.object({
      sessionToken: z.string().min(1),
      email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
    }))
    .mutation(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access || access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }
      const email = await grantManualAccess(input.email);
      return { success: true, email };
    }),

  /**
   * Mehrere E-Mails per CSV-Import anlegen (Admin)
   */
  addBulkAccess: publicProcedure
    .input(z.object({
      sessionToken: z.string().min(1),
      emails: z.array(z.string().email()).min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access || access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }
      const results: { email: string; status: "added" | "error"; error?: string }[] = [];
      for (const email of input.emails) {
        try {
          await grantManualAccess(email);
          results.push({ email, status: "added" });
        } catch (err) {
          results.push({ email, status: "error", error: String(err) });
        }
      }
      const added = results.filter(r => r.status === "added").length;
      const errors = results.filter(r => r.status === "error").length;
      return { success: true, added, errors, results };
    }),

  /**
   * Zugang deaktivieren oder reaktivieren (Admin)
   */
  toggleAccess: publicProcedure
    .input(z.object({
      sessionToken: z.string().min(1),
      email: z.string().email(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access || access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }
      await toggleCourseAccess(input.email, input.isActive);
      return { success: true };
    }),

  /**
   * Alle Zugänge abrufen (Admin) – inkl. deaktivierter
   */
  getAllAccess: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access || access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }
      const all = await getAllCourseAccess();
      return all;
    }),

  /**
   * Admin-Stats: Käuferliste, Video-Stats, Traffic-Quellen
   * Nur für Admin (elvis@darvismedia.de) – via Kurs-Session-Token
   */
  getAdminStats: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      // Session prüfen
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Bitte einloggen." });
      }
      // Nur Admin-E-Mail darf Stats sehen
      if (access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }

      const stats = await getAdminStats();
      return stats;
    }),

  /**
   * Community-Frage einreichen
   * Öffentlich – Session-Token wird manuell validiert
   */
  submitQuestion: publicProcedure
    .input(
      z.object({
        sessionToken: z.string().min(1),
        question: z.string().min(10, "Bitte schreibe mindestens 10 Zeichen."),
      })
    )
    .mutation(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Bitte einloggen." });
      }
      // In DB speichern
      await insertCommunityQuestion({
        userEmail: access.email,
        userName: access.email,
        question: input.question,
      });
      // E-Mail-Benachrichtigung an info@darvismedia.de
      try {
        const { sendEmail } = await import("../email");
        await sendEmail({
          to: "info@darvismedia.de",
          subject: "Frage von Mama-Hafen",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f5f0;">
              <h2 style="color: #2d7a7a;">⚓ Neue Frage von Mama-Hafen</h2>
              <p style="color: #555;"><strong>Von:</strong> ${access.email}</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
              <div style="background: white; border-radius: 8px; padding: 20px; border-left: 4px solid #e8734a;">
                <p style="color: #333; line-height: 1.7; white-space: pre-wrap;">${input.question}</p>
              </div>
              <p style="color: #999; font-size: 0.85rem; margin-top: 16px;">Eingegangen am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} Uhr</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[submitQuestion] E-Mail-Versand fehlgeschlagen:", err);
      }
      return { success: true };
    }),

  /**
   * Alle Community-Fragen abrufen (nur Admin)
   */
  getQuestions: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      const access = await getCourseAccessBySessionToken(input.sessionToken);
      if (!access) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Bitte einloggen." });
      }
      if (access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
      }
      const questions = await getAllCommunityQuestions();
      return questions;
    }),
});
