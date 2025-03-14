import StatsSection from '@/components/home/Stats'
import Hero from '@/components/home/Hero'
import WhyChooseSection from '@/components/home/WhyChoose'
import RecentContestsSection from '@/components/home/RecentContest'
import CTASection from '@/components/home/CTA'

export default function page() {
  return (
    <>
      <Hero />
      <StatsSection />
      <WhyChooseSection />
      <RecentContestsSection />
      <CTASection />
    </>
  )
}
