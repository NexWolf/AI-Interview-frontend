import ProfileComponent from "@/component/community/profile/ProfileComponent"
import { profileDataType } from "@/types/community/profile"
import {profileData} from "@/constants/mockProfieData";

const page = () => {
    const response : profileDataType= profileData
  return (
    <div>
        <ProfileComponent ProfileData = {response}/>
    </div>
  )
}

export default page