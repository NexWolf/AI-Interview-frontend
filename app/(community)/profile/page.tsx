import ProfileComponent from "@/component/community/profile/ProfileComponent"
import { profileDataType } from "@/types/community/profile"
import {profileData} from "@/constants/mockProfieData";
import { getUserData } from "@/actions/profile/getUserData";

const page = async () => {

  const responseBackend = await getUserData() 
  console.log(responseBackend)
    const response : profileDataType= profileData
  return (
    <div>
        <ProfileComponent ProfileData = {response}/>
    </div>
  )
}

export default page