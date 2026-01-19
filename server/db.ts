import { eq, desc, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, evaluations, evaluationIndicators, InsertEvaluation, InsertEvaluationIndicator, reviews, reviewerAssignments, InsertReview, InsertReviewerAssignment, auditLogs, InsertAuditLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// Evaluation queries

export async function createEvaluation(data: InsertEvaluation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(evaluations).values(data);
  return result[0].insertId;
}

export async function getEvaluationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(evaluations).where(eq(evaluations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserEvaluations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(evaluations).where(eq(evaluations.userId, userId)).orderBy(desc(evaluations.createdAt));
}

export async function getEvaluationsByIds(ids: number[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];
  return await db.select().from(evaluations).where(inArray(evaluations.id, ids));
}

export async function updateEvaluation(id: number, data: Partial<InsertEvaluation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(evaluations).set(data).where(eq(evaluations.id, id));
}

export async function deleteEvaluation(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete indicators first
  await db.delete(evaluationIndicators).where(eq(evaluationIndicators.evaluationId, id));
  // Then delete evaluation
  await db.delete(evaluations).where(eq(evaluations.id, id));
}

// Evaluation indicator queries

export async function saveIndicator(data: InsertEvaluationIndicator) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

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
    const result = await db.insert(evaluationIndicators).values(data);
    return result[0].insertId;
  }
}

export async function getEvaluationIndicators(evaluationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(evaluationIndicators)
    .where(eq(evaluationIndicators.evaluationId, evaluationId));
}

export async function getIndicatorByCode(evaluationId: number, indicatorCode: string) {
  const db = await getDb();
  if (!db) return undefined;

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
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reviewerAssignments).values(data);
  return result[0].insertId;
}

export async function getReviewerAssignments(evaluationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviewerAssignments)
    .where(eq(reviewerAssignments.evaluationId, evaluationId));
}

export async function updateReviewerAssignmentStatus(id: number, status: "assigned" | "in_progress" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(reviewerAssignments)
    .set({ status, completedAt: status === "completed" ? new Date() : null })
    .where(eq(reviewerAssignments.id, id));
}

// Review queries

export async function saveReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

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
    const result = await db.insert(reviews).values(data);
    return result[0].insertId;
  }
}

export async function getReviewsByEvaluation(evaluationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.evaluationId, evaluationId));
}

export async function getReviewByReviewer(evaluationId: number, reviewerId: number) {
  const db = await getDb();
  if (!db) return undefined;

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
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLogs).values(data);
}

export async function getAuditLogs(evaluationId?: number) {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(auditLogs);
  if (evaluationId) {
    return await query.where(eq(auditLogs.evaluationId, evaluationId)).orderBy(desc(auditLogs.createdAt));
  }
  return await query.orderBy(desc(auditLogs.createdAt)).limit(100);
}
