import { getCurrentUser } from "@/lib/auth";
import { verifyPassword, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
    const { currentPassword, newPassword, confirmPassword } = body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return Response.json(
        { error: "All fields must be strings" },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        { error: "Current password, new password, and confirmation are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { error: "New password and confirmation do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Password must have at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passwordValid = await verifyPassword(currentPassword, user.password);

    if (!passwordValid) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: passwordHash },
    });

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (sessionToken) {
      await prisma.session.delete({
        where: { id: sessionToken },
      });
      cookieStore.delete("session");
    }

    return Response.json({
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to change password" },
      { status: 500 }
    );
  }
}