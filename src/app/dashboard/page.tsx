import { Metadata } from "next";
import { DashboardContent } from "./DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel principal do sistema",
};

export default function DashboardPage() {
  return <DashboardContent />;
}