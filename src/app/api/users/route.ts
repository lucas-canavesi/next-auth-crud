import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const currentUser = await getCurrentUser();

if (!currentUser) {
  return Response.json(
    { error: "Not authenticated" },
    { status: 401 }
  );
}  

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return Response.json(users);
}

export async function POST(request: Request) {
  try {

   const currentUser = await getCurrentUser();

  if (!currentUser) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

    const body = await request.json();

    const { name, email, password } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return Response.json(
        { error: "Name, email and password must be strings" },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return Response.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (normalizedName.length < 2) {
      return Response.json(
        { error: "Name must have at least 2 characters" },
        { status: 400 }
      );
    }

    if (!normalizedEmail.includes("@")) {
      return Response.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must have at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }
    
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to create user" },
      { status: 500 }
    );
  }
}