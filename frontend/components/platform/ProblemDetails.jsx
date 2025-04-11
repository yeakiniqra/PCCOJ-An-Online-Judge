"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Editor from "@monaco-editor/react"
import useFetchProblemStore from "@/store/fetchProblem"
import useCodeSubmissionStore from "@/store/SubmitStore"
import {
  Code,
  FileCode,
  Play,
  Clock,
  HardDrive,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  BookOpen,
  FileInput,
  FileOutput,
  AlertCircle,
  Lightbulb,
  Loader2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react"

// Language options with simplified boilerplate code
const languageOptions = [
  {
    id: 109,
    name: "Python 3.11.2",
    boilerplate: `# Your solution starts here
# Read input from stdin and print output to stdout

def solve():
    # Read input
    n = int(input())
    
    # TODO: Implement your solution
    
    # Output result
    print("Your answer")

solve()
`,
  },
  {
    id: 100,
    name: "Python 3.12.5",
    boilerplate: `# Your solution starts here
# Read input from stdin and print output to stdout

def solve():
    # Read input
    n = int(input())
    
    # TODO: Implement your solution
    
    # Output result
    print("Your answer")

solve()
`,
  },
  {
    id: 71,
    name: "Python 3.8.1",
    boilerplate: `# Your solution starts here
# Read input from stdin and print output to stdout

def solve():
    # Read input
    n = int(input())
    
    # TODO: Implement your solution
    
    # Output result
    print("Your answer")

solve()
`,
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
    boilerplate: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Read input
    int n;
    cin >> n;
    
    // TODO: Implement your solution
    
    // Output result
    cout << "Your answer" << endl;
    
    return 0;
}
`,
  },
  {
    id: 103,
    name: "C (GCC 14.1.0)",
    boilerplate: `#include <stdio.h>

int main() {
    // Read input
    int n;
    scanf("%d", &n);
    
    // TODO: Implement your solution
    
    // Output result
    printf("Your answer\\n");
    
    return 0;
}
`,
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        
        // TODO: Implement your solution
        
        // Output result
        System.out.println("Your answer");
        
        sc.close();
    }
}
`,
  },
  {
    id: 93,
    name: "JavaScript (Node.js 18.15.0)",
    boilerplate: `// Read input from stdin and print output to stdout

let input = '';

process.stdin.on('end', () => {
    // Parse input
    const lines = input.trim().split('\\n');
    
    // TODO: Implement your solution
    
    // Output result
    console.log("Your answer");
});
`,
  },
]

