"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, Clock, Users, Award, ExternalLink } from "lucide-react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// Sample contest data - limited to 3 contests
const contests = [
  {
    id: 1,
    title: "UAP Inter-University Programming Contest 2023",
    date: "November 15, 2023",
    time: "10:00 AM - 3:00 PM",
    platform: "Codeforces",
    description:
      "A prestigious inter-university contest hosted by UAP CSE department featuring challenging algorithmic problems.",
    participants: 120,
    image: "/contest1.jpg",
    winners: ["Team CodeNinjas", "Team AlgoMasters", "Team ByteBusters"],
    platformIcon: "🏆",
  },
  {
    id: 2,
    title: "ICPC Asia Dhaka Regional Contest",
    date: "October 5, 2023",
    time: "9:00 AM - 2:00 PM",
    platform: "ICPC",
    description:
      "The prestigious ICPC regional contest where UAP teams competed against top universities from across the region.",
    participants: 85,
    image: "/contest2.jpg",
    winners: ["Team CodeCrusaders", "Team AlgorithmAces", "Team LogicLegends"],
    platformIcon: "🌏",
  },
  {
    id: 3,
    title: "UAP Freshman Programming Contest",
    date: "September 20, 2023",
    time: "11:00 AM - 2:00 PM",
    platform: "HackerRank",
    description: "A beginner-friendly contest designed to introduce freshmen to the world of competitive programming.",
    participants: 150,
    image: "/contest3.jpg",
    winners: ["Maruf", "Arafat", "Sohag"],
    platformIcon: "🚀",
  },
]

// Platform icons mapping
const platformIcons = {
  Codeforces: (
    <div className="text-orange-500">
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
        <path d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    </div>
  ),
  ICPC: (
    <div className="text-blue-500">
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    </div>
  ),
  HackerRank: (
    <div className="text-green-500">
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
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </div>
  ),
}


const ContestCard = ({ contest, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative h-[500px] rounded-xl overflow-hidden group"
      variants={itemVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>

      {/* Contest image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          scale: isHovered ? 1.1 : 1,
          filter: isHovered ? "brightness(0.7)" : "brightness(0.5)",
        }}
        transition={{ duration: 0.5 }}
      >
        <Image src={contest.image || "/placeholder.svg"} alt={contest.title} fill className="object-cover" />
      </motion.div>

      {/* Platform badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700">
        {platformIcons[contest.platform] || <div>{contest.platformIcon}</div>}
        <span className="text-sm font-medium">{contest.platform}</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm w-fit"
        >
          <span className="text-xs font-medium text-white">Featured Contest</span>
        </motion.div>

        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300">
          {contest.title}
        </h3>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">{contest.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-gray-300">{contest.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">{contest.participants} Participants</span>
          </div>
        </div>

        <p className="text-gray-400 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {contest.description}
        </p>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> Winners
            </h4>
            <ul className="space-y-1">
              {contest.winners.map((winner, idx) => (
                <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="text-yellow-500">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                  {winner}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          View Details <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function RecentContestsSection() {
  return (
    <section className="py-6 bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-pink-400 font-medium mb-4"
            variants={itemVariants}
          >
            Recent Contests
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            variants={itemVariants}
          >
            Our Programming Battlegrounds
          </motion.h2>
          <motion.p className="text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
            Explore the recent programming contests organized and participated by our club members
          </motion.p>
        </motion.div>

        {/* Contest Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {contests.map((contest, index) => (
            <ContestCard key={contest.id} contest={contest} index={index} />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto">
            View All Contests <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

