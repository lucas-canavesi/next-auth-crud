import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: {
          id: sessionToken,
        },
      });

      cookieStore.delete("session");
    }

    return Response.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to logout" },
      { status: 500 }
    );
  }
}