import StatsSection from '@/components/home/Stats'
import Hero from '@/components/home/Hero'
import WhyChooseSection from '@/components/home/WhyChoose'
import RecentContestsSection from '@/components/home/RecentContest'
import CTASection from '@/components/home/CTA'
import FloatingChatbot from '@/components/shared/FloatingChatbot'

export default function page() {
  return (
    <>
      <Hero />
      <StatsSection />
      <WhyChooseSection />
      <RecentContestsSection />
      <CTASection />
      <FloatingChatbot />
    </>
  )
}
