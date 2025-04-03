import Contests from "@/components/contests/Contests"

export const metadata = {
  title: 'Upcoming Contests - PCCOJ',
  description: 'Upcoming contests',
  keywords: 'contests, programming contests, coding competitions',
}

export default function page() {
  return (
    <>
     <Contests/>
    </>
  )
}
