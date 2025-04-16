"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Editor } from "@monaco-editor/react"
import usePracticeProblemStore from "@/store/PracticeproblemStore"
import usePracticeSubmitStore from "@/store/PracticeSubmit"
import {
  BookOpen,
  Code,
  Terminal,
  FileInput,
  FileOutput,
  AlertCircle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  History,
  ArrowLeft,
  Play,
  Zap,
  Award,
  Tag,
  Info,
  Cpu,
  BarChart2,
  Eye,
} from "lucide-react"

const languageOptions = [
  { id: 109, name: "Python 3.11.2", language: "python" },
  { id: 100, name: "Python 3.12.5", language: "python" },
  { id: 71, name: "Python 3.8.1", language: "python" },
  { id: 76, name: "C++ (Clang 7.0.1)", language: "cpp" },
  { id: 103, name: "C (GCC 14.1.0)", language: "c" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", language: "java" },
  { id: 93, name: "JavaScript (Node.js 18.15.0)", language: "javascript" },
]

const boilerplateCode = {
  python: `# Write your solution here

def solve():
    # Your code here
    pass

if __name__ == "__main__":
    T = int(input())
    for t in range(T):
        # Parse input
        # Call solve
        print(f"Case {t+1}: {result}")
`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

void solve() {
    // Your code here
}

int main() {
    int T;
    cin >> T;
    for(int t = 1; t <= T; t++) {
        // Parse input
        // Call solve
        cout << "Case " << t << ": " << result << endl;
    }
    return 0;
}`,
  c: `#include <stdio.h>

void solve() {
    // Your code here
}

int main() {
    int T;
    scanf("%d", &T);
    for(int t = 1; t <= T; t++) {
        // Parse input
        // Call solve
        printf("Case %d: %s\\n", t, result);
    }
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void solve() {
        // Your code here
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int T = scanner.nextInt();
        for(int t = 1; t <= T; t++) {
            // Parse input
            // Call solve
            System.out.println("Case " + t + ": " + result);
        }
        scanner.close();
    }
}`,
  javascript: `// Write your solution here

function solve() {
    // Your code here
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    const T = parseInt(lines[0]);
    let lineIndex = 1;
    
    for(let t = 1; t <= T; t++) {
        // Parse input from lines[lineIndex++]
        // Call solve
        console.log(\`Case \${t}: \${result}\`);
    }
});`,
}

export default function PracticeProblemDetails() {
  const router = useRouter()
  const { slug } = useParams()
  const { problemDetail: problem, fetchProblemDetail, loading, error } = usePracticeProblemStore()
  const { submitPracticeCode, submissionResult, submitting, resetSubmission } = usePracticeSubmitStore()

  const [activeTab, setActiveTab] = useState("problem")
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0])
  const [code, setCode] = useState(boilerplateCode.python)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState({ input: false, output: false })
  const [expandedSections, setExpandedSections] = useState({
    statement: true,
    inputFormat: true,
    outputFormat: true,
    constraints: true,
    sampleInput: true,
    sampleOutput: true,
    explanation: true,
    editorial: false,
  })

  useEffect(() => {
    if (slug) {
      fetchProblemDetail(slug)
      resetSubmission()
    }
  }, [slug, fetchProblemDetail, resetSubmission])

  useEffect(() => {
    // Set code based on selected language
    setCode(boilerplateCode[selectedLanguage.language] || "")
  }, [selectedLanguage])

  const handleLanguageChange = (e) => {
    const langId = Number(e.target.value)
    const newLang = languageOptions.find((lang) => lang.id === langId)
    if (newLang) {
      setSelectedLanguage(newLang)
    }
  }

  const handleSubmit = async () => {
    if (!problem || !code.trim()) return
    await submitPracticeCode({
      problemId: problem.id, 
      code,
      language: selectedLanguage.id,
    })
    setActiveTab("results")
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-700/50" }
      case "Medium":
        return { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-700/50" }
      case "Hard":
        return { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-700/50" }
      default:
        return { bg: "bg-blue-900/20", text: "text-blue-400", border: "border-blue-700/50" }
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
        {/* Back button and navigation */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => router.push("/practice")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Problems</span>
          </motion.button>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-3">
            <button
              onClick={() => router.push(`/practice/${slug}/submissions/`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <History className="h-4 w-4 text-purple-400" />
              <span>See Submissions</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bookmarked
                  ? "bg-purple-900/20 text-purple-400 border border-purple-700/50"
                  : "bg-gray-900/60 backdrop-blur-sm border border-gray-800 text-white hover:bg-gray-800"
              }`}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full opacity-30 blur animate-pulse bg-purple-600"></div>
              <Loader2 className="animate-spin h-12 w-12 text-purple-500 relative" />
            </div>
            <p className="mt-4 text-gray-400">Loading problem details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 flex items-start gap-4 my-8">
            <div className="p-2 bg-red-900/40 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-400 mb-1">Error Loading Problem</h3>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => fetchProblemDetail(slug)}
                className="mt-3 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-300 text-sm transition-colors flex items-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        ) : problem ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left Panel - Problem Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Problem Header */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{problem.title}</h1>
                    <div className="flex flex-wrap gap-3 items-center">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getDifficultyColor(problem.difficulty).bg
                        } ${getDifficultyColor(problem.difficulty).text} ${
                          getDifficultyColor(problem.difficulty).border
                        }`}
                      >
                        <Zap className="h-4 w-4 inline mr-1" />
                        {problem.difficulty}
                      </div>

                      <div className="flex items-center text-gray-400">
                        <Award className="h-4 w-4 text-yellow-500 mr-1" />
                        {problem.points} points
                      </div>

                      <div className="flex items-center text-gray-400">
                        <Eye className="h-4 w-4 text-blue-400 mr-1" />
                        {problem.view_count} views
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center">
                      <BarChart2 className="h-3 w-3 mr-1 text-blue-400" />
                      Submissions
                    </div>
                    <div className="text-lg font-bold text-white">{problem.submission_count}</div>
                  </div>

                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                      Solved
                    </div>
                    <div className="text-lg font-bold text-white">{problem.solve_count}</div>
                  </div>

                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-yellow-400" />
                      Time Limit
                    </div>
                    <div className="text-lg font-bold text-white">{problem.time_limit}s</div>
                  </div>

                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center">
                      <HardDrive className="h-3 w-3 mr-1 text-purple-400" />
                      Memory
                    </div>
                    <div className="text-lg font-bold text-white">{problem.memory_limit} MB</div>
                  </div>
                </div>
              </div>

              {/* Problem Content Tabs */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-800">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "problem"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("problem")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Problem</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "editorial"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("editorial")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Editorial</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "results"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("results")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <span>Results</span>
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "problem" && (
                      <motion.div
                        key="problem"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {/* Problem Statement */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("statement")}
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-purple-400" />
                              <h2 className="font-medium text-white">Problem Statement</h2>
                            </div>
                            {expandedSections.statement ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedSections.statement && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.statement}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Input Format */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("inputFormat")}
                          >
                            <div className="flex items-center gap-2">
                              <FileInput className="h-4 w-4 text-blue-400" />
                              <h2 className="font-medium text-white">Input Format</h2>
                            </div>
                            {expandedSections.inputFormat ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedSections.inputFormat && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.input_format}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Output Format */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("outputFormat")}
                          >
                            <div className="flex items-center gap-2">
                              <FileOutput className="h-4 w-4 text-green-400" />
                              <h2 className="font-medium text-white">Output Format</h2>
                            </div>
                            {expandedSections.outputFormat ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedSections.outputFormat && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.output_format}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Constraints */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("constraints")}
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-400" />
                              <h2 className="font-medium text-white">Constraints</h2>
                            </div>
                            {expandedSections.constraints ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedSections.constraints && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.constraints}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Sample Input */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("sampleInput")}
                          >
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-cyan-400" />
                              <h2 className="font-medium text-white">Sample Input</h2>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(problem.sample_input, "input")
                                }}
                                className="p-1 hover:bg-gray-700 rounded"
                                title="Copy to clipboard"
                              >
                                {copied.input ? (
                                  <Check className="h-3.5 w-3.5 text-green-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                                )}
                              </button>
                              {expandedSections.sampleInput ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedSections.sampleInput && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <pre className="p-4 bg-gray-800/30 text-sm text-gray-300 whitespace-pre overflow-x-auto">
                                  {problem.sample_input}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Sample Output */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                            onClick={() => toggleSection("sampleOutput")}
                          >
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-pink-400" />
                              <h2 className="font-medium text-white">Sample Output</h2>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(problem.sample_output, "output")
                                }}
                                className="p-1 hover:bg-gray-700 rounded"
                                title="Copy to clipboard"
                              >
                                {copied.output ? (
                                  <Check className="h-3.5 w-3.5 text-green-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                                )}
                              </button>
                              {expandedSections.sampleOutput ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedSections.sampleOutput && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <pre className="p-4 bg-gray-800/30 text-sm text-gray-300 whitespace-pre overflow-x-auto">
                                  {problem.sample_output}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Explanation */}
                        {problem.explanation && (
                          <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <div
                              className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                              onClick={() => toggleSection("explanation")}
                            >
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-400" />
                                <h2 className="font-medium text-white">Notes</h2>
                              </div>
                              {expandedSections.explanation ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <AnimatePresence>
                              {expandedSections.explanation && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.explanation}</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "editorial" && (
                      <motion.div
                        key="editorial"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div className="flex items-center p-3 bg-gray-800/60">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-400" />
                              <h2 className="font-medium text-white">Solution Approach</h2>
                            </div>
                          </div>
                          <div className="p-4 text-gray-300 whitespace-pre-wrap">{problem.editorial}</div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "results" && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {submissionResult ? (
                          <div className="space-y-6">
                            <div
                              className={`p-4 rounded-lg border ${
                                submissionResult.status === "Accepted"
                                  ? "border-green-700/50 bg-green-900/10"
                                  : "border-red-700/50 bg-red-900/10"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {submissionResult.status === "Accepted" ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  <span
                                    className={`font-medium ${
                                      submissionResult.status === "Accepted" ? "text-green-400" : "text-red-400"
                                    }`}
                                  >
                                    {submissionResult.status}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                  Submitted: {new Date(submissionResult.submitted_at).toLocaleString()}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">
                                    Time: {submissionResult.execution_time}s
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <HardDrive className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm text-gray-300">
                                    Memory: {submissionResult.memory_used} MB
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Code className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm text-gray-300">
                                    Language: {submissionResult.language_display}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                              <Cpu className="h-5 w-5 text-purple-400" />
                              Testcase Results
                            </h3>

                            <div className="space-y-4">
                              {submissionResult.testcases?.map((tc) => (
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
                                        {tc.is_sample ? "Sample Testcase" : "Hidden Testcase"}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-400">Status: {tc.status}</div>
                                  </div>

                                  {tc.output !== null && (
                                    <div className="mt-2">
                                      <div className="text-sm font-medium text-gray-300 mb-1">Your Output:</div>
                                      <pre className="p-3 bg-gray-800/50 rounded text-sm text-gray-300 whitespace-pre overflow-x-auto">
                                        {tc.output}
                                      </pre>
                                    </div>
                                  )}

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
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 bg-gray-800/60 rounded-full mb-4">
                              <Terminal className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
                            <p className="text-gray-400 max-w-md">
                              Submit your code to see the results of your solution against the test cases.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Code Editor */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-400" />
                    <h2 className="font-medium text-white">Code Editor</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Language:</label>
                    <select
                      className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedLanguage.id}
                      onChange={handleLanguageChange}
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-b border-gray-800">
                  <Editor
                    height="60vh"
                    language={selectedLanguage.language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <Cpu className="h-4 w-4 inline mr-1" />
                    Make sure your code handles all test cases
                  </div>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting || !code.trim()}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-colors ${
                      submitting || !code.trim()
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    }`}
                    whileHover={!submitting && code.trim() ? { scale: 1.02 } : {}}
                    whileTap={!submitting && code.trim() ? { scale: 0.98 } : {}}
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Solution</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="h-4 w-4 text-green-400" />
                  <h3 className="font-medium text-white">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                    <span>Read the problem statement carefully and understand all constraints.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                    <span>Test your solution with the provided sample inputs before submitting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                    <span>Consider edge cases and optimize your solution for performance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                    <span>Check the editorial if you're stuck or after solving for alternative approaches.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
