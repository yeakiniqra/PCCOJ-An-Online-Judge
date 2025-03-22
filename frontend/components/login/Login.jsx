"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, AlertCircle, Lock, LogIn } from "lucide-react"


export default function Login() {
    const [fields, setFields] = useState([
        {
            id: "username",
            label: "your username",
            value: "",
            completed: false,
            type: "text",
            placeholder: "Enter your username",
        },
        {
            id: "password",
            label: "your password",
            value: "",
            completed: false,
            type: "password",
            placeholder: "Enter your password",
        },
    ])

    const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(true)
    const [typedText, setTypedText] = useState("")
    const [loginStatus, setLoginStatus] = useState("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const inputRef = useRef(null)
    const terminalRef = useRef(null)

    // Text to be typed for the intro
    const introText = "Welcome back! Please log in to continue"

    // Handle typing animation for intro text
    useEffect(() => {
        if (isTyping) {
            if (typedText.length < introText.length) {
                const timeout = setTimeout(() => {
                    setTypedText(introText.slice(0, typedText.length + 1))
                }, 50)
                return () => clearTimeout(timeout)
            } else {
                setIsTyping(false)
            }
        }
    }, [typedText, isTyping])

    // Auto-focus the input field and scroll to bottom when current field changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }

        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [currentFieldIndex, fields, loginStatus])

    const handleInputChange = (e) => {
        const newFields = [...fields]
        newFields[currentFieldIndex].value = e.target.value
        setFields(newFields)
    }

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            completeCurrentField()
        }
    }

    const completeCurrentField = () => {
        // Validate current field
        const currentField = fields[currentFieldIndex]

        if (!currentField.value.trim()) {
            return // Don't proceed if field is empty
        }

        // Mark current field as completed
        const newFields = [...fields]
        newFields[currentFieldIndex].completed = true
        setFields(newFields)

        // Move to next field or attempt login
        if (currentFieldIndex < fields.length - 1) {
            setCurrentFieldIndex(currentFieldIndex + 1)
        } else {
            attemptLogin()
        }
    }

    const attemptLogin = () => {
        setLoginStatus("processing")

        // Simulate API call with timeout
        setTimeout(() => {
            const username = fields[0].value
            const password = fields[1].value

            // This is a mock validation - in a real app, you would call your auth API
            if (username === "demo" && password === "password") {
                setLoginStatus("success")
            } else {
                setLoginStatus("error")
                setErrorMessage("Invalid username or password. Please try again.")

                // Reset fields for retry
                const newFields = [...fields]
                newFields.forEach((field) => {
                    field.completed = false
                    field.value = ""
                })
                setFields(newFields)
                setCurrentFieldIndex(0)
            }
        }, 1500)
    }

    const getPromptText = (index) => {
        if (index === 0) {
            return "Please enter"
        } else {
            return "Now, enter"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-800 to-blue-900 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-2xl bg-[#0a1929] rounded-lg shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Terminal header */}
                <div className="bg-[#0f2942] py-2 px-4 flex items-center justify-between border-b border-blue-900">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-cyan-400 text-sm font-mono">login@pccoj.uap-bd.edu</div>
                    <div className="w-4"></div>
                </div>

                {/* Terminal content */}
                <div ref={terminalRef} className="p-6 h-[400px] overflow-y-auto font-mono text-cyan-100 bg-[#0a1929]">
                    {/* Intro text with typing animation */}
                    <div className="mb-4">
                        <span>{typedText}</span>
                        <Lock className="inline-block ml-2 w-4 h-4 text-cyan-400" />
                    </div>

                    <div className="border-b border-dashed border-blue-800 my-4"></div>

                    {/* Completed fields */}
                    {fields.map(
                        (field, index) =>
                            field.completed && (
                                <div key={field.id} className="mb-6">
                                    <div className="text-cyan-300 mb-2">
                                        {getPromptText(index)} {field.label}:
                                    </div>
                                    <div className="flex items-center text-cyan-400">
                                        <CheckCircle2 className="inline-block mr-2 w-5 h-5" />
                                        <span className="break-all">{field.type === "password" ? "••••••••" : field.value}</span>
                                    </div>
                                </div>
                            ),
                    )}

                    {/* Current field */}
                    {loginStatus === "idle" && currentFieldIndex < fields.length && (
                        <div className="mb-6">
                            <div className="text-cyan-300 mb-2">
                                {getPromptText(currentFieldIndex)} {fields[currentFieldIndex].label}:
                            </div>
                            <div className="flex items-center bg-[#0c2137] rounded p-2">
                                <ChevronRight className="text-cyan-400 mr-2" />
                                <input
                                    ref={inputRef}
                                    type={fields[currentFieldIndex].type}
                                    value={fields[currentFieldIndex].value}
                                    onChange={handleInputChange}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder={fields[currentFieldIndex].placeholder}
                                    className="bg-transparent border-none outline-none flex-1 text-cyan-400"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Processing state */}
                    {loginStatus === "processing" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-cyan-300">
                            <div className="mr-2 w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Authenticating...</span>
                        </motion.div>
                    )}

                    {/* Error state */}
                    {loginStatus === "error" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4 text-red-300">
                                <div className="flex items-center mb-2">
                                    <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                                    <span className="font-semibold">Authentication Failed</span>
                                </div>
                                <p className="text-sm">{errorMessage}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Success state */}
                    {loginStatus === "success" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6"
                        >
                            <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4 text-green-300">
                                <div className="flex items-center mb-2">
                                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                                    <span className="font-semibold">Login Successful</span>
                                </div>
                                <p className="text-sm">
                                    Welcome back, {fields[0].value}! You are now being redirected to the dashboard.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-6 rounded-md font-sans font-medium flex items-center"
                                    onClick={() => (window.location.href = "/contests")}
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Continue to Contests
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Command history hint */}
                    <div className="mt-8 text-xs text-cyan-600 italic">Tip: Press Enter to submit each field.</div>
                </div>
            </motion.div>
        </div>
    )
}

