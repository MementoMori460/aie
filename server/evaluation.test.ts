import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
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

describe("evaluation.create", () => {
  it("creates a new evaluation with required fields", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.evaluation.create({
      paperTitle: "Test Paper on AI Ethics",
      paperAuthors: "Smith, J., Johnson, A.",
      paperDoi: "10.1000/test123",
      paperYear: 2024,
      paperJournal: "Nature",
      paperAbstract: "This is a test abstract about AI ethics.",
    });

    expect(result).toHaveProperty("evaluationId");
    expect(typeof result.evaluationId).toBe("number");
    expect(result.evaluationId).toBeGreaterThan(0);
  });

  it("creates evaluation with only required field (paperTitle)", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.evaluation.create({
      paperTitle: "Minimal Test Paper",
    });

    expect(result).toHaveProperty("evaluationId");
    expect(typeof result.evaluationId).toBe("number");
  });
});

describe("evaluation.get", () => {
  it("retrieves an evaluation by ID", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First create an evaluation
    const createResult = await caller.evaluation.create({
      paperTitle: "Retrievable Test Paper",
      paperYear: 2024,
    });

    // Then retrieve it
    const evaluation = await caller.evaluation.get({
      id: createResult.evaluationId,
    });

    expect(evaluation).toBeDefined();
    expect(evaluation?.paperTitle).toBe("Retrievable Test Paper");
    expect(evaluation?.paperYear).toBe(2024);
    expect(evaluation?.status).toBe("draft");
  });
});

describe("evaluation.update", () => {
  it("updates evaluation fields", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create evaluation
    const createResult = await caller.evaluation.create({
      paperTitle: "Original Title",
    });

    // Update it
    await caller.evaluation.update({
      id: createResult.evaluationId,
      paperTitle: "Updated Title",
      paperAuthors: "New Author",
      scoreD1: "75.5",
      scoreD2: "80.0",
    });

    // Verify update
    const updated = await caller.evaluation.get({
      id: createResult.evaluationId,
    });

    expect(updated?.paperTitle).toBe("Updated Title");
    expect(updated?.paperAuthors).toBe("New Author");
    expect(parseFloat(updated?.scoreD1 || "0")).toBeCloseTo(75.5, 1);
    expect(parseFloat(updated?.scoreD2 || "0")).toBeCloseTo(80.0, 1);
  });

  it("marks evaluation as completed", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const createResult = await caller.evaluation.create({
      paperTitle: "Completion Test",
    });

    const completedAt = new Date();
    await caller.evaluation.update({
      id: createResult.evaluationId,
      status: "completed",
      scoreHIS: "65.5",
      completedAt,
    });

    const updated = await caller.evaluation.get({
      id: createResult.evaluationId,
    });

    expect(updated?.status).toBe("completed");
    expect(parseFloat(updated?.scoreHIS || "0")).toBeCloseTo(65.5, 1);
    expect(updated?.completedAt).toBeDefined();
  });
});

describe("indicator.save", () => {
  it("saves indicator values for an evaluation", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create evaluation
    const createResult = await caller.evaluation.create({
      paperTitle: "Indicator Test Paper",
    });

    // Save indicator
    const indicatorResult = await caller.indicator.save({
      evaluationId: createResult.evaluationId,
      indicatorCode: "I_111",
      rawValue: "120",
      normalizedScore: "68.5",
    });

    expect(indicatorResult).toHaveProperty("indicatorId");
    expect(typeof indicatorResult.indicatorId).toBe("number");
  });

  it("retrieves saved indicators", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const createResult = await caller.evaluation.create({
      paperTitle: "Multi-Indicator Test",
    });

    // Save multiple indicators
    await caller.indicator.save({
      evaluationId: createResult.evaluationId,
      indicatorCode: "I_111",
      rawValue: "100",
      normalizedScore: "65.0",
    });

    await caller.indicator.save({
      evaluationId: createResult.evaluationId,
      indicatorCode: "I_112",
      rawValue: "4",
      normalizedScore: "75.0",
    });

    // Retrieve all indicators
    const indicators = await caller.indicator.list({
      evaluationId: createResult.evaluationId,
    });

    expect(indicators).toHaveLength(2);
    expect(indicators.map((i) => i.indicatorCode)).toContain("I_111");
    expect(indicators.map((i) => i.indicatorCode)).toContain("I_112");
  });
});

describe("indicator.get", () => {
  it("retrieves specific indicator by code", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const createResult = await caller.evaluation.create({
      paperTitle: "Specific Indicator Test",
    });

    await caller.indicator.save({
      evaluationId: createResult.evaluationId,
      indicatorCode: "I_311",
      rawValue: "2",
      normalizedScore: "40.0",
    });

    const indicator = await caller.indicator.get({
      evaluationId: createResult.evaluationId,
      indicatorCode: "I_311",
    });

    expect(indicator).toBeDefined();
    expect(indicator?.indicatorCode).toBe("I_311");
    expect(indicator?.rawValue).toBe("2");
    expect(parseFloat(indicator?.normalizedScore || "0")).toBeCloseTo(40.0, 1);
  });
});
