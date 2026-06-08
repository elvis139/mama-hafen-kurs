import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { getDb, getCourseAccessBySessionToken } from "../db";
import { reviews, reviewFollowUps } from "../../drizzle/schema";

const ADMIN_EMAIL = "elvis@darvismedia.de";

async function requireAdmin(sessionToken: string) {
  const access = await getCourseAccessBySessionToken(sessionToken);
  if (!access || access.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Kein Zugriff." });
  }
}

export const reviewRouter = router({
  /**
   * Bewertung einreichen (öffentlich – kein Login nötig)
   */
  submit: publicProcedure
    .input(
      z.object({
        email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
        stars: z.number().int().min(1).max(5),
        childAge: z.string().max(32).optional(),
        beforeText: z.string().max(2000).optional(),
        afterText: z.string().max(2000).optional(),
        helpfulModule: z.string().max(1000).optional(),
        recommendation: z.string().max(2000).optional(),
        missingText: z.string().max(2000).optional(),
        authorName: z.string().max(128).optional(),
        consentGiven: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.consentGiven) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Einwilligung zur Veröffentlichung ist erforderlich." });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Datenbankfehler." });

      await db.insert(reviews).values({
        email: input.email.toLowerCase().trim(),
        stars: input.stars,
        childAge: input.childAge || null,
        beforeText: input.beforeText || null,
        afterText: input.afterText || null,
        helpfulModule: input.helpfulModule || null,
        recommendation: input.recommendation || null,
        missingText: input.missingText || null,
        authorName: input.authorName || null,
        approved: false,
        consentGiven: input.consentGiven,
      });

      return { success: true };
    }),

  /**
   * Freigegebene Bewertungen für die Landingpage abrufen (öffentlich)
   */
  getApproved: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db
      .select({
        id: reviews.id,
        stars: reviews.stars,
        childAge: reviews.childAge,
        beforeText: reviews.beforeText,
        afterText: reviews.afterText,
        helpfulModule: reviews.helpfulModule,
        recommendation: reviews.recommendation,
        authorName: reviews.authorName,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.approved, true))
      .orderBy(desc(reviews.createdAt))
      .limit(20);

    return result;
  }),

  /**
   * Alle Bewertungen für Admin abrufen (inkl. private Felder)
   */
  getAll: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      await requireAdmin(input.sessionToken);
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(reviews)
        .orderBy(desc(reviews.createdAt));
    }),

  /**
   * Bewertung freigeben (Admin)
   */
  approve: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1), id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await requireAdmin(input.sessionToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(reviews).set({ approved: true }).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  /**
   * Bewertung ablehnen (Admin)
   */
  reject: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1), id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await requireAdmin(input.sessionToken);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(reviews).set({ approved: false }).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  /**
   * Anzahl ausstehender Bewertungen (Admin – für Badge im Dashboard)
   */
  getPendingCount: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      await requireAdmin(input.sessionToken);
      const db = await getDb();
      if (!db) return 0;

      const result = await db
        .select({ id: reviews.id })
        .from(reviews)
        .where(eq(reviews.approved, false));

      return result.length;
    }),

  /**
   * Follow-up-Status (Admin): Wie viele E-Mails wurden noch nicht gesendet
   */
  getFollowUpStats: publicProcedure
    .input(z.object({ sessionToken: z.string().min(1) }))
    .query(async ({ input }) => {
      await requireAdmin(input.sessionToken);
      const db = await getDb();
      if (!db) return { total: 0, sent: 0, pending: 0 };

      const all = await db.select().from(reviewFollowUps);
      const sent = all.filter(f => f.followUpSentAt !== null).length;
      return { total: all.length, sent, pending: all.length - sent };
    }),
});
