"use client"

import { useEffect, useState } from "react"
import { useRouter,useSearchParams  } from "next/navigation"
import { motion } from "framer-motion"
import useFetchProblemStore from "@/store/fetchProblem"
import {
  Loader2,
  Search,
  Code,
  Trophy,
  Users,
  AlertTriangle,
  BarChart2,
  RefreshCw,
} from "lucide-react"


export default function Problems() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contest");
  const { problems, fetchProblems, loading, error } = useFetchProblemStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const handleProblemClick = (id) => {
    router.push(`/problem/${id}`)
  }

  const handleLeaderboardClick = () => {
    router.push(`/contestleaderboard?contest=${contestId}`);
  }

  // Filter problems based on search term and filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty ? problem.difficulty === selectedDifficulty : true
    const matchesTag = selectedTag ? problem.tags.some((tag) => tag.name === selectedTag) : true

    return matchesSearch && matchesDifficulty && matchesTag
  })

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

  return (
    <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur"></div>
                <div className="relative bg-slate-900 rounded-full p-3">
                  <Code className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Contest Problems
                </h1>
                <p className="text-gray-400 text-sm mt-1">Solve all problems to maximize your score</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <motion.button
                onClick={handleLeaderboardClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Leaderboard</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full opacity-30 blur animate-pulse bg-purple-600"></div>
              <Loader2 className="animate-spin h-12 w-12 text-purple-500 relative" />
            </div>
            <p className="mt-4 text-gray-400">Loading problems...</p>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-800 rounded-lg p-6 flex items-start gap-4 my-8"
          >
            <div className="p-2 bg-red-900/40 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-400 mb-1">Error Loading Problems</h3>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => fetchProblems()}
                className="mt-3 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-300 text-sm transition-colors"
              >
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center my-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Problems Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm
                ? "No problems match your search. Try a different search term."
                : "No problems are available yet. Check back soon for new challenges!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Problems list - new design matching the image */}
        {!loading && !error && filteredProblems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                variants={itemVariants}
                className={`border-b border-gray-800 last:border-b-0 ${
                  index % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-white mb-1">{problem.title}</h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
  
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>Submissions : {problem.submission_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BarChart2 className="h-3.5 w-3.5" />
                          <span>Acceptance: {problem.acceptance_rate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleProblemClick(problem.id)}
                      className="px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Solve
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

