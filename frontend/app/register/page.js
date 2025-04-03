import Register from "@/components/register/Register"

export const metadata = {
  title: 'Register Now - PCCOJ',
  description: 'Create a new account',
  keywords: 'register, create account, sign up',
}

export default function page() {
  return (
    <>
        <Register />
    </>
  )
}
