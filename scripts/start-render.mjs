#!/usr/bin/env node
import { spawn, execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log("==================================================");
console.log("       WorkAI - Render Production Startup         ");
console.log("==================================================");
console.log(`[Info] Node Version   : ${process.version}`);
console.log(`[Info] Environment    : ${process.env.NODE_ENV || "production"}`);
console.log(`[Info] Target Port    : ${process.env.PORT || 3000}`);
console.log(`[Info] Database URL   : ${process.env.DATABASE_URL ? "Configured (PostgreSQL)" : "Not configured (Memory Fallback)"}`);

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("[DB] No DATABASE_URL specified. Booting with verified datasets in-memory store.");
    return;
  }

  console.log("[DB] Connecting to PostgreSQL database...");
  const prisma = new PrismaClient();
  let isConnected = false;
  const maxRetries = process.env.RENDER ? 6 : 2;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      isConnected = true;
      console.log(`[DB] Connected successfully to PostgreSQL on attempt ${attempt}/${maxRetries}.`);
      break;
    } catch (err) {
      console.log(`[DB] Attempt ${attempt}/${maxRetries} could not reach database (${err.message}). Retrying in ${delayMs / 1000}s...`);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  if (!isConnected) {
    console.warn("[DB] Warning: PostgreSQL not reachable within retry window.");
    console.warn("[DB] Proceeding with application boot. Built-in verified datasets will serve requests.");
    await prisma.$disconnect().catch(() => {});
    return;
  }

  // 1. Run migrations or sync schema
  let migrationSucceeded = false;
  try {
    console.log("[DB] Applying database migrations (`prisma migrate deploy`)...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    migrationSucceeded = true;
    console.log("[DB] Migrations applied successfully.");
  } catch (migErr) {
    console.warn("[DB] `prisma migrate deploy` notice:", migErr.message);
  }

  if (!migrationSucceeded) {
    try {
      console.log("[DB] Running `prisma db push` to ensure schema tables exist...");
      execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
      console.log("[DB] Schema synchronized successfully via `prisma db push`.");
    } catch (pushErr) {
      console.warn("[DB] Schema sync notice:", pushErr.message);
    }
  }

  // 2. Automated Super Admin provisioning if configured via environment
  const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.ADMIN_PASSWORD || "").trim();

  if (adminEmail && adminPassword) {
    try {
      const existingSuperAdmin = await prisma.user.findFirst({
        where: { role: "SUPER_ADMIN", isActive: true },
      });

      if (!existingSuperAdmin) {
        console.log(`[Admin] Bootstrapping initial Super Administrator account for ${adminEmail}...`);
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        const admin = await prisma.user.upsert({
          where: { email: adminEmail },
          update: {
            passwordHash,
            role: "SUPER_ADMIN",
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isActive: true,
          },
          create: {
            email: adminEmail,
            passwordHash,
            name: "Super Administrator",
            role: "SUPER_ADMIN",
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isActive: true,
          },
        });

        await prisma.auditLog.create({
          data: {
            adminId: admin.id,
            action: "AUTO_BOOTSTRAP_SUPER_ADMIN",
            entityType: "User",
            entityId: admin.id,
            details: `Super Admin automatically initialized during Render startup for ${admin.email}`,
          },
        }).catch(() => {});

        console.log(`[Admin] Initial Super Admin created successfully (${admin.email}).`);
      } else {
        console.log(`[Admin] Active Super Admin account already exists (${existingSuperAdmin.email}).`);
      }
    } catch (adminErr) {
      console.warn("[Admin] Auto-bootstrap notice:", adminErr.message);
    }
  } else {
    console.log("[Admin] Note: Set ADMIN_EMAIL and ADMIN_PASSWORD in Render environment variables to auto-create Super Admin.");
  }

  await prisma.$disconnect().catch(() => {});
}

async function startServer() {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error("[Boot] Initialization notice:", err.message);
  }

  const port = process.env.PORT || 3000;
  console.log(`[Server] Starting Next.js production server on 0.0.0.0:${port}...`);

  const nextProcess = spawn(`npx next start -p ${port} -H 0.0.0.0`, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  const forwardSignal = (signal) => {
    console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
    nextProcess.kill(signal);
  };

  process.on("SIGTERM", () => forwardSignal("SIGTERM"));
  process.on("SIGINT", () => forwardSignal("SIGINT"));

  nextProcess.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[Server] Next.js process exited with signal ${signal}`);
      process.exit(0);
    } else {
      console.log(`[Server] Next.js process exited with code ${code}`);
      process.exit(code ?? 0);
    }
  });
}

startServer();
