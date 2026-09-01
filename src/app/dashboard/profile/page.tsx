import { Metadata } from "next";
import { UserProfile } from "@/components/users/UserProfile";

export const metadata: Metadata = {
  title: "Meu Perfil",
  description: "Gerencie suas informações pessoais",
};

export default function ProfilePage() {
  return <UserProfile />;
}