import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user || null;
  } catch (error) {
    console.error("Session Error:", error);
    return null;
  }
};

export const getUserToken = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.session?.token || null;
  } catch (error) {
    console.error("Token Error:", error);
    return null;
  }
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
};