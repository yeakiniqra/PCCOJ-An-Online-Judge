"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import useFetchProblemStore from "@/store/fetchProblem"
import {
  Loader2,
  Search,
  Code,
  Zap,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { FaSearch } from "react-icons/fa"


export default function Problems() {
  const router = useRouter()
  const { problems, fetchProblems, loading, error } = useFetchProblemStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const handleProblemClick = (id) => {
    router.push(`/problem/${id}`)
  }

  // Filter problems based on search term and filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty ? problem.difficulty === selectedDifficulty : true
    const matchesTag = selectedTag ? problem.tags.some((tag) => tag.name === selectedTag) : true

    return matchesSearch && matchesDifficulty && matchesTag
  })

  // Get all unique tags from problems
  const allTags = [...new Set(problems.flatMap((problem) => problem.tags.map((tag) => tag.name)))]

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-500 to-emerald-400"
      case "Medium":
        return "from-yellow-500 to-amber-400"
      case "Hard":
        return "from-red-500 to-rose-400"
      default:
        return "from-blue-500 to-indigo-400"
    }
  }

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

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur"></div>
              <div className="relative bg-slate-900 rounded-full p-3">
                <Code className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4"
          >
            Solve Problems
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Challenge yourself with a variety of coding problems. Filter by difficulty and tags to find the perfect challenge for you.
          </motion.p>
        </motion.div>

        {/* Search and filter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-100" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
              {(selectedDifficulty || selectedTag) && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Filter Problems</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                      <div className="flex flex-wrap gap-2">
                        {["Easy", "Medium", "Hard"].map((difficulty) => (
                          <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? "" : difficulty)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedDifficulty === difficulty
                                ? `bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white`
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {difficulty}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedTag === tag
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedDifficulty("")
                        setSelectedTag("")
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              {searchTerm || selectedDifficulty || selectedTag
                ? "No problems match your current filters. Try adjusting your search criteria."
                : "No problems are available yet. Check back soon for new challenges!"}
            </p>
            {(searchTerm || selectedDifficulty || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDifficulty("")
                  setSelectedTag("")
                }}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Problems grid */}
        {!loading && !error && filteredProblems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)",
                  transition: { duration: 0.2 },
                }}
                className="relative overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl"
              >
                {/* Difficulty indicator */}
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r z-10 rounded-t-xl"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      problem.difficulty === "Easy"
                        ? "#10b981, #34d399"
                        : problem.difficulty === "Medium"
                          ? "#f59e0b, #fbbf24"
                          : "#ef4444, #f87171"
                    })`,
                  }}
                />

                <div
                  onClick={() => handleProblemClick(problem.id)}
                  className="p-6 cursor-pointer h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white`}
                    >
                      {problem.difficulty}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center p-2 bg-gray-800/60 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-400 mb-1" />
                      <span className="text-sm font-medium text-white">{problem.points}</span>
                      <span className="text-xs text-gray-400">Points</span>
                    </div>

                    <div className="flex flex-col items-center p-2 bg-gray-800/60 rounded-lg">
                      <Code className="h-4 w-4 text-blue-400 mb-1" />
                      <span className="text-sm font-medium text-white">{problem.submission_count}</span>
                      <span className="text-xs text-gray-400">Submissions</span>
                    </div>

                    <div className="flex flex-col items-center p-2 bg-gray-800/60 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-400 mb-1" />
                      <span className="text-sm font-medium text-white">{problem.acceptance_rate}%</span>
                      <span className="text-xs text-gray-400">Acceptance</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-800">
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 transition-colors group">
                      <span>
                        View Problem
                      </span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-xl"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

