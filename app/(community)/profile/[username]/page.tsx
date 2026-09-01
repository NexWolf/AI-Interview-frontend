"use client"
import ProfilePreview from "@/features/profile/components/ProfilePreview";
import { useParams } from "next/navigation";

export default function UserProfilePage () {
    const {userName} = useParams<{userName : string}>();
    return <ProfilePreview userName={userName} />
}