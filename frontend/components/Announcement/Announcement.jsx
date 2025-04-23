"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Bell,
  Calendar,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  BookOpen,
  Megaphone,
  AlertCircle,
  Info,
  Star,
  Zap,
  BookmarkPlus,
} from "lucide-react"


const contestAnnouncements = [
  
  {
    id: 2,
    title: "Weekly Coding Challenge",
    date: "Every Friday",
    time: "06:00 PM",
    location: "Online",
    description:
      "Participate in our weekly coding challenges to sharpen your skills. This week's focus is on dynamic programming. Top performers will be featured on our leaderboard and earn special badges.",
    isNew: true,
    isImportant: false,
    registrationLink: "https://example.com/weekly-challenge",
    tags: ["Weekly", "Coding", "Challenge"],
  },
  {
    id: 3,
    title: "Inter-University Programming Contest",
    date: "June 10, 2025",
    time: "10:00 AM - 04:00 PM",
    location: "Virtual Event",
    description:
      "Represent our university in the annual inter-university programming contest. Preliminary selections will be held on May 25. The contest will feature algorithmic problems of varying difficulty levels.",
    isNew: false,
    isImportant: true,
    registrationLink: "https://example.com/inter-university-contest",
    tags: ["Competition", "Team", "Algorithms"],
  },
  {
    id: 4,
    title: "Competitive Programming Workshop",
    date: "April 28, 2025",
    time: "02:00 PM - 05:00 PM",
    location: "Computer Lab 3",
    description:
      "A hands-on workshop on competitive programming strategies. Learn efficient algorithms, time complexity analysis, and problem-solving approaches. Bring your laptops with your preferred programming environment set up.",
    isNew: false,
    isImportant: false,
    registrationLink: "https://example.com/cp-workshop",
    tags: ["Workshop", "Learning", "Algorithms"],
  },
]

const trainingNotifications = [
  {
    id: 1,
    title: "Advanced Data Structures Workshop",
    date: "April 30, 2025",
    time: "03:00 PM - 06:00 PM",
    location: "7th Floor, Lab 2",
    description:
      "Deep dive into advanced data structures including Segment Trees, Fenwick Trees, and Disjoint Set Union. This workshop is aimed at intermediate programmers looking to enhance their problem-solving toolkit.",
    isNew: true,
    isImportant: true,
    instructor: "Nafiul Islam ",
    prerequisites: ["Basic data structures knowledge", "Proficiency in any programming language"],
    tags: ["Workshop", "Data Structures", "Advanced"],
  },
  {
    id: 2,
    title: "Introduction to Data Structures and Algorithms",
    date: "Starting May 5, 2025",
    time: "Every Tuesday, 04:00 PM - 06:00 PM",
    location: "Online (Zoom)",
    description:
      "A six-week series covering the fundamentals of machine learning. Topics include regression, classification, clustering, neural networks, and practical applications. Hands-on exercises will be provided.",
    isNew: true,
    isImportant: false,
    instructor: "Nafiul Islam",
    prerequisites: ["Basic Python knowledge", "Understanding of linear algebra"],
    tags: ["Series", "Machine Learning", "Beginner"],
  },
  {
    id: 3,
    title: "Codeforces Practice Session",
    date: "May 2, 2025",
    time: "01:00 PM - 03:00 PM",
    location: "Gaming Lab, 7th Floor",
    description:
      "Learn the essentials of version control with Git and collaboration using GitHub. This hands-on session will cover creating repositories, branching, merging, pull requests, and resolving conflicts.",
    isNew: false,
    isImportant: false,
    instructor: "Arafat kabir",
    prerequisites: ["Basic command line knowledge"],
    tags: ["Workshop", "Version Control", "Collaboration"],
  }
]

const platformAnnouncements = [
  {
    id: 1,
    title: "Platform Maintenance",
    date: "April 25, 2025",
    time: "02:00 AM - 06:00 AM",
    description:
      "The platform will be undergoing scheduled maintenance. During this time, all services including submissions, contests, and the forum will be unavailable. Please plan accordingly.",
    isNew: true,
    isImportant: true,
    affectedServices: ["Submissions", "Contests", "Forum", "Leaderboard"],
    tags: ["Maintenance", "Downtime", "Important"],
  },
  {
    id: 2,
    title: "New Problem Set Released",
    date: "April 20, 2025",
    description:
      "We've added 50 new problems across various difficulty levels and topics. The new problems focus on graph algorithms, dynamic programming, and string manipulation. Check them out in the practice section!",
    isNew: true,
    isImportant: false,
    tags: ["New Content", "Practice", "Problems"],
  },
  {
    id: 3,
    title: "UI/UX Improvements",
    date: "April 15, 2025",
    description:
      "We've updated the user interface with improved navigation, dark mode support, and better mobile responsiveness. The code editor now features enhanced syntax highlighting and auto-completion.",
    isNew: false,
    isImportant: false,
    tags: ["Update", "UI/UX", "Features"],
  },
  {
    id: 4,
    title: "New Ranking System",
    date: "May 1, 2025",
    description:
      "We're introducing a new ranking system that better reflects problem difficulty and solving speed. Your current rating will be migrated to the new system. Check the documentation for details on how the new system works.",
    isNew: false,
    isImportant: true,
    tags: ["Update", "Ranking", "System Change"],
  },
]

