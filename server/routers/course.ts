/**
 * Kurs-Router: Magic-Link-Login ohne Stripe-Sperre (Test-Modus)
 *
 * Ablauf:
 * 1. requestAccess(email) → erstellt Magic-Token (15 Min gültig), gibt Token zurück
 *    (Im Test-Modus wird das Token direkt zurückgegeben, da kein E-Mail-Versand konfiguriert)
 * 2. verifyToken(token) → validiert Token, erstellt Session-Token (30 Tage), gibt Session zurück
 * 3. getAccess(sessionToken) → prüft Session, gibt Kurs-Daten zurück
 */

import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  getCourseAccessByEmail,
  getCourseAccessByMagicToken,
  getCourseAccessBySessionToken,
  updateCourseAccessSession,
  upsertCourseAccess,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";

const MAGIC_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 Minuten
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage

export const courseRouter = router({
  /**
   * Zugang anfordern: E-Mail eingeben → Magic-Token erhalten
   * Im Test-Modus: Token wird direkt zurückgegeben (kein E-Mail-Versand)
   */
  requestAccess: publicProcedure
    .input(z.object({ email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben.") }))
    .mutation(async ({ input }) => {
      const { email } = input;
      const normalizedEmail = email.toLowerCase().trim();

      const magicToken = nanoid(48);
      const tokenExpiresAt = new Date(Date.now() + MAGIC_TOKEN_TTL_MS);

      await upsertCourseAccess({
        email: normalizedEmail,
        magicToken,
        tokenExpiresAt,
        isActive: true,
      });

      // Im Test-Modus: Token direkt zurückgeben
      // Später: E-Mail mit Link versenden und nur { success: true } zurückgeben
      return {
        success: true,
        testModeToken: magicToken, // Nur für Test-Modus – später entfernen
        message: "Zugang gewährt. Im Test-Modus wird der Link direkt angezeigt.",
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
});
