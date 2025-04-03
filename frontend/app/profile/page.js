import Profile from "@/components/profile/profile"

export const metadata = {
  title: 'Your Profile - PCC Online Judge',
  description: 'View and manage your profile information and coding statistics.',
}

export default function page() {
  return (
    <>
       <Profile />
    </>
  )
}
