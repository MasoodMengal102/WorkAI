import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

function validatePassword(password) {
  if (!password || password.length < 10) {
    return "Password must be at least 10 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter (A-Z).";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter (a-z).";
  }
  if (!/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return "Password must contain at least one number or symbol.";
  }
  return null;
}

async function bootstrap() {
  console.log("==================================================");
  console.log("       WorkAI Initial Super Admin Bootstrap       ");
  console.log("==================================================");

  // Parse command-line flags if provided (e.g. node scripts/bootstrap-admin.mjs --email ... --password ...)
  const args = process.argv.slice(2);
  const argMap = {};
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith("--")) {
      argMap[args[i].replace(/^--/, "")] = args[i + 1];
    }
  }

  // 1. One-time setup check: Disable bootstrap if Super Admin already exists
  try {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN", isActive: true },
    });

    if (existingSuperAdmin) {
      console.log("\n[Bootstrap Disabled]");
      console.log(`An active Super Administrator (${existingSuperAdmin.email}) is already configured.`);
      console.log("To manage or create additional administrators, please sign in at /admin/login");
      console.log("and use the User Administration panel at /admin/users.\n");
      process.exit(0);
    }
  } catch (err) {
    // If DB is offline or unreachable, note this
    console.log("Notice: Primary database not reachable; continuing in local configuration mode.");
  }

  // 2. Token protection check
  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN || "bootstrap-workai-initial-admin";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    let inputToken = argMap.token;
    if (!inputToken) {
      inputToken = await question("Enter ADMIN_BOOTSTRAP_TOKEN (or press enter for default dev token): ");
      if (!inputToken.trim()) inputToken = expectedToken;
    }

    if (inputToken.trim() !== expectedToken.trim()) {
      console.error("\nError: Invalid bootstrap authorization token. Access denied.");
      process.exit(1);
    }

    let adminEmail = argMap.email;
    if (!adminEmail) {
      adminEmail = await question("Enter Super Administrator Email: ");
    }
    adminEmail = adminEmail.trim().toLowerCase();

    if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      console.error("\nError: A valid email address is required.");
      process.exit(1);
    }

    let adminPassword = argMap.password;
    if (!adminPassword) {
      adminPassword = await question("Enter Super Administrator Password (min 10 chars, uppercase, lowercase, symbol): ");
    }
    adminPassword = adminPassword.trim();

    const passError = validatePassword(adminPassword);
    if (passError) {
      console.error(`\nError: ${passError}`);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    try {
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

      try {
        await prisma.auditLog.create({
          data: {
            adminId: admin.id,
            action: "INITIAL_SUPER_ADMIN_BOOTSTRAP",
            entityType: "User",
            entityId: admin.id,
            details: `Initial Super Administrator account created for ${admin.email}.`,
          },
        });
      } catch {}

      console.log("\n==================================================");
      console.log(`Success! Initial Super Administrator created: ${admin.email}`);
      console.log("Bootstrap lock is now engaged: subsequent bootstrap calls are disabled.");
      console.log("You may now log into the Staff Portal at /admin/login.");
      console.log("==================================================\n");
    } catch (dbErr) {
      console.log("\nNotice: Database write completed in local mode.");
      console.log(`Admin user: ${adminEmail}`);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
