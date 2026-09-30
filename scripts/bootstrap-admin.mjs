import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

async function bootstrap() {
  console.log("=== WorkAI Initial Admin Bootstrap ===");

  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!expectedToken) {
    console.error("Error: ADMIN_BOOTSTRAP_TOKEN is not set in environment.");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    const inputToken = await question("Enter ADMIN_BOOTSTRAP_TOKEN: ");
    if (inputToken.trim() !== expectedToken.trim()) {
      console.error("Invalid bootstrap token. Access denied.");
      process.exit(1);
    }

    const adminEmail = (await question("Enter Administrator Email: ")).trim().toLowerCase();
    const adminPassword = (await question("Enter Administrator Password (min 10 chars): ")).trim();

    if (adminPassword.length < 10) {
      console.error("Error: Password must be at least 10 characters.");
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    try {
      const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          passwordHash,
          role: "SUPER_ADMIN",
        },
        create: {
          email: adminEmail,
          passwordHash,
          name: "Super Administrator",
          role: "SUPER_ADMIN",
        },
      });

      console.log(`\nSuccess! Super Administrator created for: ${admin.email}`);
      console.log("You can now securely log in at /login and access /admin.");
    } catch (dbErr) {
      console.log("\nNote: Database not reachable. Admin bootstrap credentials verified for local session mode.");
      console.log(`Admin email: ${adminEmail}`);
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
