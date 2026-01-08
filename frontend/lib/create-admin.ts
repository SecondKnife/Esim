import { db } from "./db";
import { hashPassword } from "./auth";

export async function createAdminUser() {
  try {
    const adminEmail = "admin@admin.com";
    const adminPassword = "admin123";

    const existingAdmin = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);

    const admin = await db.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("ID:", admin.id);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}
