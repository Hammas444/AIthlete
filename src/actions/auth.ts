// src/actions/auth.ts
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) return { error: "Missing fields" };

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) return { error: "Email already in use" };

  // Hash password and insert
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email,
    password: hashedPassword,
    name: name || "Gym Member",
  });

  // Automatically log them in after registration
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Required to allow Next.js redirects to work
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}