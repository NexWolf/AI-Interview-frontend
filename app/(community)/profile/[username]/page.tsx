"use client"
import ProfilePreview from "@/features/profile/components/ProfilePreview";
import { useParams } from "next/navigation";

export default function UserProfilePage () {
    const {userName} = useParams<{userName : string}>();

    /* FETCH USER DATA BY USERNAME ELEMENT */


    return <ProfilePreview userData={null} />
}