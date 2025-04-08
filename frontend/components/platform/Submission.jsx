"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSubmissionStore from "@/store/SubmissionHistoryStore"
import {
  Clock,
  Code,
  FileCode,
  CheckCircle,
  XCircle,
  Calendar,
  HardDrive,
  Star,
  Cpu,
  X,
  ChevronRight,
  Search,
  SortAsc,
  SortDesc,
  Copy,
  Check,
  Terminal,
  Zap,
  History,
  ExternalLink,
} from "lucide-react"
import Editor from "@monaco-editor/react"

export default function SubmissionHistory() {
  const { 
    submissions, 
    fetchAllSubmissions, 
    fetchSubmissionById, 
    selectedSubmission, 
    clearSelectedSubmission,
    loading,
    error
  } = useSubmissionStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // "asc" or "desc"
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("code") // "code" or "testcases"

  // Debug logging
  useEffect(() => {
    console.log("Current submissions in store:", submissions);
  }, [submissions]);

  useEffect(() => {
    fetchAllSubmissions()
  }, [])

  const handleSubmissionClick = async (id) => {
    await fetchSubmissionById(id)
    setModalOpen(true)
    setActiveTab("code")
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => {
      clearSelectedSubmission()
    }, 300) // Clear after animation completes
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter and sort submissions
  const filteredSubmissions = submissions && submissions.length > 0
    ? submissions
        .filter((sub) => {
          const matchesSearch = sub.problem_title?.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesStatus = statusFilter ? sub.status === statusFilter : true
          return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
          const dateA = new Date(a.submitted_at).getTime()
          const dateB = new Date(b.submitted_at).getTime()
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB
        })
    : []

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get language name from ID
  const getLanguageName = (id) => {
    const languages = {
      109: "Python 3.11.2",
      100: "Python 3.12.5",
      71: "Python 3.8.1",
      76: "C++ (Clang 7.0.1)",
      103: "C (GCC 14.1.0)",
      62: "Java (OpenJDK 13.0.1)",
      93: "JavaScript (Node.js 18.15.0)",
    }
    return languages[id] || `Language ID: ${id}`
  }

  // Get language for Monaco editor
  const getEditorLanguage = (langId) => {
    const langName = getLanguageName(langId).toLowerCase()
    if (langName.includes("python")) return "python"
    if (langName.includes("c++")) return "cpp"
    if (langName.includes("c (")) return "c"
    if (langName.includes("java")) return "java"
    if (langName.includes("javascript")) return "javascript"
    return "plaintext"
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen relative bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen relative bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-slate-950 py-8 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '6rem' }}>
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
                  <History className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Submission History
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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

              <div className="flex gap-2">
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
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                  title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
                >
                  {sortOrder === "desc" ? (
                    <SortDesc className="h-5 w-5 text-gray-300" />
                  ) : (
                    <SortAsc className="h-5 w-5 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {!submissions || submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
              <FileCode className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You haven't submitted any solutions yet. Solve some problems to see your submission history here.
            </p>
          </motion.div>
        ) : filteredSubmissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center"
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
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
            {filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleSubmissionClick(submission.id)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode className="h-5 w-5 text-purple-400" />
                        <h2 className="font-semibold text-lg text-white">{submission.problem_title}</h2>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(submission.submitted_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Code className="h-3.5 w-3.5" />
                          <span>{getLanguageName(submission.language)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                            submission.status === "Accepted"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {submission.status === "Accepted" ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          <span>{submission.status}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalOpen && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSubmission.problem_title}</h2>
                  <div className="flex items-center gap-x-4 mt-1 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(selectedSubmission.submitted_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5" />
                      <span>{getLanguageName(selectedSubmission.language)}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedSubmission.status === "Accepted"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {selectedSubmission.status === "Accepted" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      <span>{selectedSubmission.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
                    activeTab === "code"
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
                    activeTab === "testcases"
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  Test Cases
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === "code" ? (
                  <div className="relative">
                    <Editor
                      height="60vh"
                      language={getEditorLanguage(selectedSubmission.language)}
                      value={selectedSubmission.code}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
                        fontSize: 14,
                        minimap: { enabled: true },
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(selectedSubmission.code)}
                      className="absolute top-2 right-2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded text-white text-sm flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Performance</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>Execution Time</span>
                              </div>
                              <span className="text-white font-mono">
                                {selectedSubmission.execution_time}s
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <HardDrive className="h-4 w-4 text-gray-400" />
                                <span>Memory Used</span>
                              </div>
                              <span className="text-white font-mono">
                                {selectedSubmission.memory_used} MB
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Star className="h-4 w-4 text-gray-400" />
                                <span>Score</span>
                              </div>
                              <span className="text-white font-mono">{selectedSubmission.score}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Summary</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Passed</span>
                              </div>
                              <span className="text-white font-mono">
                                {selectedSubmission.testcase_results?.filter(tc => tc.status === "Accepted").length || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <XCircle className="h-4 w-4 text-red-400" />
                                <span>Failed</span>
                              </div>
                              <span className="text-white font-mono">
                                {selectedSubmission.testcase_results?.filter(tc => tc.status !== "Accepted").length || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Cpu className="h-4 w-4 text-gray-400" />
                                <span>Total Tests</span>
                              </div>
                              <span className="text-white font-mono">
                                {selectedSubmission.testcase_results?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-white mb-3">Test Case Results</h3>
                        <div className="space-y-3">
                          {selectedSubmission.testcase_results && selectedSubmission.testcase_results.length > 0 ? (
                            selectedSubmission.testcase_results.map((tc) => (
                              <div
                                key={tc.id || tc.testcase_id}
                                className={`p-4 rounded-lg border ${
                                  tc.status === "Accepted"
                                    ? "border-green-800 bg-green-900/20"
                                    : "border-red-800 bg-red-900/20"
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    {tc.status === "Accepted" ? (
                                      <CheckCircle className="h-5 w-5 text-green-400" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-400" />
                                    )}
                                    <h4 className="text-white font-medium">
                                      Test Case {tc.testcase_id} {tc.is_sample && "(Sample)"}
                                    </h4>
                                  </div>
                                  <span
                                    className={`text-sm px-2 py-0.5 rounded-full ${
                                      tc.status === "Accepted"
                                        ? "bg-green-900/50 text-green-400"
                                        : "bg-red-900/50 text-red-400"
                                    }`}
                                  >
                                    {tc.status}
                                  </span>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <div className="font-medium text-gray-300 mb-1">Your Output:</div>
                                    <pre className="bg-gray-900/70 p-2 rounded text-gray-300 font-mono text-xs overflow-x-auto">
                                      {tc.output !== null ? tc.output : <span className="italic text-gray-500">No output</span>}
                                    </pre>
                                  </div>
                                  
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{tc.execution_time}s</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <HardDrive className="h-3.5 w-3.5" />
                                    <span>{tc.memory_used} MB</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-6 text-gray-400">
                              No test case results available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with actions */}
              <div className="border-t border-gray-800 p-4 flex justify-between">
                <div>
                  {selectedSubmission.problem_id && (
                    <a
                      href={`/problem/${selectedSubmission.problem_id}`}
                      className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    >
                      <FileCode className="h-4 w-4" />
                      View Problem
                    </a>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}