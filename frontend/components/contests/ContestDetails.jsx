"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import useFetchContest from "@/store/useFetchContest"
import { Calendar, Clock, Timer, Users, Award, BookOpen, Star, Globe, ArrowLeft, PlayCircle } from "lucide-react"


export default function ContestDetails() {
    const { id } = useParams()
    const router = useRouter()
    const { contestDetails, fetchContestById, contestDetailsLoading } = useFetchContest();
    const [contest, setContest] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState("")
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (id) {
            fetchContestById(id); // Pass the correct ID to fetchContestById
        }
    }, [id, fetchContestById]);

    // Function to convert minutes to hours and minutes format
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        const remainingMinutes = minutes % 60

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes > 0 ? `${remainingMinutes} min` : ""}`
        } else {
            return `${remainingMinutes} minutes`
        }
    }

    // Calculate time remaining and progress
    useEffect(() => {
        if (!contestDetails) return

        const updateTimeAndProgress = () => {
            const now = new Date().getTime()
            const startTime = new Date(contestDetails.start_time).getTime()
            const endTime = new Date(contestDetails.end_time).getTime()

            // Calculate progress percentage
            const totalDuration = endTime - startTime
            const elapsed = now - startTime
            const calculatedProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
            setProgress(calculatedProgress)

            // Calculate time remaining
            if (now < startTime) {
                const timeToStart = startTime - now
                const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24))
                const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60))
                setTimeRemaining(`Starts in: ${days}d ${hours}h ${minutes}m`)
            } else if (now < endTime) {
                const timeToEnd = endTime - now
                const days = Math.floor(timeToEnd / (1000 * 60 * 60 * 24))
                const hours = Math.floor((timeToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((timeToEnd % (1000 * 60 * 60)) / (1000 * 60))
                setTimeRemaining(`Ends in: ${days}d ${hours}h ${minutes}m`)
            } else {
                setTimeRemaining("Contest has ended")
            }
        }

        updateTimeAndProgress()
        const interval = setInterval(updateTimeAndProgress, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [contestDetails])

    // Function to determine status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "upcoming":
                return "from-blue-500 to-cyan-400"
            case "ongoing":
                return "from-green-500 to-emerald-400"
            case "completed":
                return "from-purple-500 to-indigo-400"
            default:
                return "from-gray-500 to-gray-400"
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

    if (contestDetailsLoading || !contestDetails) {
        return (
            <div className="min-h-screen relative bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="relative z-10 text-center">
                    <motion.div
                        className="flex space-x-3 mb-6"
                        animate={{
                            y: [0, -10, 0],
                            transition: {
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                    <motion.p
                        className="text-xl font-medium text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Loading contest details...
                    </motion.p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative bg-slate-950 pt-6">
            {/* Background pattern */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 pt-12">
                {/* Back button */}
                <motion.button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                    whileHover={{ x: -5 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Contests
                </motion.button>

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {/* Header section */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                                {contestDetails.title}
                            </h1>

                            <div
                                className={`px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(contestDetails.status)} text-white flex items-center`}
                            >
                                <span className="relative flex h-3 w-3 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                {contestDetails.status.charAt(0).toUpperCase() + contestDetails.status.slice(1)}
                            </div>
                        </div>

                        <div className="text-xl text-gray-300 font-medium">{timeRemaining}</div>
                    </motion.div>

                    {/* Progress bar */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Start: {new Date(contestDetails.start_time).toLocaleString()}</span>
                            <span>End: {new Date(contestDetails.end_time).toLocaleString()}</span>
                        </div>
                        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className="text-sm text-gray-400">{Math.round(progress)}% completed</span>
                        </div>
                    </motion.div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Contest details */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                            {/* Contest info card */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                                    Contest Information
                                </h2>

                                <div className="space-y-4">
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-gray-300 font-medium mb-2">Description</h3>
                                        <p className="text-gray-400">{contestDetails.description}</p>
                                    </div>

                                    {/* Rules */}
                                    <div>
                                        <h3 className="text-gray-300 font-medium mb-2">Rules</h3>
                                        {contestDetails.rules.split("\r\n").map((rule, index) => (
                                            <p key={index} className="text-gray-400">
                                                {rule}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline visualization */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-pink-400" />
                                    Contest Timeline
                                </h2>

                                <div className="relative pt-6">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-700"></div>

                                    {/* Start time */}
                                    <div className="relative flex items-center mb-8">
                                        <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="ml-12">
                                            <h3 className="text-gray-300 font-medium">Contest Starts</h3>
                                            <p className="text-gray-400 text-sm">{new Date(contestDetails.start_time).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="relative flex items-center mb-8">
                                        <div className="absolute left-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                            <Timer className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="ml-12">
                                            <h3 className="text-gray-300 font-medium">Contest Duration</h3>
                                            <p className="text-gray-400 text-sm">{formatDuration(contestDetails.duration)}</p>
                                        </div>
                                    </div>

                                    {/* End time */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="ml-12">
                                            <h3 className="text-gray-300 font-medium">Contest Ends</h3>
                                            <p className="text-gray-400 text-sm">{new Date(contestDetails.end_time).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right column - Stats and actions */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            {/* Participate button */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
                                <motion.button
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Participate Now
                                </motion.button>

                                <p className="text-gray-400 text-sm mt-3">
                                    Join {contestDetails.participants_count} other participants in this contest!
                                </p>
                            </div>

                            {/* Contest stats */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                                    Contest Stats
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-gray-300">
                                            <Users className="w-4 h-4 mr-2 text-blue-400" />
                                            <span>Participants</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-white font-medium">{contestDetails.participants_count}</span>
                                            <span className="text-gray-400 text-sm ml-1">/ {contestDetails.max_participants}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-gray-300">
                                            <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                            <span>Rated</span>
                                        </div>
                                        <div>
                                            {contestDetails.is_rated ? (
                                                <span className="text-green-400">Yes</span>
                                            ) : (
                                                <span className="text-red-400">No</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-gray-300">
                                            <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                                            <span>Visibility</span>
                                        </div>
                                        <div>
                                            {contestDetails.is_public ? (
                                                <span className="text-green-400">Public</span>
                                            ) : (
                                                <span className="text-yellow-400">Private</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-gray-300">
                                            <Timer className="w-4 h-4 mr-2 text-purple-400" />
                                            <span>Duration</span>
                                        </div>
                                        <div className="text-white">{formatDuration(contestDetails.duration)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Countdown timer */}
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-pink-400" />
                                    Contest Status
                                </h2>

                                <div className="text-center">
                                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                                        {timeRemaining}
                                    </div>

                                    <div className="text-gray-400 text-sm">
                                        {contestDetails.status === "upcoming"
                                            ? "Get ready for the contest!"
                                            : contestDetails.status === "ongoing"
                                                ? "Contest is live now!"
                                                : "Contest has ended."}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

