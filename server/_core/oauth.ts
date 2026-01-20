import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { nanoid } from "nanoid";

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

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Tüm alanlar gereklidir." });
      }

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Bu e-posta adresi zaten kullanımda." });
      }

      const openId = `local-${nanoid(10)}`;
      const newUser = {
        openId,
        name,
        email,
        password, // Storing as plaintext for now as per plan
        loginMethod: "local",
        role: "user" as const,
        lastSignedIn: new Date(),
      };

      const insertedId = await db.createUser(newUser);

      const sessionToken = await sdk.createSessionToken(openId, {
        name: newUser.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, user: { ...newUser, id: insertedId } });
    } catch (error) {
      console.error("[Auth] Registration failed:", error);
      res.status(500).json({ error: "Kayıt sırasında bir hata oluştu." });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "E-posta ve şifre gereklidir." });
      }

      // 1. Check for Demo Accounts (Backward compatibility/Convenience)
      const demoAccounts: Record<string, { role: any, name: string, openId: string }> = {
        "yazar@aie.com": { role: "user", name: "Ahmet Yazar", openId: "mock-author-id" },
        "hakem@aie.com": { role: "reviewer", name: "Mehmet Hakem", openId: "mock-reviewer-id" },
        "baskan@aie.com": { role: "board_chair", name: "Ayşe Başkan", openId: "mock-chair-id" },
        "admin@aie.com": { role: "admin", name: "Sistem Yöneticisi", openId: "mock-admin-id" }
      };

      if (demoAccounts[email] && password === "1234") {
        const info = demoAccounts[email];
        const mockUser = {
          openId: info.openId,
          name: info.name,
          email,
          loginMethod: "email_password",
          role: info.role,
          lastSignedIn: new Date(),
        };

        await db.upsertUser(mockUser);
        const sessionToken = await sdk.createSessionToken(info.openId, { name: info.name, expiresInMs: ONE_YEAR_MS });
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return res.json({ success: true, user: mockUser });
      }

      // 2. Check Database for local users
      const user = await db.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Hatalı e-posta veya şifre." });
      }

      // Update last signed in
      await db.upsertUser({
        ...user,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "Kullanıcı",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, user });

    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Giriş işlemi sırasında sistem hatası oluştu." });
    }
  });

  app.get("/api/auth/logout", (_req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect("/");
  });
}
