"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Calendar, Code2, BookOpen, Network } from "lucide-react"
import { getGroqChatCompletion } from "@/services/Grok"
import { motion } from "framer-motion"

const predefinedQuestions = [
    {
        text: "When is the next Codeforces contest?",
        icon: <Calendar className="w-3 h-3" />,
    },
    {
        text: "What's the best way to practice dynamic programming?",
        icon: <Code2 className="w-3 h-3" />,
    },
    {
        text: "How do I get started with Competitive Programming?",
        icon: <BookOpen className="w-3 h-3" />,
    },
    {
        text: "What's the difference between BFS and DFS?",
        icon: <Network className="w-3 h-3" />,
    },
]

export default function FloatingChatbot() {
    // States
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [shouldScroll, setShouldScroll] = useState(true)

    // Essential refs
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const chatContainerRef = useRef(null)

    // Handle scrolling behavior
    useEffect(() => {
        if (shouldScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, shouldScroll])

    // Focus input when chat opens
    useEffect(() => {
        if (open) {
            setShouldScroll(true) // Always scroll when opening
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus()
            }, 100)
        }
    }, [open])

    // Handle send message
    const handleSend = async (msg) => {
        const userMsg = msg || input.trim()
        if (!userMsg || loading) return

        // Set scroll to true when sending a message
        setShouldScroll(true)
        setMessages((prev) => [...prev, { role: "user", content: userMsg }])
        setInput("")
        setLoading(true)

        try {
            const botReply = await getGroqChatCompletion(userMsg)
            setMessages((prev) => [...prev, { role: "assistant", content: botReply }])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I couldn't process your request. Please try again later.",
                    error: true,
                },
            ])
            console.error("Error getting chat completion:", error)
        } finally {
            setLoading(false)
        }
    }

    // Toggle chat open/closed
    const toggleChat = () => {
        setOpen(!open)
    }

    // Handle input change without affecting scroll
    const handleInputChange = (e) => {
        setInput(e.target.value)
        // Disable scrolling during typing
        setShouldScroll(false)
    }

    // Handle chat container scroll
    const handleChatScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
            const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10
            setShouldScroll(isScrolledToBottom)
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 flex items-end justify-end">
            {/* Chat Window */}
            {open && (
                <div className="absolute bottom-16 right-0 w-80 max-h-[500px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 opacity-100 translate-y-0 scale-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-5 py-4 font-medium flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <MessageCircle className="w-5 h-5 text-purple-300" />
                            </div>
                            <span className="font-semibold">PCC AI Assistant</span>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-900"
                        onScroll={handleChatScroll}
                    >
                        {messages.length === 0 && (
                            <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <MessageCircle className="w-6 h-6 text-purple-400" />
                                </div>
                                <p className="text-sm mb-1">How can I help you today?</p>
                                <p className="text-xs text-gray-500">Ask me anything about competitive programming</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                        ? "bg-purple-700 text-white rounded-tr-none"
                                        : msg.error
                                            ? "bg-red-900/40 border border-red-800 text-red-200 rounded-tl-none"
                                            : "bg-gray-800 text-gray-100 rounded-tl-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-gray-800 text-gray-100 rounded-tl-none flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                    <span className="text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Predefined Questions */}
                    {messages.length === 0 && (
                        <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/80">
                            <div className="text-xs text-gray-400 mb-2">Try asking:</div>
                            <div className="grid grid-cols-2 gap-2">
                                {predefinedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q.text)}
                                        className="bg-gray-800 hover:bg-gray-700 text-left text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-colors group"
                                    >
                                        <div className="p-1 bg-gray-700 rounded-full text-purple-400 group-hover:bg-purple-900/50">
                                            {q.icon}
                                        </div>
                                        <span className="line-clamp-1 text-gray-300">{q.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-gray-800 bg-gray-900 flex gap-2 items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && input.trim()) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            onClick={() => setShouldScroll(false)} // Prevent scroll on input click
                            placeholder="Ask something..."
                            className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 placeholder:text-gray-500 transition-all"
                            autoFocus
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${loading || !input.trim()
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                                }`}
                        >
                            <Send size={16} className={loading ? "opacity-50" : ""} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <div className="relative">
                {open && (
                    <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-30" />
                )}
                <motion.button
                    onClick={toggleChat}
                    className={`p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${open
                        ? "bg-gray-900 text-purple-400 border border-gray-800"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        }`}
                    style={{
                        boxShadow: open ? "0 0 20px rgba(139, 92, 246, 0.3)" : "0 10px 25px -5px rgba(139, 92, 246, 0.5)",
                    }}
                
                    animate={{
                        y: [0, -10, 0],
                        scale: open ? 1 : [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                    }}
                    initial={{ scale: 1 }}
                    whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={{ rotate: open ? 0 : [0, 15, -15, 15, -15, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: open ? 0 : Infinity,
                            repeatDelay: 4
                        }}
                    >
                        <MessageCircle size={24} />
                    </motion.div>
                </motion.button>
            </div>
        </div>
    )
}