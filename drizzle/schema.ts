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
 * Im Test-Modus: kein Kauf erforderlich – jeder kann Zugang anfordern.
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
});

export type CourseAccess = typeof courseAccess.$inferSelect;
export type InsertCourseAccess = typeof courseAccess.$inferInsert;
