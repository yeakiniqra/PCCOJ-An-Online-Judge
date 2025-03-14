"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Rocket, Star, ArrowRight, Mail, Github, Users, Trophy } from "lucide-react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
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

// Floating animation for decorative elements
const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  
export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with radial gradient dots */}
      <div className="absolute top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-950/80 via-gray-950/50 to-gray-950/80"></div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-[10%] text-purple-500/20"
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        custom={0}
      >
        <Code size={64} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-[10%] text-pink-500/20"
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        custom={1}
      >
        <Star size={64} />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-[15%] text-blue-500/20"
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        custom={2}
      >
        <Rocket size={48} />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-pink-400 font-medium mb-6"
            variants={itemVariants}
          >
            Join Our Community
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            variants={itemVariants}
          >
            Ready to Level Up Your Coding Skills?
          </motion.h2>

          <motion.p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto" variants={itemVariants}>
            Join UAP's Programming Contest Club and become part of a thriving community of competitive programmers.
            Learn, compete, and grow together!
          </motion.p>

          <motion.div className="flex flex-col md:flex-row gap-6 justify-center mb-16" variants={itemVariants}>
            <motion.a
              href="#join-now"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Now
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#learn-more"
              className="px-8 py-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)" }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 mx-auto">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Weekly Practice</h3>
              <p className="text-gray-400">Regular coding sessions and practice contests to sharpen your skills</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)" }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Mentorship</h3>
              <p className="text-gray-400">Learn from experienced competitive programmers and industry professionals</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Competitions</h3>
              <p className="text-gray-400">Represent UAP in national and international programming contests</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Stay Updated</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
            <p className="mt-4 text-sm text-gray-400">Get notified about upcoming contests, workshops, and events</p>
          </motion.div>

          <motion.div className="mt-12 flex justify-center gap-6" variants={itemVariants}>
            <motion.a
              href="#discord"
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 7.5V9h6V7.5A3 3 0 0 0 9 7.5z" />
                <path d="M4.5 7.5A3 3 0 0 0 3 10.5V13h18v-2.5a3 3 0 0 0-1.5-3" />
                <path d="M3 13v5.5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V13" />
                <path d="M9 17v-4" />
                <path d="M15 17v-4" />
              </svg>
            </motion.a>

            <motion.a
              href="#github"
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-6 h-6" />
            </motion.a>

            <motion.a
              href="#email"
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