export default function Announcement() {
  const [activeTab, setActiveTab] = useState("contests")

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

  const tabVariants = {
    inactive: { borderBottom: "2px solid rgba(75, 85, 99, 0)" },
    active: { borderBottom: "2px solid rgba(139, 92, 246, 1)" },
  }

  const [expandedAnnouncements, setExpandedAnnouncements] = useState({
    contests: [],
    training: [],
    platform: [],
  })

  const toggleExpand = (tab, id) => {
    setExpandedAnnouncements((prev) => {
      const isExpanded = prev[tab].includes(id)
      return {
        ...prev,
        [tab]: isExpanded ? prev[tab].filter((item) => item !== id) : [...prev[tab], id],
      }
    })
  }

  const renderAnnouncements = () => {
    let announcements
    let icon

    switch (activeTab) {
      case "contests":
        announcements = contestAnnouncements
        icon = <Trophy className="h-5 w-5 text-purple-400" />
        break
      case "training":
        announcements = trainingNotifications
        icon = <BookOpen className="h-5 w-5 text-blue-400" />
        break
      case "platform":
        announcements = platformAnnouncements
        icon = <Megaphone className="h-5 w-5 text-green-400" />
        break
    }

    return (
      <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {announcements.map((announcement) => {
          const isExpanded = expandedAnnouncements[activeTab].includes(announcement.id)

          return (
            <motion.div
              key={announcement.id}
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="p-4 cursor-pointer" onClick={() => toggleExpand(activeTab, announcement.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        announcement.isImportant ? "bg-purple-900/30 text-purple-400" : "bg-gray-800/80 text-gray-400"
                      }`}
                    >
                      {announcement.isImportant ? <Star className="h-5 w-5" /> : icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{announcement.title}</h3>
                        {announcement.isNew && (
                          <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                        {announcement.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{announcement.date}</span>
                          </div>
                        )}
                        {announcement.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{announcement.time}</span>
                          </div>
                        )}
                        {announcement.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{announcement.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`p-1 rounded-full transition-colors ${
                      isExpanded ? "bg-purple-900/30 text-purple-400" : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {isExpanded ? (
                      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <Zap className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ rotate: 180 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                        <Zap className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2">
                      <div className="border-t border-gray-800 pt-4">
                        <p className="text-gray-300 mb-4">{announcement.description}</p>

                        {/* Conditional content based on announcement type */}
                        {activeTab === "contests" && (
                          <div className="mt-4">
                            {announcement.registrationLink && (
                              <a
                                href={announcement.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Register Now</span>
                              </a>
                            )}
                          </div>
                        )}

                        {activeTab === "training" && (
                          <div className="mt-4 space-y-3">
                            {announcement.instructor && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-400" />
                                <span className="text-gray-300">
                                  <span className="font-medium">Instructor:</span> {announcement.instructor}
                                </span>
                              </div>
                            )}
                            {announcement.prerequisites && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Info className="h-4 w-4 text-blue-400" />
                                  <span className="text-gray-300 font-medium">Prerequisites:</span>
                                </div>
                                <ul className="list-disc list-inside text-gray-300 pl-6 space-y-1">
                                  {announcement.prerequisites.map((prereq, index) => (
                                    <li key={index}>{prereq}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === "platform" && (
                          <div className="mt-4">
                            {announcement.affectedServices && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                                  <span className="text-gray-300 font-medium">Affected Services:</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {announcement.affectedServices.map((service, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs"
                                    >
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tags for all announcement types */}
                        {announcement.tags && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {announcement.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-800/80 text-gray-300 rounded-md text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Save/Bookmark button for all types */}
                        <div className="mt-4 flex justify-end">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm transition-colors">
                            <BookmarkPlus className="h-4 w-4" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      {/* Background grid pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur"></div>
              <div className="relative bg-slate-900 rounded-full p-3">
                <Bell className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Announcements
            </h1>
          </div>
          <p className="text-gray-400 ml-16">Stay updated with the latest news and events</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-800">
          <div className="flex space-x-8">
            <motion.button
              variants={tabVariants}
              animate={activeTab === "contests" ? "active" : "inactive"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("contests")}
              className={`pb-2 px-1 flex items-center gap-2 ${
                activeTab === "contests" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Contest Announcements</span>
            </motion.button>

            <motion.button
              variants={tabVariants}
              animate={activeTab === "training" ? "active" : "inactive"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("training")}
              className={`pb-2 px-1 flex items-center gap-2 ${
                activeTab === "training" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Training Notifications</span>
            </motion.button>

            <motion.button
              variants={tabVariants}
              animate={activeTab === "platform" ? "active" : "inactive"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("platform")}
              className={`pb-2 px-1 flex items-center gap-2 ${
                activeTab === "platform" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Megaphone className="h-5 w-5" />
              <span className="font-medium">Platform Announcements</span>
            </motion.button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAnnouncements()}
          </motion.div>
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-900/30 rounded-full">
              <Trophy className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Contest Announcements</div>
              <div className="text-2xl font-bold text-white">{contestAnnouncements.length}</div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Training Notifications</div>
              <div className="text-2xl font-bold text-white">{trainingNotifications.length}</div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-green-900/30 rounded-full">
              <Megaphone className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Platform Announcements</div>
              <div className="text-2xl font-bold text-white">{platformAnnouncements.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <p>
            Last updated: <span className="text-purple-400">April 22, 2025</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
