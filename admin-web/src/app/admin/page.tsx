import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("luckyflow_admin");

  if (!adminCookie || adminCookie.value !== "authenticated") {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}