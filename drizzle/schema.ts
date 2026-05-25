import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Kurs-Zugang via Magic-Link.
 * Jede E-Mail-Adresse hat genau einen Eintrag.
 * UTM-Felder speichern die Traffic-Quelle beim Kauf.
 */
export const courseAccess = mysqlTable("course_access", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  magicToken: varchar("magicToken", { length: 128 }),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  sessionToken: varchar("sessionToken", { length: 128 }),
  sessionExpiresAt: timestamp("sessionExpiresAt"),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  // UTM-Tracking: Traffic-Quelle beim Kauf
  utmSource: varchar("utmSource", { length: 128 }),   // z.B. "instagram", "google"
  utmMedium: varchar("utmMedium", { length: 128 }),   // z.B. "paid", "cpc", "video"
  utmCampaign: varchar("utmCampaign", { length: 256 }), // z.B. "trotzphase"
  lastLoginAt: timestamp("lastLoginAt"),
});

export type CourseAccess = typeof courseAccess.$inferSelect;
export type InsertCourseAccess = typeof courseAccess.$inferInsert;

/**
 * Video-Events: Tracking welche Videos gestartet / wiederholt werden.
 */
export const videoEvents = mysqlTable("video_events", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  videoId: varchar("videoId", { length: 128 }).notNull(),
  videoTitle: varchar("videoTitle", { length: 256 }).notNull(),
  eventType: mysqlEnum("eventType", ["start", "replay", "complete"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VideoEvent = typeof videoEvents.$inferSelect;
export type InsertVideoEvent = typeof videoEvents.$inferInsert;

/**
 * Community-Fragen: Fragen von Kursteilnehmerinnen an Darleen.
 */
export const communityQuestions = mysqlTable("community_questions", {
  id: int("id").autoincrement().primaryKey(),
  userEmail: varchar("userEmail", { length: 320 }).notNull(),
  userName: text("userName"),
  question: text("question").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityQuestion = typeof communityQuestions.$inferSelect;
export type InsertCommunityQuestion = typeof communityQuestions.$inferInsert;

/**
 * Checkout-Test-Logs: Automatische Tests des Stripe-Checkouts.
 * Speichert die letzten 10 Erfolgs- und Fehler-Einträge.
 */
export const checkoutTestLogs = mysqlTable("checkout_test_logs", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["success", "error"]).notNull(),
  message: text("message").notNull(),
  errorCode: varchar("errorCode", { length: 128 }),
  responseTime: int("responseTime"), // in ms
  testedAt: timestamp("testedAt").defaultNow().notNull(),
});

export type CheckoutTestLog = typeof checkoutTestLogs.$inferSelect;
export type InsertCheckoutTestLog = typeof checkoutTestLogs.$inferInsert;
