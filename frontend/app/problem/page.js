import Problems from "@/components/platform/Problems"
import { Suspense } from "react"

export const metadata = {
    title: 'Problems - PCCOJ Contests',
    description: 'Explore the problems of the contest',
}

export default function page() {
    return (
        <Suspense fallback={<div>Loading Problems...</div>}>
            <Problems />
        </Suspense>
    )
}
