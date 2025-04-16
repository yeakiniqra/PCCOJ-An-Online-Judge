"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import usePracticeProblemStore from "@/store/PracticeproblemStore"
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  BarChart2,
  Award,
  Zap,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Hash,
  Tag,
} from "lucide-react"

export default function PracticeProblem() {
  const { problems, fetchProblems, loading, error } = usePracticeProblemStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

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
        return { bg: "bg-green-100", text: "text-green-800", icon: <Zap className="h-4 w-4 text-green-600" /> }
      case "Medium":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Zap className="h-4 w-4 text-yellow-600" /> }
      case "Hard":
        return { bg: "bg-red-100", text: "text-red-800", icon: <Zap className="h-4 w-4 text-red-600" /> }
      default:
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <Zap className="h-4 w-4 text-blue-600" /> }
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
    <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8" >
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
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
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4"
          >
            Practice Problems
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Sharpen your coding skills with our collection of practice problems. From easy to hard, we have challenges
            for every skill level.
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
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <button className="p-3 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors">
                <Filter className="h-5 w-5" />
              </button>
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

        {/* Problems list */}
        {!loading && !error && filteredProblems.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
              >
                <Link href={`/practice/${problem.slug}`} className="flex flex-col md:flex-row">
                  {/* Middle - Problem details */}
                  <div className="flex-grow p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <h2 className="text-xl font-bold text-white mb-2 md:mb-0">{problem.title}</h2>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getDifficultyColor(problem.difficulty).bg
                        } ${getDifficultyColor(problem.difficulty).text}`}
                      >
                        {getDifficultyColor(problem.difficulty).icon}
                        <span className="ml-1">{problem.difficulty}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-400">Points</div>
                          <div className="font-medium text-white">{problem.points}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-400">Submissions</div>
                          <div className="font-medium text-white">{problem.submission_count}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-400">Acceptance</div>
                          <div className="font-medium text-white">{problem.acceptance_rate.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs"
                        >
                          <Tag className="h-3 w-3 mr-1 text-purple-400" />
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Action button */}
                  <div className="md:w-24 bg-gray-800/30 flex items-center justify-center p-4 md:p-0">
                    <div className="flex items-center justify-center h-full w-full group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/20 group-hover:bg-purple-600/40 transition-colors">
                        <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats summary */}
        {!loading && !error && filteredProblems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-gray-400 text-sm"
          >
            Showing {filteredProblems.length} of {problems.length} problems
          </motion.div>
        )}
      </div>
    </div>
  )
}
