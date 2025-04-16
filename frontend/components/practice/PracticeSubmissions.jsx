"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Editor } from "@monaco-editor/react"
import usePracticeSubmitStore from "@/store/PracticeSubmit"
import {
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Code,
  Calendar,
  Search,
  ArrowLeft,
  Eye,
  Terminal,
  FileCode,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  AlertTriangle,
  X,
  ExternalLink,
  FileInput,
  FileOutput,
  Cpu,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

export default function PracticeSubmissions() {
  const router = useRouter()
  const { fetchSubmissions, fetchSubmissionDetail, submissions,submissionDetail,submissionResult, loading, error } =
    usePracticeSubmitStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "submitted_at", direction: "desc" })
  const [activeTab, setActiveTab] = useState("code") // "code" or "testcases"
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const openModal = async (id) => {
    await fetchSubmissionDetail(id)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesSearch = sub.problem_title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter ? sub.status === statusFilter : true
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-green-900/20",
          text: "text-green-400",
          border: "border-green-700/50",
          icon: <CheckCircle className="h-4 w-4" />,
        }
      case "Wrong Answer":
        return {
          bg: "bg-red-900/20",
          text: "text-red-400",
          border: "border-red-700/50",
          icon: <XCircle className="h-4 w-4" />,
        }
      case "Time Limit Exceeded":
        return {
          bg: "bg-yellow-900/20",
          text: "text-yellow-400",
          border: "border-yellow-700/50",
          icon: <Clock className="h-4 w-4" />,
        }
      case "Memory Limit Exceeded":
        return {
          bg: "bg-orange-900/20",
          text: "text-orange-400",
          border: "border-orange-700/50",
          icon: <HardDrive className="h-4 w-4" />,
        }
      case "Runtime Error":
        return {
          bg: "bg-purple-900/20",
          text: "text-purple-400",
          border: "border-purple-700/50",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      default:
        return {
          bg: "bg-blue-900/20",
          text: "text-blue-400",
          border: "border-blue-700/50",
          icon: <Code className="h-4 w-4" />,
        }
    }
  }

  // Get language for Monaco editor
  const getEditorLanguage = (langDisplay) => {
    if (!langDisplay) return "plaintext"; // Default to "plaintext" if langDisplay is undefined
    const langName = langDisplay.toLowerCase();
    if (langName.includes("python")) return "python";
    if (langName.includes("c++")) return "cpp";
    if (langName.includes("c (")) return "c";
    if (langName.includes("java")) return "java";
    if (langName.includes("javascript")) return "javascript";
    return "plaintext";
  };

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

  return (
    <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => router.push("/practice")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </motion.button>

              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Submission History
                </h1>
                <p className="text-gray-400 text-sm mt-1">View and analyze your past submissions</p>
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

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                <option value="Runtime Error">Runtime Error</option>
              </select>

              <button
                onClick={() => fetchSubmissions()}
                className="p-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                title="Refresh submissions"
              >
                <RefreshCw className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && !modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full opacity-30 blur animate-pulse bg-purple-600"></div>
              <Loader2 className="animate-spin h-12 w-12 text-purple-500 relative" />
            </div>
            <p className="mt-4 text-gray-400">Loading submissions...</p>
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
              <h3 className="text-lg font-medium text-red-400 mb-1">Error Loading Submissions</h3>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => fetchSubmissions()}
                className="mt-3 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-300 text-sm transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && submissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center my-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
              <FileCode className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You haven't submitted any solutions yet. Solve some problems to see your submission history here.
            </p>
            <button
              onClick={() => router.push("/practice")}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
            >
              Practice Problems
            </button>
          </motion.div>
        )}

        {/* No results state */}
        {!loading && !error && submissions.length > 0 && filteredSubmissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center my-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Matching Submissions</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No submissions match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
              }}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Submissions table */}
        {!loading && !error && filteredSubmissions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/80">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("problem_title")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Problem</span>
                        {sortConfig.key === "problem_title" && (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        {sortConfig.key === "status" && (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Language
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("execution_time")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Time</span>
                        {sortConfig.key === "execution_time" && (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("memory_used")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Memory</span>
                        {sortConfig.key === "memory_used" && (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("submitted_at")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Submitted</span>
                        {sortConfig.key === "submitted_at" && (
                          <span>
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredSubmissions.map((submission, index) => (
                    <motion.tr
                      key={submission.id}
                      variants={itemVariants}
                      className={`${index % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"} hover:bg-gray-800/30`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{submission.problem_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(submission.status_display).bg
                          } ${getStatusColor(submission.status_display).text} ${
                            getStatusColor(submission.status_display).border
                          }`}
                        >
                          {getStatusColor(submission.status_display).icon}
                          <span className="ml-1">{submission.status_display}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Code className="h-4 w-4 mr-1 text-blue-400" />
                          {submission.language_display}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="h-4 w-4 mr-1 text-yellow-400" />
                          {submission.execution_time}s
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <HardDrive className="h-4 w-4 mr-1 text-purple-400" />
                          {submission.memory_used} MB
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-1 text-green-400" />
                          {formatDate(submission.submitted_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(submission.id)}
                          className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination or summary */}
        {!loading && !error && filteredSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-between items-center text-sm text-gray-400"
          >
            <div>
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: Just now
            </div>
          </motion.div>
        )}

        {/* Modal for Submission Details */}
        <AnimatePresence>
          {modalOpen && submissionDetail && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        getStatusColor(submissionDetail.status_display).bg
                      } ${getStatusColor(submissionDetail.status_display).border}`}
                    >
                      {getStatusColor(submissionDetail.status_display).icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Submission Details</h2>
                      <p className="text-sm text-gray-400">
                        Problem: <span className="text-purple-400">{submissionDetail.problem_title}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Tabs */}
                <div className="flex border-b border-gray-800">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "code"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("code")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <span>Code</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "testcases"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("testcases")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <span>Test Cases</span>
                    </div>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-grow overflow-auto">
                  {activeTab === "code" ? (
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-300">
                            <Code className="h-4 w-4 text-blue-400" />
                            <span>{submissionDetail.language_display}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-300">
                            <Calendar className="h-4 w-4 text-green-400" />
                            <span>{formatDate(submissionDetail.submitted_at)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(submissionDetail.code)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="border border-gray-800 rounded-lg overflow-hidden">
                        <Editor
                          height="50vh"
                          language={getEditorLanguage(submissionDetail.language_display)}
                          value={submissionDetail.code}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800/60 rounded-lg p-4 flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                            <div className={`p-1 rounded-full ${getStatusColor(submissionDetail.status_display).bg}`}>
                              {getStatusColor(submissionDetail.status_display).icon}
                            </div>
                            <span>Status</span>
                          </div>
                          <div
                            className={`text-lg font-medium ${getStatusColor(submissionDetail.status_display).text}`}
                          >
                            {submissionDetail.status_display}
                          </div>
                        </div>

                        <div className="bg-gray-800/60 rounded-lg p-4 flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span>Execution Time</span>
                          </div>
                          <div className="text-lg font-medium text-white">{submissionDetail.execution_time}s</div>
                        </div>

                        <div className="bg-gray-800/60 rounded-lg p-4 flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                            <HardDrive className="h-4 w-4 text-purple-400" />
                            <span>Memory Used</span>
                          </div>
                          <div className="text-lg font-medium text-white">{submissionDetail.memory_used} MB</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-purple-400" />
                        Test Case Results
                      </h3>

                      {submissionDetail.testcases?.length > 0 ? (
                        <div className="space-y-4">
                          {submissionDetail.testcases.map((tc, idx) => (
                            <div
                              key={tc.id}
                              className={`p-4 rounded-lg border ${
                                tc.status === "Accepted"
                                  ? "border-green-700/50 bg-green-900/10"
                                  : "border-red-700/50 bg-red-900/10"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {tc.status === "Accepted" ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  <span
                                    className={`font-medium ${
                                      tc.status === "Accepted" ? "text-green-400" : "text-red-400"
                                    }`}
                                  >
                                    {tc.is_sample ? "Sample Testcase" : "Hidden Testcase"} #{idx + 1}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400">Status: {tc.status}</div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                    <FileInput className="h-4 w-4 text-blue-400" />
                                    <span>Input</span>
                                  </div>
                                  <pre className="p-3 bg-gray-800/50 rounded text-xs text-gray-300 whitespace-pre overflow-x-auto max-h-40">
                                    {tc.input}
                                  </pre>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                    <FileOutput className="h-4 w-4 text-green-400" />
                                    <span>Expected Output</span>
                                  </div>
                                  <pre className="p-3 bg-gray-800/50 rounded text-xs text-gray-300 whitespace-pre overflow-x-auto max-h-40">
                                    {tc.expected_output}
                                  </pre>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                                    <Terminal className="h-4 w-4 text-purple-400" />
                                    <span>Your Output</span>
                                  </div>
                                  <pre className="p-3 bg-gray-800/50 rounded text-xs text-gray-300 whitespace-pre overflow-x-auto max-h-40">
                                    {tc.output}
                                  </pre>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">Time: {tc.execution_time}s</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <HardDrive className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm text-gray-300">Memory: {tc.memory_used} MB</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 text-center">
                          <Terminal className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">No test case results available for this submission.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Submission ID: <span className="text-gray-300">#{submissionDetail.id}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => router.push("/practice")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Problem</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
