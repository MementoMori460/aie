import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "reviewer", "board_chair"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Evaluations table - stores each paper evaluation session
 */
export const evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),

  // Paper metadata
  paperTitle: text("paperTitle").notNull(),
  paperAuthors: text("paperAuthors"),
  paperDoi: varchar("paperDoi", { length: 255 }),
  paperYear: int("paperYear"),
  paperJournal: text("paperJournal"),
  paperAbstract: text("paperAbstract"),

  // Evaluation mode
  evaluationMode: mysqlEnum("evaluationMode", ["quick", "comprehensive"]).default("quick").notNull(),

  // Calculated scores (stored as decimal for precision)
  scoreD1: decimal("scoreD1", { precision: 5, scale: 2 }), // Academic Impact
  scoreD2: decimal("scoreD2", { precision: 5, scale: 2 }), // Social & Practical Impact
  scoreD3: decimal("scoreD3", { precision: 5, scale: 2 }), // Negative Impact & Risk
  scoreD4: decimal("scoreD4", { precision: 5, scale: 2 }), // Ethics & Responsibility
  scoreHIS: decimal("scoreHIS", { precision: 5, scale: 2 }), // Holistic Impact Score

  // New Extended Impact Dimensions (156 parameters)
  scoreD5: decimal("scoreD5", { precision: 5, scale: 2 }), // Economic Impact
  scoreD6: decimal("scoreD6", { precision: 5, scale: 2 }), // Health Impact
  scoreD7: decimal("scoreD7", { precision: 5, scale: 2 }), // Environmental Impact
  scoreD8: decimal("scoreD8", { precision: 5, scale: 2 }), // Political & Legal Impact
  scoreD9: decimal("scoreD9", { precision: 5, scale: 2 }), // Technological Impact
  scoreD10: decimal("scoreD10", { precision: 5, scale: 2 }), // Social & Cultural Impact
  scoreD11: decimal("scoreD11", { precision: 5, scale: 2 }), // Educational Impact
  scoreD12: decimal("scoreD12", { precision: 5, scale: 2 }), // Digital & Media Impact
  scoreD13: decimal("scoreD13", { precision: 5, scale: 2 }), // Security & Defense Impact
  scoreD14: decimal("scoreD14", { precision: 5, scale: 2 }), // Psychological & Well-being Impact
  scoreD15: decimal("scoreD15", { precision: 5, scale: 2 }), // International Collaboration Impact
  scoreD16: decimal("scoreD16", { precision: 5, scale: 2 }), // Cascade & Multiplier Effects

  // Cascade effect metrics
  cascadeMultiplier: decimal("cascadeMultiplier", { precision: 5, scale: 2 }), // Overall cascade multiplier
  economicMultiplier: decimal("economicMultiplier", { precision: 5, scale: 2 }), // Economic multiplier coefficient
  socialMultiplier: decimal("socialMultiplier", { precision: 5, scale: 2 }), // Social multiplier coefficient
  networkEffectScore: decimal("networkEffectScore", { precision: 5, scale: 2 }), // Network effect score

  // Metadata
  status: mysqlEnum("status", ["draft", "completed"]).default("draft").notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Evaluation indicators table - stores individual indicator values for each evaluation
 * Using JSON to store raw data and normalized scores for flexibility
 */
export const evaluationIndicators = mysqlTable("evaluationIndicators", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),

  // Indicator identification
  indicatorCode: varchar("indicatorCode", { length: 20 }).notNull(), // e.g., "I_111", "I_212"

  // Raw data (can be number, string, or boolean depending on indicator type)
  rawValue: text("rawValue"),

  // Normalized score (0-100)
  normalizedScore: decimal("normalizedScore", { precision: 5, scale: 2 }),

  // Additional metadata (for storing context like expert ratings, sources, etc.)
  metadata: json("metadata"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationIndicator = typeof evaluationIndicators.$inferSelect;
export type InsertEvaluationIndicator = typeof evaluationIndicators.$inferInsert;

/**
 * Reviewer assignments - links users (reviewers) to evaluations
 */
export const reviewerAssignments = mysqlTable("reviewerAssignments", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  reviewerId: int("userId").notNull(),
  status: mysqlEnum("status", ["assigned", "in_progress", "completed"]).default("assigned").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ReviewerAssignment = typeof reviewerAssignments.$inferSelect;
export type InsertReviewerAssignment = typeof reviewerAssignments.$inferInsert;

/**
 * Individual reviews - stores reviewer-specific scores for indicators
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  reviewerId: int("reviewerId").notNull(),

  // Scored dimensions
  scoreD1: decimal("scoreD1", { precision: 5, scale: 2 }),
  scoreD2: decimal("scoreD2", { precision: 5, scale: 2 }),
  scoreD3: decimal("scoreD3", { precision: 5, scale: 2 }),
  scoreD4: decimal("scoreD4", { precision: 5, scale: 2 }),
  scoreHIS: decimal("scoreHIS", { precision: 5, scale: 2 }),

  comment: text("comment"),
  status: mysqlEnum("status", ["draft", "submitted"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Audit logs - tracks important actions for transparency
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  evaluationId: int("evaluationId"),
  action: varchar("action", { length: 128 }).notNull(), // e.g., "EVALUATION_COMPLETED", "REVIEW_SUBMITTED"
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
