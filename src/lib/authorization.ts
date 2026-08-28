import { getCurrentUser } from "@/lib/auth";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      response: Response.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}