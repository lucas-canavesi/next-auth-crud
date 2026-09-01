import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateSessionToken } from "@/lib/session";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return Response.json(
        { error: "Email and password must be strings" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      user.password
    );

    if (!passwordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionToken = generateSessionToken();

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    );

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to login" },
      { status: 500 }
    );
  }
}