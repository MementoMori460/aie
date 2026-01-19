import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  app.get("/api/auth/mock", async (req: Request, res: Response) => {
    try {
      const role = (req.query.role as string) || "user";
      const validRoles = ["user", "admin", "reviewer", "board_chair"];
      const finalRole = validRoles.includes(role) ? role : "user";

      const mockUser = {
        openId: `mock-${finalRole}-id`,
        name: (req.query.name as string) || `Demo ${finalRole.charAt(0).toUpperCase() + finalRole.slice(1)}`,
        email: (req.query.email as string) || `${finalRole}@demo.com`,
        loginMethod: "mock",
        role: finalRole as "user" | "admin" | "reviewer" | "board_chair",
        lastSignedIn: new Date(),
      };

      console.log("[Auth] Starting mock login for:", mockUser.openId);
      await db.upsertUser(mockUser);
      console.log("[Auth] Mock user upserted (memory or DB)");

      const sessionToken = await sdk.createSessionToken(mockUser.openId, {
        name: mockUser.name,
        expiresInMs: ONE_YEAR_MS,
      });
      console.log("[Auth] Session token created");

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      console.log("[Auth] Cookie set, redirecting to /");

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Mock login failed EXCEPTION:", error);
      res.status(500).json({ error: "Mock login failed", details: String(error) });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Simple password check for demo
      if (!email || !password) {
        res.status(400).json({ error: "E-posta ve şifre gereklidir." });
        return;
      }

      if (password !== "1234") {
        res.status(401).json({ error: "Hatalı şifre." });
        return;
      }

      // Map specific emails to roles
      let role: "user" | "admin" | "reviewer" | "board_chair" = "user";
      let name = "Kullanıcı";
      let openId = "mock-user-id";

      switch (email) {
        case "yazar@aie.com":
          role = "user";
          name = "Ahmet Yazar";
          openId = "mock-author-id";
          break;
        case "hakem@aie.com":
          role = "reviewer";
          name = "Mehmet Hakem";
          openId = "mock-reviewer-id";
          break;
        case "baskan@aie.com":
          role = "board_chair";
          name = "Ayşe Başkan";
          openId = "mock-chair-id";
          break;
        case "admin@aie.com":
          role = "admin";
          name = "Sistem Yöneticisi";
          openId = "mock-admin-id";
          break;
        default:
          res.status(401).json({ error: "Tanımsız kullanıcı." });
          return;
      }

      const mockUser = {
        openId,
        name,
        email,
        loginMethod: "email_password",
        role,
        lastSignedIn: new Date(),
      };

      console.log(`[Auth] Login attempt for: ${email} as ${role}`);
      await db.upsertUser(mockUser);

      const sessionToken = await sdk.createSessionToken(openId, {
        name: mockUser.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, user: mockUser });

    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login failed system error" });
    }
  });

  app.get("/api/auth/logout", (_req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect("/");
  });
}
