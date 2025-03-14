"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CheckCircle, Trophy, Users, BookOpen, Code, Globe } from "lucide-react"
import codingAnimation from "../../public/codingAnimation.json"
import teamworkAnimation from "../../public/teamworkAnimation.json"
import competitionAnimation from "../../public/competitionAnimation.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const featureVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const FeatureItem = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 shadow-xl"
      variants={featureVariants}
      custom={delay}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="p-3 rounded-lg shadow-lg bg-gradient-to-br from-violet-600 to-indigo-600">{icon}</div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}

const AnimationCard = ({ animationData, title, description, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="h-64 mb-6 flex items-center justify-center">
        <Lottie animationData={animationData} loop={true} style={{ width: "100%", height: "100%" }} />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16" variants={containerVariants}>
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" variants={itemVariants}>
            Elevate Your Competitive Programming Journey
          </motion.h2>
          <motion.p className="text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
            Join the Programming Contest Club at CSE, UAP and become part of a thriving competitive programming community.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimationCard animationData={codingAnimation} title="Expert Mentorship" description="Learn from experienced competitive programmers." index={0} />
          <AnimationCard animationData={teamworkAnimation} title="Collaborative Community" description="Join a supportive community." index={1} />
          <AnimationCard animationData={competitionAnimation} title="Contest Preparation" description="Regular practice sessions." index={2} />
        </div>
      </div>
    </section>
  )
}