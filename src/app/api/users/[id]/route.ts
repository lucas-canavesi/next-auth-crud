import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {

  const currentUser = await getCurrentUser();

if (!currentUser) {
  return Response.json(
    { error: "Not authenticated" },
    { status: 401 }
  );
}

    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return Response.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (currentUser.role !== "ADMIN" && currentUser.id !== userId) {
  return Response.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

    const body = await request.json();
    const { name, email } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string"
    ) {
      return Response.json(
        { error: "Name and email must be strings" },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      return Response.json(
        { error: "Name and email are required" },
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

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (emailOwner && emailOwner.id !== userId) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: normalizedName,
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {

   const currentUser = await getCurrentUser();

if (!currentUser) {
  return Response.json(
    { error: "Not authenticated" },
    { status: 401 }
  );
}

if (currentUser.role !== "ADMIN") {
  return Response.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return Response.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return Response.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to delete user" },
      { status: 500 }
    );
  }
}