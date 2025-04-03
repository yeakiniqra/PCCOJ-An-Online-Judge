"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import useFetchContest from "@/store/useFetchContest"
import { Calendar, Clock, Award, ChevronRight, Timer } from "lucide-react"

export default function Contests() {
    const { contests, fetchContests, loading, error } = useFetchContest()
    const router = useRouter()

    useEffect(() => {
        fetchContests()
    }, [fetchContests])

    // Function to convert minutes to hours and minutes format
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours === 0) {
            return `${remainingMinutes} minutes`
        } else if (remainingMinutes === 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}`
        } else {
            return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`
        }
    }

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

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    // Item animation variants
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

    // Loader animation variants
    const loaderVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
            },
        },
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-tl from-rose-200 to-indigo-600 flex flex-col items-center justify-center p-6">
                <div className="text-center">
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
                                variants={loaderVariants}
                                animate="animate"
                                custom={i * 0.2}
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </motion.div>
                    <motion.p
                        className="text-xl font-medium text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Loading contests...
                    </motion.p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-6">
                <motion.div
                    className="p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-red-500/30 max-w-md w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                >
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Contests</h2>
                    <p className="text-gray-300">{error}</p>
                    <motion.button
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchContests()}
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
            {/* Gradient Background */}
            <div
                className="absolute top-0 left-0 w-full h-full z-0"
                style={{
                    backgroundImage: 'linear-gradient(to left bottom, rgba(139, 92, 246, 0.2) 0%, transparent 50%, rgba(56, 189, 248, 0.2) 100%)',
                    borderColor: 'rgba(92, 79, 240, 0.2)',
                }}
            />
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 mt-6">
                        Upcoming Contests
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Participate in our programming contests to test your skills, compete with others, and win exciting prizes!
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {contests.map((contest) => (
                        <motion.div
                            key={contest.id}
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl group"
                        >
                            {/* Status badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(contest.status)} text-white`}
                                >
                                    {contest.status}
                                </div>
                            </div>

                            {/* Card content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{contest.title}</h2>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-300">
                                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                        <span className="text-sm">Starts: {new Date(contest.start_time).toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center text-gray-300">
                                        <Clock className="w-4 h-4 mr-2 text-pink-400" />
                                        <span className="text-sm">Ends: {new Date(contest.end_time).toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center text-gray-300">
                                        <Timer className="w-4 h-4 mr-2 text-cyan-400" />
                                        <span className="text-sm">Duration: {formatDuration(contest.duration)}</span>
                                    </div>
                                </div>

                                {/* View details button */}
                                <motion.button
                                    onClick={() => router.push(`/contests/${contest.id}`)}
                                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"></div>
                            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-xl"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {contests.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
                    >
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No Contests Available</h3>
                        <p className="text-gray-400">Check back later for upcoming programming contests.</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

