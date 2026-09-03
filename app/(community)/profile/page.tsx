import ProfilePreview from "@/features/profile/components/ProfilePreview"

const page = async () => {

  /* FETCH PROFILE DATA HERE */


  return (
    <div>
        <ProfilePreview userData={null} editable={true} />
    </div>
  )
}

export default page