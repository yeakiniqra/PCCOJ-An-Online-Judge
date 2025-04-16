"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Terminal,
  Send,
  User,
  Mail,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [commandHistory, setCommandHistory] = useState( []) 
  const [copied, setCopied] = useState(null)

  const welcomeText = "Welcome to the terminal. Please enter your contact information below."
  const formRef = useRef(null)
  const messageRef = useRef(null)

  // Typing animation effect
  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < welcomeText.length) {
        setTypedText(welcomeText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add command to history
      setCommandHistory([
        ...commandHistory,
        `> send_message --from "${name}" --email "${email}" --content "${message.substring(0, 20)}..."`,
      ])

      // Simulate successful submission
      setIsSubmitted(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setError("Error sending message. Please try again.")
      setCommandHistory([...commandHistory, "> ERROR: Connection failed. Try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setCommandHistory([...commandHistory, "> clear_form --reset"])
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset()
      }
    }, 500)
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
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
      {/* Background grid pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-75 blur"></div>
            <div className="relative bg-slate-900 rounded-full p-3">
              <Terminal className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
             Contact Us
          </h1>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden shadow-xl"
        >
          {/* Terminal Title Bar */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-gray-400 font-mono">contact@pccoj.com</div>
            <div className="text-xs text-gray-400 font-mono">bash</div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono">
            {/* Welcome Text with Typing Animation */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <ArrowRight className="h-4 w-4" />
                <span>user@website:~$</span>
              </div>
              <div className="text-gray-300 pl-6">
                {typedText}
                {showCursor && <span className="inline-block w-2 h-5 bg-green-400 ml-1"></span>}
              </div>
            </motion.div>

            {/* Command History */}
            <AnimatePresence>
              {commandHistory.map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-gray-300"
                >
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <ArrowRight className="h-4 w-4" />
                    <span>user@website:~$</span>
                  </div>
                  <div className="pl-6">{cmd}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Contact Form */}
            {!isSubmitted ? (
              <motion.form ref={formRef} variants={itemVariants} onSubmit={handleSubmit} className="space-y-6 mt-6">
                <motion.div variants={itemVariants} className="relative">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <User className="h-4 w-4" />
                    <label htmlFor="name" className="block text-sm font-medium">
                      NAME:
                    </label>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-md py-2 px-4 text-white placeholder-gray-500 font-mono"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Mail className="h-4 w-4" />
                    <label htmlFor="email" className="block text-sm font-medium">
                      EMAIL:
                    </label>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-md py-2 px-4 text-white placeholder-gray-500 font-mono"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <label htmlFor="message" className="block text-sm font-medium">
                      MESSAGE:
                    </label>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    ref={messageRef}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-gray-800/50 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-md py-2 px-4 text-white placeholder-gray-500 font-mono"
                    placeholder="Type your message here..."
                  ></textarea>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-mono py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/20 border border-red-800 rounded-md p-3 flex items-start gap-2"
                  >
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400">{error}</p>
                    </div>
                  </motion.div>
                )}
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-green-900/20 border border-green-800 rounded-md p-6 mt-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-900/40 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium text-green-400">Message Sent Successfully!</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Thank you for your message. We&apos;ll get back to you as soon as possible.
                </p>
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <ArrowRight className="h-4 w-4" />
                  <span>user@website:~$</span>
                </div>
                <div className="pl-6 text-gray-300 mb-4">
                  <span className="text-green-400">Message</span> sent to server with ID:{" "}
                  <span className="text-yellow-400">#MSG-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-mono py-2 px-4 rounded-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Send Another Message</span>
                </button>
              </motion.div>
            )}

            {/* Alternative Contact Methods */}
            <motion.div variants={itemVariants} className="mt-12 border-t border-gray-800 pt-6">
              <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>ALTERNATIVE_CONTACT_METHODS</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Mail className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Email</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("contact@example.com", "email")}
                      className="p-1 hover:bg-gray-700 rounded-md"
                      title="Copy to clipboard"
                    >
                      {copied === "email" ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-300 font-mono">contact@example.com</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <MessageSquare className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("+1 (555) 123-4567", "phone")}
                      className="p-1 hover:bg-gray-700 rounded-md"
                      title="Copy to clipboard"
                    >
                      {copied === "phone" ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-300 font-mono">+1 (555) 123-4567</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="mt-8">
              <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>CONNECT_SOCIAL</span>
              </h3>

              <div className="flex flex-wrap gap-3">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>

           
          </div>
        </motion.div>

        {/* Terminal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          <p>Type your message above and hit send to connect with us.</p>
          <p className="mt-1">
            Response time: <span className="text-green-400">~24 hours</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
