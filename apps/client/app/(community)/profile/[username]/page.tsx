"use client";
import ProfilePreview from "@/features/profile/components/ProfilePreview";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  return <ProfilePreview editable={false} username={username} />;
}