import ContestLeaderboard from "@/components/leaderboard/Leaderboard"
import { Suspense } from "react"

export const metadata = {
  title: 'Contest Leaderboard - PCCOJ Contests',
  description: 'Explore the leaderboard of the contest',
}

export default function page() {
  return (
    <Suspense fallback={<div>Loading Leaderboard...</div>}>
      <ContestLeaderboard />
    </Suspense>
  )
}
