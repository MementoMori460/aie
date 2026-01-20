import { eq, desc, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { User, InsertUser, users, evaluations, evaluationIndicators, InsertEvaluation, InsertEvaluationIndicator, reviews, reviewerAssignments, InsertReview, InsertReviewerAssignment, auditLogs, InsertAuditLog, systemSettings, InsertSystemSetting, aiPrompts, InsertAiPrompt } from "../drizzle/schema";
import { ENV } from './_core/env';

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export async function getDb() {
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
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

    // SQLite upsert syntax
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(userId: number, role: "user" | "admin" | "reviewer" | "board_chair") {
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function createUser(user: InsertUser) {
  const result = await db.insert(users).values(user).returning({ insertedId: users.id });
  return result[0].insertedId;
}

// System Settings queries

export async function getSystemSettings() {
  return await db.select().from(systemSettings);
}

export async function getSystemSetting(key: string) {
  const result = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : undefined;
}

export async function updateSystemSetting(key: string, value: string, description?: string) {
  await db
    .insert(systemSettings)
    .values({ key, value, description })
    .onConflictDoUpdate({
      target: systemSettings.key,
      set: { value, description, updatedAt: new Date() },
    });
}

// Evaluation queries

export async function createEvaluation(data: InsertEvaluation) {
  const result = await db.insert(evaluations).values(data).returning({ insertedId: evaluations.id });
  return result[0].insertedId;
}

export async function getEvaluationById(id: number) {
  const result = await db.select().from(evaluations).where(eq(evaluations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserEvaluations(userId: number) {
  return await db.select().from(evaluations).where(eq(evaluations.userId, userId)).orderBy(desc(evaluations.createdAt));
}

export async function getAllEvaluations() {
  return await db.select().from(evaluations).orderBy(desc(evaluations.createdAt));
}

export async function getAssignedEvaluations(reviewerId: number) {
  const assignments = await db.select().from(reviewerAssignments).where(eq(reviewerAssignments.reviewerId, reviewerId));
  const ids = assignments.map(a => a.evaluationId);

  if (ids.length === 0) return [];

  return await db.select().from(evaluations).where(inArray(evaluations.id, ids)).orderBy(desc(evaluations.createdAt));
}

export async function getEvaluationsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return await db.select().from(evaluations).where(inArray(evaluations.id, ids));
}

export async function updateEvaluation(id: number, data: Partial<InsertEvaluation>) {
  await db.update(evaluations).set(data).where(eq(evaluations.id, id));
}

export async function deleteEvaluation(id: number) {
  // Delete indicators first
  await db.delete(evaluationIndicators).where(eq(evaluationIndicators.evaluationId, id));
  // Then delete evaluation
  await db.delete(evaluations).where(eq(evaluations.id, id));
}

// Evaluation indicator queries

export async function saveIndicator(data: InsertEvaluationIndicator) {
  // Check if indicator already exists
  const existing = await db
    .select()
    .from(evaluationIndicators)
    .where(
      and(
        eq(evaluationIndicators.evaluationId, data.evaluationId),
        eq(evaluationIndicators.indicatorCode, data.indicatorCode!)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing
    await db
      .update(evaluationIndicators)
      .set(data)
      .where(eq(evaluationIndicators.id, existing[0].id));
    return existing[0].id;
  } else {
    // Insert new
    const result = await db.insert(evaluationIndicators).values(data).returning({ insertedId: evaluationIndicators.id });
    return result[0].insertedId;
  }
}

export async function getEvaluationIndicators(evaluationId: number) {
  return await db
    .select()
    .from(evaluationIndicators)
    .where(eq(evaluationIndicators.evaluationId, evaluationId));
}

export async function getIndicatorByCode(evaluationId: number, indicatorCode: string) {
  const result = await db
    .select()
    .from(evaluationIndicators)
    .where(
      and(
        eq(evaluationIndicators.evaluationId, evaluationId),
        eq(evaluationIndicators.indicatorCode, indicatorCode)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Reviewer assignment queries

export async function assignReviewer(data: InsertReviewerAssignment) {
  const result = await db.insert(reviewerAssignments).values(data).returning({ insertedId: reviewerAssignments.id });
  return result[0].insertedId;
}

export async function getReviewerAssignments(evaluationId: number) {
  return await db
    .select()
    .from(reviewerAssignments)
    .where(eq(reviewerAssignments.evaluationId, evaluationId));
}

export async function updateReviewerAssignmentStatus(id: number, status: "assigned" | "in_progress" | "completed") {
  await db
    .update(reviewerAssignments)
    .set({ status, completedAt: status === "completed" ? new Date() : null })
    .where(eq(reviewerAssignments.id, id));
}

export async function updateReviewerAssignmentStatusByIds(evaluationId: number, reviewerId: number, status: "assigned" | "in_progress" | "completed") {
  await db
    .update(reviewerAssignments)
    .set({ status, completedAt: status === "completed" ? new Date() : null })
    .where(
      and(
        eq(reviewerAssignments.evaluationId, evaluationId),
        eq(reviewerAssignments.reviewerId, reviewerId)
      )
    );
}

// Review queries

export async function saveReview(data: InsertReview) {
  // Check if review already exists for this reviewer and evaluation
  const existing = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.evaluationId, data.evaluationId),
        eq(reviews.reviewerId, data.reviewerId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(reviews)
      .set(data)
      .where(eq(reviews.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(reviews).values(data).returning({ insertedId: reviews.id });
    return result[0].insertedId;
  }
}

export async function getReviewsByEvaluation(evaluationId: number) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.evaluationId, evaluationId));
}

export async function getReviewByReviewer(evaluationId: number, reviewerId: number) {
  const result = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.evaluationId, evaluationId),
        eq(reviews.reviewerId, reviewerId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Audit log queries

export async function createAuditLog(data: InsertAuditLog) {
  await db.insert(auditLogs).values(data);
}

export async function getAuditLogs(evaluationId?: number) {
  const query = db.select().from(auditLogs);
  if (evaluationId) {
    return await query.where(eq(auditLogs.evaluationId, evaluationId)).orderBy(desc(auditLogs.createdAt));
  }
  return await query.orderBy(desc(auditLogs.createdAt)).limit(100);
}

// User Management extensions

export async function updateUser(id: number, data: Partial<InsertUser>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function updateUserBlockStatus(id: number, isBlocked: boolean) {
  // Map boolean to integer (0 or 1) for SQLite if needed, but Drizzle handles 'mode: boolean' usually.
  // However, I used 'mode: boolean' in schema, so true/false should work directly.
  await db.update(users).set({ isBlocked }).where(eq(users.id, id));
}


// AI Prompt Management

export async function createAiPrompt(data: InsertAiPrompt) {
  const result = await db.insert(aiPrompts).values(data).returning({ insertedId: aiPrompts.id });
  return result[0].insertedId;
}

export async function getAiPromptHistory() {
  return await db.select().from(aiPrompts).orderBy(desc(aiPrompts.createdAt));
}

export async function getActiveAiPrompt() {
  const result = await db.select().from(aiPrompts).where(eq(aiPrompts.isActive, true)).orderBy(desc(aiPrompts.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setActiveAiPrompt(id: number) {
  // First set all to inactive
  await db.update(aiPrompts).set({ isActive: false });
  // Then set specific one to active
  await db.update(aiPrompts).set({ isActive: true }).where(eq(aiPrompts.id, id));
}

export async function deleteAiPrompt(id: number) {
  await db.delete(aiPrompts).where(eq(aiPrompts.id, id));
}
