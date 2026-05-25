import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { checkoutTestLogs, communityQuestions, courseAccess, InsertCheckoutTestLog, InsertCommunityQuestion, InsertCourseAccess, InsertUser, InsertVideoEvent, users, videoEvents } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Kurs-Zugang ────────────────────────────────────────────────────────────────

export async function getCourseAccessByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseAccess).where(eq(courseAccess.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCourseAccessByMagicToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseAccess).where(eq(courseAccess.magicToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCourseAccessBySessionToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseAccess).where(eq(courseAccess.sessionToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCourseAccess(data: InsertCourseAccess) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courseAccess).values(data).onDuplicateKeyUpdate({
    set: {
      magicToken: data.magicToken,
      tokenExpiresAt: data.tokenExpiresAt,
      sessionToken: data.sessionToken,
      sessionExpiresAt: data.sessionExpiresAt,
      isActive: data.isActive,
    },
  });
}

export async function updateCourseAccessSession(email: string, sessionToken: string, sessionExpiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseAccess)
    .set({ sessionToken, sessionExpiresAt, magicToken: null, tokenExpiresAt: null, lastLoginAt: new Date() })
    .where(eq(courseAccess.email, email));
}

// ── Video-Events ────────────────────────────────────────────────────────────────

export async function insertVideoEvent(data: InsertVideoEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(videoEvents).values(data);
}

// ── Manuelle Zugangsverwaltung ────────────────────────────────────────────────

export async function grantManualAccess(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const normalizedEmail = email.toLowerCase().trim();
  await db.insert(courseAccess)
    .values({
      email: normalizedEmail,
      isActive: true,
      grantedAt: new Date(),
      utmSource: "manual",
      utmMedium: "admin",
    })
    .onDuplicateKeyUpdate({
      set: { isActive: true },
    });
  return normalizedEmail;
}

export async function toggleCourseAccess(email: string, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const normalizedEmail = email.toLowerCase().trim();
  await db.update(courseAccess)
    .set({ isActive })
    .where(eq(courseAccess.email, normalizedEmail));
}

export async function getAllCourseAccess() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(courseAccess).orderBy(desc(courseAccess.grantedAt));
}

// ── Admin-Daten ────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Alle Käufer
  const buyers = await db
    .select()
    .from(courseAccess)
    .where(eq(courseAccess.isActive, true))
    .orderBy(desc(courseAccess.grantedAt));

  // Video-Events: Starts pro Video
  const videoStarts = await db
    .select({
      videoId: videoEvents.videoId,
      videoTitle: videoEvents.videoTitle,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(videoEvents)
    .where(eq(videoEvents.eventType, "start"))
    .groupBy(videoEvents.videoId, videoEvents.videoTitle)
    .orderBy(desc(sql`COUNT(*)`));

  // Video-Events: Replays pro Video
  const videoReplays = await db
    .select({
      videoId: videoEvents.videoId,
      videoTitle: videoEvents.videoTitle,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(videoEvents)
    .where(eq(videoEvents.eventType, "replay"))
    .groupBy(videoEvents.videoId, videoEvents.videoTitle)
    .orderBy(desc(sql`COUNT(*)`));

  // Traffic-Quellen
  const trafficSources = await db
    .select({
      utmSource: courseAccess.utmSource,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(courseAccess)
    .where(eq(courseAccess.isActive, true))
    .groupBy(courseAccess.utmSource)
    .orderBy(desc(sql`COUNT(*)`));

  return { buyers, videoStarts, videoReplays, trafficSources };
}

// ── Community-Fragen ──────────────────────────────────────────────────────────

export async function insertCommunityQuestion(data: InsertCommunityQuestion): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(communityQuestions).values(data);
}

export async function getAllCommunityQuestions() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(communityQuestions)
    .orderBy(desc(communityQuestions.createdAt));
}

export async function deleteCommunityQuestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(communityQuestions).where(eq(communityQuestions.id, id));
}

// ── Checkout-Test-Logs ──────────────────────────────────────────────────────

export async function getCheckoutTestLogs() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(checkoutTestLogs)
    .orderBy(desc(checkoutTestLogs.testedAt))
    .limit(10);
}
