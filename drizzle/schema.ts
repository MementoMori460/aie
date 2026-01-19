import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin", "reviewer", "board_chair"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(), // SQLite doesn't have onUpdateNow natively, handled in app logic usually or just kept simple
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Evaluations table - stores each paper evaluation session
 */
export const evaluations = sqliteTable("evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),

  // Paper metadata
  paperTitle: text("paperTitle").notNull(),
  paperAuthors: text("paperAuthors"),
  paperDoi: text("paperDoi"),
  paperYear: integer("paperYear"),
  paperJournal: text("paperJournal"),
  paperAbstract: text("paperAbstract"),

  // Evaluation mode
  evaluationMode: text("evaluationMode", { enum: ["quick", "comprehensive"] }).default("quick").notNull(),

  // Calculated scores (stored as real for SQLite)
  scoreD1: real("scoreD1"),
  scoreD2: real("scoreD2"),
  scoreD3: real("scoreD3"),
  scoreD4: real("scoreD4"),
  scoreHIS: real("scoreHIS"),

  // New Extended Impact Dimensions
  scoreD5: real("scoreD5"),
  scoreD6: real("scoreD6"),
  scoreD7: real("scoreD7"),
  scoreD8: real("scoreD8"),
  scoreD9: real("scoreD9"),
  scoreD10: real("scoreD10"),
  scoreD11: real("scoreD11"),
  scoreD12: real("scoreD12"),
  scoreD13: real("scoreD13"),
  scoreD14: real("scoreD14"),
  scoreD15: real("scoreD15"),
  scoreD16: real("scoreD16"),

  // Cascade effect metrics
  cascadeMultiplier: real("cascadeMultiplier"),
  economicMultiplier: real("economicMultiplier"),
  socialMultiplier: real("socialMultiplier"),
  networkEffectScore: real("networkEffectScore"),

  // Metadata
  status: text("status", { enum: ["draft", "completed"] }).default("draft").notNull(),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Evaluation indicators table
 */
export const evaluationIndicators = sqliteTable("evaluationIndicators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  evaluationId: integer("evaluationId").notNull(),

  indicatorCode: text("indicatorCode").notNull(),
  rawValue: text("rawValue"),
  normalizedScore: real("normalizedScore"),

  metadata: text("metadata", { mode: "json" }),

  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type EvaluationIndicator = typeof evaluationIndicators.$inferSelect;
export type InsertEvaluationIndicator = typeof evaluationIndicators.$inferInsert;

/**
 * Reviewer assignments
 */
export const reviewerAssignments = sqliteTable("reviewerAssignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  evaluationId: integer("evaluationId").notNull(),
  reviewerId: integer("userId").notNull(),
  status: text("status", { enum: ["assigned", "in_progress", "completed"] }).default("assigned").notNull(),
  assignedAt: integer("assignedAt", { mode: "timestamp" }).defaultNow().notNull(),
  completedAt: integer("completedAt", { mode: "timestamp" }),
});

export type ReviewerAssignment = typeof reviewerAssignments.$inferSelect;
export type InsertReviewerAssignment = typeof reviewerAssignments.$inferInsert;

/**
 * Individual reviews
 */
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  evaluationId: integer("evaluationId").notNull(),
  reviewerId: integer("reviewerId").notNull(),

  // Scored dimensions
  scoreD1: real("scoreD1"),
  scoreD2: real("scoreD2"),
  scoreD3: real("scoreD3"),
  scoreD4: real("scoreD4"),
  scoreHIS: real("scoreHIS"),

  comment: text("comment"),
  status: text("status", { enum: ["draft", "submitted"] }).default("draft").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Audit logs
 */
export const auditLogs = sqliteTable("auditLogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  evaluationId: integer("evaluationId"),
  action: text("action").notNull(),
  details: text("details", { mode: "json" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