export default function ProblemDetails() {
  const { id } = useParams()
  const { problemDetails, fetchProblemById, loading, error } = useFetchProblemStore()
  const { submitCode, result, loading: submitting, error: submitError, resetSubmissionState } = useCodeSubmissionStore()

  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0])
  const [code, setCode] = useState(languageOptions[0].boilerplate)
  const [localResult, setLocalResult] = useState(null)
  const [activeSection, setActiveSection] = useState("problem") // "problem" or "testcases"
  const [copied, setCopied] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    statement: true,
    inputFormat: true,
    outputFormat: true,
    constraints: true,
    sampleInput: true,
    sampleOutput: true,
    explanation: true,
  })

  useEffect(() => {
    if (id) {
      fetchProblemById(id)
      resetSubmissionState()
    }
  }, [id, fetchProblemById, resetSubmissionState])

  useEffect(() => {
    if (result) {
      setLocalResult(result)
    }
  }, [result])

  const handleLanguageChange = (e) => {
    const langId = Number(e.target.value)
    const newLang = languageOptions.find((lang) => lang.id === langId)
    setSelectedLanguage(newLang)
    setCode(newLang.boilerplate)
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Code cannot be empty")
      return
    }

    try {
      const response = await submitCode({ problemId: id, code, language: selectedLanguage.id })
      if (response) {
        setLocalResult(response)
      }
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatOutput = (text) => {
    if (!text) return ""
    return text.replace(/\\n/g, "\n")
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  // Display either the store result or local result, whichever is available
  const displayResult = result || localResult

  // Get language mode for Monaco editor
  const getEditorLanguage = () => {
    const langName = selectedLanguage.name.toLowerCase()
    if (langName.includes("python")) return "python"
    if (langName.includes("c++")) return "cpp"
    if (langName.includes("c (")) return "c"
    if (langName.includes("java")) return "java"
    if (langName.includes("javascript")) return "javascript"
    return "plaintext"
  }

  return (
    <div className="min-h-screen relative bg-slate-950" style={{ paddingTop: '6rem' }}>
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Left: Problem Details */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 w-full space-y-4 bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-white">
                {loading ? "Loading..." : problemDetails?.title}
              </h1>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSection("problem")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeSection === "problem"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setActiveSection("testcases")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeSection === "testcases"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Results
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-400">Error Loading Problem</h3>
                  <p className="text-gray-300 text-sm">{error}</p>
                  <button
                    onClick={() => fetchProblemById(id)}
                    className="mt-2 px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-red-300 text-sm flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeSection === "problem" && problemDetails && (
                  <div className="space-y-4">
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
                            <div
                              className="p-4 text-gray-300 whitespace-pre-wrap select-none"
                              style={{ userSelect: "none" }}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              {problemDetails.statement}
                            </div>
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
                            <div
                              className="p-4 text-gray-300 whitespace-pre-wrap select-none"
                              style={{ userSelect: "none" }}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              {problemDetails.input_format}
                            </div>
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
                            <div
                              className="p-4 text-gray-300 whitespace-pre-wrap select-none"
                              style={{ userSelect: "none" }}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              {problemDetails.output_format}
                            </div>
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
                            <div className="p-4 text-gray-300 whitespace-pre-wrap">{problemDetails.constraints}</div>
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
                              copyToClipboard(problemDetails.sample_input)
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                            title="Copy to clipboard"
                          >
                            {copied ? (
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
                              {formatOutput(problemDetails.sample_input)}
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
                              copyToClipboard(problemDetails.sample_output)
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                            title="Copy to clipboard"
                          >
                            {copied ? (
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
                              {formatOutput(problemDetails.sample_output)}
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Explanation (if available) */}
                    {problemDetails.explanation && (
                      <div className="border border-gray-800 rounded-lg overflow-hidden">
                        <div
                          className="flex justify-between items-center p-3 bg-gray-800/60 cursor-pointer"
                          onClick={() => toggleSection("explanation")}
                        >
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                            <h2 className="font-medium text-white">Explanation</h2>
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
                              <div className="p-4 text-gray-300 whitespace-pre-wrap">{problemDetails.explanation}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "testcases" && (
                  <div className="space-y-4">
                    {!displayResult ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-gray-800/60 rounded-full mb-4">
                          <Code className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
                        <p className="text-gray-400 max-w-md">
                          Submit your code to see the results of your solution against the test cases.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-gray-800/40">
                          <div
                            className={`flex-shrink-0 p-3 rounded-full ${displayResult.status === "Accepted"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                              }`}
                          >
                            {displayResult.status === "Accepted" ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <XCircle className="h-6 w-6" />
                            )}
                          </div>

                          <div className="flex-grow">
                            <h3
                              className={`text-lg font-medium ${displayResult.status === "Accepted" ? "text-green-400" : "text-red-400"
                                }`}
                            >
                              {displayResult.status}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-gray-300">Time: {displayResult.execution_time}s</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HardDrive className="h-4 w-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Memory: {displayResult.memory_used} MB</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">Score: {displayResult.score}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                          <Cpu className="h-5 w-5 text-purple-400" />
                          Testcase Results
                        </h3>

                        <div className="space-y-4">
                          {displayResult.testcase_results?.map((tc) => (
                            <div
                              key={tc.id}
                              className={`p-4 rounded-lg border ${tc.status === "Accepted"
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
                                    className={`font-medium ${tc.status === "Accepted" ? "text-green-400" : "text-red-400"
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
                                    {formatOutput(tc.output)}
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
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Right: Code Editor & Submission */}
          <motion.div variants={itemVariants} className="lg:w-1/2 w-full flex flex-col gap-4">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-purple-400" />
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

              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <Editor
                  height="60vh"
                  language={getEditorLanguage()}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                  }}
                  className="border-gray-800"
                />
              </div>

              <div className="mt-4 flex justify-end gap-4">
                <motion.button
                  onClick={handleSubmit}
                  disabled={submitting || !code.trim()}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-colors ${submitting || !code.trim()
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
                      <Play className="h-5 w-5" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => router.push('/submission')}
                  className="px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>See Submissions</span>
                </motion.button>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm flex items-start gap-2"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
