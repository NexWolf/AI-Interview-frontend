"use client"
import { BioDataType, profileDataType } from "@/types/community/profile"
import ProfileHeader  from "./ProfileHeader"
import { SkillOverview } from "./SkillsOverview"
import AboutSection from "./AboutSection"

type ProfileProps ={
    ProfileData  : profileDataType
}

const handleBioAdd = () => {
    console.log("add bio")
}

const handleBioEdit = () => {
    console.log("ediit")
}

const ProfileComponent = ({ProfileData}: ProfileProps)  => {
  return (
    <div className="p-5 flex flex-col gap-2">
        <ProfileHeader data={ProfileData.bio as BioDataType} onAdd={handleBioAdd} onEdit={handleBioEdit}/>

        
            <SkillOverview skills={ProfileData.skills} />
        

        <div>
            <AboutSection />
        </div>
    </div>
  )
}

export default ProfileComponent