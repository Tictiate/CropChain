"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!username || !password || !role) {
    return { error: "Missing fields" };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return { error: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      }
    });

    return { success: true };
  } catch (e) {
    return { error: "Registration failed. Try again." };
  }
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error; // Rethrow to let Next.js handle redirect
  }
}
