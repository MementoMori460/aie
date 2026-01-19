import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("export.excel", () => {
  let testEvaluationId: number;

  beforeAll(async () => {
    // Create a test evaluation
    testEvaluationId = await db.createEvaluation({
      userId: 1,
      paperTitle: "Test Paper for Export",
      paperAuthors: "Test Author",
      paperDoi: "10.1234/test",
      paperYear: 2024,
      paperJournal: "Test Journal",
      paperAbstract: "This is a test abstract for export functionality testing.",
      scoreD1: "75.5",
      scoreD2: "80.0",
      scoreD3: "20.0",
      scoreD4: "85.0",
      scoreHIS: "72.5",
      status: "completed",
    });

    // Add some test indicators
    await db.saveIndicator({
      evaluationId: testEvaluationId,
      indicatorCode: "I1_1",
      rawValue: "100",
      normalizedScore: "0.85",
    });

    await db.saveIndicator({
      evaluationId: testEvaluationId,
      indicatorCode: "I1_2",
      rawValue: "50",
      normalizedScore: "0.75",
    });
  });

  it("should generate Excel file with evaluation data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.export.excel({
      evaluationId: testEvaluationId,
    });

    // Verify response structure
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("filename");
    expect(typeof result.data).toBe("string");
    expect(result.filename).toMatch(/^evaluation_\d+\.xlsx$/);

    // Verify base64 data is valid
    expect(result.data.length).toBeGreaterThan(0);
    
    // Try to decode base64 (should not throw)
    const buffer = Buffer.from(result.data, "base64");
    expect(buffer.length).toBeGreaterThan(0);

    // Excel files start with PK (zip signature)
    expect(buffer[0]).toBe(0x50); // 'P'
    expect(buffer[1]).toBe(0x4B); // 'K'
  }, 30000);

  it("should fail for non-existent evaluation", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.export.excel({ evaluationId: 99999 })
    ).rejects.toThrow("Evaluation not found");
  });
});

describe("export.pdf", () => {
  let testEvaluationId: number;

  beforeAll(async () => {
    // Create a test evaluation
    testEvaluationId = await db.createEvaluation({
      userId: 1,
      paperTitle: "Test Paper for PDF Export",
      paperAuthors: "Test Author",
      paperDoi: "10.1234/test-pdf",
      paperYear: 2024,
      paperJournal: "Test Journal",
      paperAbstract: "This is a test abstract for PDF export functionality testing.",
      scoreD1: "70.0",
      scoreD2: "75.0",
      scoreD3: "25.0",
      scoreD4: "80.0",
      scoreHIS: "68.0",
      status: "completed",
    });

    // Add some test indicators
    await db.saveIndicator({
      evaluationId: testEvaluationId,
      indicatorCode: "I1_1",
      rawValue: "90",
      normalizedScore: "0.80",
    });
  });

  it("should generate PDF file with evaluation data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.export.pdf({
      evaluationId: testEvaluationId,
    });

    // Verify response structure
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("filename");
    expect(typeof result.data).toBe("string");
    expect(result.filename).toMatch(/^evaluation_\d+\.pdf$/);

    // Verify base64 data is valid
    expect(result.data.length).toBeGreaterThan(0);
    
    // Try to decode base64 (should not throw)
    const buffer = Buffer.from(result.data, "base64");
    expect(buffer.length).toBeGreaterThan(0);

    // PDF files start with %PDF
    expect(buffer.toString("utf-8", 0, 4)).toBe("%PDF");
  }, 30000);

  it("should fail for non-existent evaluation", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.export.pdf({ evaluationId: 99999 })
    ).rejects.toThrow("Evaluation not found");
  });
});
