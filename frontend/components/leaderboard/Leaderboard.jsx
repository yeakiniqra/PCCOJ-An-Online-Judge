"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Medal,
  Search,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Brain,
  Clock,
  RotateCw,
  Crown,
  User,
  Filter,
  Sparkles,
  Flame,
  BarChart3,
  Users,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import useLeaderboardStore from "@/store/ContestLeaderboard"

export default function ContestLeaderboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contestId = searchParams.get("contest")

  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "total_score", direction: "desc" })
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all") // all, top10, friends

  const { fetchLeaderboard, getLeaderboardByContest, loading, error } = useLeaderboardStore()

  const leaderboard = getLeaderboardByContest(contestId)

  useEffect(() => {
    if (contestId) fetchLeaderboard(contestId)
  }, [contestId, fetchLeaderboard])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const filteredLeaderboard = sortedLeaderboard.filter((entry) => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "top10") {
      return matchesSearch && sortedLeaderboard.indexOf(entry) < 10
    }

    return matchesSearch
  })

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 opacity-75 blur"></div>
          <div className="relative bg-gray-900 rounded-full p-2 border border-yellow-500">
            <Crown className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
      )
    }
    if (index === 1) {
      return (
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 opacity-50 blur"></div>
          <div className="relative bg-gray-900 rounded-full p-2 border border-gray-400">
            <Medal className="h-5 w-5 text-gray-300" />
          </div>
        </div>
      )
    }
    if (index === 2) {
      return (
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 opacity-50 blur"></div>
          <div className="relative bg-gray-900 rounded-full p-2 border border-amber-700">
            <Medal className="h-5 w-5 text-amber-600" />
          </div>
        </div>
      )
    }
    return (
      <div className="h-9 w-9 rounded-full bg-gray-800/70 text-white flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const getScoreColor = (score) => {
    if (score > 800) return "text-yellow-400"
    if (score > 500) return "text-emerald-400"
    if (score > 300) return "text-blue-400"
    return "text-gray-300"
  }

  return (
    <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 opacity-75 blur"></div>
                <div className="relative bg-slate-900 rounded-full p-3">
                  <Trophy className="h-7 w-7 text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500">
                  Contest Leaderboard
                </h1>
                <p className="text-gray-400 text-sm mt-1 font-mono">
                   Current Contest
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </motion.button>

              <motion.button
                onClick={() => fetchLeaderboard(contestId)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-900/30 rounded-full">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Participants</div>
              <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 rounded-full">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Avg. Problems Solved</div>
              <div className="text-2xl font-bold text-white">
                {leaderboard.length > 0
                  ? (leaderboard.reduce((sum, entry) => sum + entry.problems_solved, 0) / leaderboard.length).toFixed(1)
                  : "0"}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-green-900/30 rounded-full">
              <BarChart3 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Highest Score</div>
              <div className="text-2xl font-bold text-yellow-400">
                {leaderboard.length > 0 ? Math.max(...leaderboard.map((entry) => entry.total_score)) : "0"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/50"
                    : "bg-gray-900/60 backdrop-blur-sm border border-gray-800 text-gray-300 hover:bg-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                All
              </motion.button>

              <motion.button
                onClick={() => setActiveTab("top10")}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "top10"
                    ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/50"
                    : "bg-gray-900/60 backdrop-blur-sm border border-gray-800 text-gray-300 hover:bg-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Top 10
              </motion.button>

              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-3">Advanced Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Score</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Problems Solved</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button className="w-full px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-lg transition-colors">
                        Apply Filters
                      </button>
                    </div>
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
              <div className="absolute -inset-4 rounded-full opacity-30 blur animate-pulse bg-yellow-600"></div>
              <Loader2 className="animate-spin h-12 w-12 text-yellow-500 relative" />
            </div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
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
              <h3 className="text-lg font-medium text-red-400 mb-1">Error Loading Leaderboard</h3>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => fetchLeaderboard(contestId)}
                className="mt-3 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-300 text-sm transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredLeaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center my-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Participants Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm
                ? "No participants match your search. Try a different search term."
                : "The leaderboard is currently empty. Check back later for rankings!"}
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

        {/* Leaderboard */}
        {!loading && !error && filteredLeaderboard.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {/* Top 3 Podium (visible on larger screens) */}
            {activeTab !== "top10" && (
              <motion.div variants={itemVariants} className="hidden md:flex justify-center items-end gap-6 mb-8 mt-4">
                {filteredLeaderboard.slice(0, 3).map((entry, idx) => {
                  const heights = ["h-28", "h-24", "h-20"]
                  const positions = [1, 0, 2] // Center, Left, Right
                  const i = positions[idx]

                  return (
                    <motion.div
                      key={entry.username}
                      className="flex flex-col items-center"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
                    >
                      <div className="mb-3 text-center">
                        <div className="font-bold text-white text-lg">{entry.username}</div>
                        <div className={`font-bold text-xl ${getScoreColor(entry.total_score)}`}>
                          {entry.total_score}
                        </div>
                      </div>
                      <div
                        className={`${heights[i]} w-28 rounded-t-lg relative overflow-hidden ${
                          i === 0
                            ? "bg-gradient-to-b from-yellow-500 to-amber-600"
                            : i === 1
                              ? "bg-gradient-to-b from-gray-400 to-gray-500"
                              : "bg-gradient-to-b from-amber-700 to-amber-800"
                        }`}
                      >
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent)]"></div>
                        <div className="absolute top-2 left-0 right-0 flex justify-center">
                          {i === 0 ? (
                            <Crown className="h-8 w-8 text-yellow-200" />
                          ) : (
                            <Medal className="h-7 w-7 text-gray-200" />
                          )}
                        </div>
                        <div className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-xl">
                          {i + 1}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Leaderboard Table */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="grid grid-cols-12 text-sm text-gray-400 p-4 bg-gray-800/50 border-b border-gray-700">
                <div className="col-span-1 font-medium">Rank</div>
                <div
                  className="col-span-3 flex items-center gap-1 cursor-pointer font-medium"
                  onClick={() => handleSort("username")}
                >
                  <User className="h-3.5 w-3.5" />
                  Participant
                  {sortConfig.key === "username" && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {sortConfig.direction === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )}
                    </motion.span>
                  )}
                </div>
                <div
                  className="col-span-2 cursor-pointer font-medium flex items-center gap-1"
                  onClick={() => handleSort("total_score")}
                >
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                  Score
                  {sortConfig.key === "total_score" && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {sortConfig.direction === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )}
                    </motion.span>
                  )}
                </div>
                <div
                  className="col-span-1 flex items-center cursor-pointer font-medium"
                  onClick={() => handleSort("accepted_submissions")}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="hidden sm:inline">Accepted</span>
                  <span className="sm:hidden">AC</span>
                </div>
                <div
                  className="col-span-1 flex items-center gap-1 cursor-pointer font-medium"
                  onClick={() => handleSort("wrong_submissions")}
                >
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                  <span className="hidden sm:inline">Wrong</span>
                  <span className="sm:hidden">WA</span>
                </div>
                <div
                  className="col-span-2 flex items-center gap-1 cursor-pointer font-medium"
                  onClick={() => handleSort("problems_solved")}
                >
                  <Brain className="h-3.5 w-3.5 text-blue-500" />
                  <span className="hidden sm:inline">Problems Solved</span>
                  <span className="sm:hidden">Solved</span>
                </div>
                <div
                  className="col-span-2 flex items-center gap-1 cursor-pointer font-medium"
                  onClick={() => handleSort("average_attempts_per_problem")}
                >
                  <RotateCw className="h-3.5 w-3.5 text-purple-500" />
                  <span className="hidden sm:inline">Avg. Attempts</span>
                  <span className="sm:hidden">Attempts</span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-800/50">
                {filteredLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.username}
                    variants={itemVariants}
                    className={`grid grid-cols-12 items-center p-4 ${
                      index < 3 ? "bg-yellow-900/10" : index % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"
                    } transition-colors hover:bg-gray-800/30`}
                  >
                    <div className="col-span-1 flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: index === 0 ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        {getRankBadge(index)}
                      </motion.div>
                    </div>
                    <div className="col-span-3">
                      <div className="font-medium text-white">{entry.username}</div>
                    </div>
                    <div className="col-span-2">
                      <div className={`font-bold text-lg ${getScoreColor(entry.total_score)}`}>{entry.total_score}</div>
                      {index === 0 && (
                        <div className="flex items-center text-xs text-yellow-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Leader
                        </div>
                      )}
                      {entry.total_score > 800 && index > 0 && (
                        <div className="flex items-center text-xs text-amber-500">
                          <Flame className="h-3 w-3 mr-1" />
                          High score
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 font-medium text-green-500">{entry.accepted_submissions}</div>
                    <div className="col-span-1 font-medium text-red-400">{entry.wrong_submissions}</div>
                    <div className="col-span-2">
                      <div className="font-medium text-blue-400">{entry.problems_solved}</div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(entry.problems_solved / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="col-span-2 font-medium">
                      <div className="flex items-center">
                        <span className="text-purple-400">{entry.average_attempts_per_problem}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Footer */}
        {!loading && !error && filteredLeaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-between items-center text-sm text-gray-400"
          >
            <div>
              Showing {filteredLeaderboard.length} of {leaderboard.length} participants
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: Just now
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
