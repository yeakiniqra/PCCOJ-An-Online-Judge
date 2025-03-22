"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, LinkIcon, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/useAuth"

export default function Register() {
    const { register } = useAuth();
    const [fields, setFields] = useState([
        {
            id: "email",
            label: "your email",
            value: "",
            completed: false,
            type: "email",
            placeholder: "Enter your email address",
        },
        {
            id: "first_name",
            label: "your first name",
            value: "",
            completed: false,
            type: "text",
            placeholder: "Enter your first name",
        },
        {
            id: "last_name",
            label: "your last name",
            value: "",
            completed: false,
            type: "text",
            placeholder: "Enter your last name",
        },
        {
            id: "username",
            label: "your username",
            value: "",
            completed: false,
            type: "text",
            placeholder: "Choose a username",
        },
        {
            id: "password",
            label: "your password",
            value: "",
            completed: false,
            type: "password",
            placeholder: "Create a secure password",
        },
        {
            id: "confirm_password",
            label: "confirm your password",
            value: "",
            completed: false,
            type: "password",
            placeholder: "Confirm your password",
        },
    ])

    const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(true)
    const [typedText, setTypedText] = useState("")
    const [registrationComplete, setRegistrationComplete] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const inputRef = useRef(null)
    const terminalRef = useRef(null)

    const introText = "Hey there! We're excited to have you join us"

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

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [currentFieldIndex, fields])

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
        const currentField = fields[currentFieldIndex]

        if (!currentField.value.trim()) {
            return
        }

        if (currentField.id === "email" && !validateEmail(currentField.value)) {
            setErrorMessage("Invalid email format")
            return
        }

        if (currentField.id === "confirm_password" && currentField.value !== fields[currentFieldIndex - 1].value) {
            setErrorMessage("Passwords do not match")
            return
        }

        setErrorMessage("")
        const newFields = [...fields]
        newFields[currentFieldIndex].completed = true
        setFields(newFields)

        if (currentFieldIndex < fields.length - 1) {
            setCurrentFieldIndex(currentFieldIndex + 1)
        } else {
            handleRegister()
        }
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleRegister = async () => {
        const formData = fields.reduce((acc, field) => {
            acc[field.id] = field.value
            return acc
        }, {})

        const response = await register(formData)

        if (response.success) {
            setRegistrationComplete(true)
        } else {
            setErrorMessage(response.message)
        }
    }

    const getPromptText = (index) => {
        if (index === 0) {
            return "To start, could you give us"
        } else if (index === fields.length - 1) {
            return "Finally,"
        } else {
            const responses = [
                "Great! Now we need",
                "Excellent! Please enter",
                "Awesome! Next, what's",
                "Perfect! Now tell us",
                "Thanks! Please provide",
            ]
            return responses[index % responses.length]
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-2xl bg-[#0d1117] rounded-lg shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-[#161b22] py-2 px-4 flex items-center justify-between border-b border-gray-800">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">register@pccoj.uap-bd.edu</div>
                    <div className="w-4"></div>
                </div>

                <div ref={terminalRef} className="p-6 h-[500px] overflow-y-auto font-mono text-gray-300 bg-[#0d1117]">
                    <div className="mb-4">
                        <span>{typedText}</span>
                        <LinkIcon className="inline-block ml-2 w-4 h-4 text-blue-400" />
                    </div>

                    <div className="border-b border-dashed border-gray-700 my-4"></div>

                    {fields.map(
                        (field, index) =>
                            field.completed && (
                                <div key={field.id} className="mb-6">
                                    <div className="text-gray-400 mb-2">{getPromptText(index)} {field.label}?</div>
                                    <div className="flex items-center text-green-400">
                                        <CheckCircle2 className="inline-block mr-2 w-5 h-5" />
                                        <span className="break-all">{field.type === "password" ? "••••••••" : field.value}</span>
                                    </div>
                                </div>
                            )
                    )}
                    {!registrationComplete ? (
                        <div className="mb-6">
                            <div className="text-gray-400 mb-2">
                                {getPromptText(currentFieldIndex)} {fields[currentFieldIndex].label}?
                            </div>
                            <div className="flex items-center bg-[#1a1d21] rounded p-2">
                                <ChevronRight className="text-green-400 mr-2" />
                                <input
                                    ref={inputRef}
                                    type={fields[currentFieldIndex].type}
                                    value={fields[currentFieldIndex].value}
                                    onChange={handleInputChange}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder={fields[currentFieldIndex].placeholder}
                                    className="bg-transparent border-none outline-none flex-1 text-green-400"
                                    autoFocus
                                />
                            </div>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6"
                        >
                            <div className="text-gray-400 mb-2">Registration complete! Welcome {fields[3].value}.</div>
                            <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4 text-green-400">
                                <div className="flex items-center mb-2">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span className="font-semibold">Account created successfully</span>
                                </div>
                                <p className="text-sm text-green-300">
                                    You can now log in with your credentials and start participating in contests.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-6 rounded-md font-sans font-medium"
                                    onClick={() => (window.location.href = "/login")}
                                >
                                    Continue to Login
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
