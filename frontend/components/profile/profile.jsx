"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    User,
    Phone,
    Calendar,
    Trophy,
    Code,
    Check,
    Camera,
    Loader2,
    Save,
    X,
    Edit3,
    Github,
    Twitter,
    Globe,
    Mail,
    Award,
    BarChart3,
} from "lucide-react"
import useAuthStore from "@/store/AuthStore"

export default function Profile() {
    const { user, fetchUserProfile, updateUserProfile } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        mobile: "",
        profile_picture: null,
    })
    const [previewImage, setPreviewImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })
    const fileInputRef = useRef(null)

    useEffect(() => {
        // Fetch the latest user data when component mounts
        fetchUserProfile()
    }, [fetchUserProfile])

    useEffect(() => {
        // Update form data when user data changes
        if (user) {
            setFormData({
                mobile: user.mobile || "",
                profile_picture: user.profile_picture || null,
            })
        }
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file)

        // Update form data
        setFormData((prev) => ({
            ...prev,
            profile_picture: file,
        }))
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            // Create a FormData object for file uploads
            const formDataToSend = new FormData();

            // Add the mobile number
            formDataToSend.append('mobile', formData.mobile);

            // Only append the file if it's a new file (not a string URL from the server)
            if (formData.profile_picture instanceof File) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }

            // Pass the FormData object to the update function
            await updateUserProfile(formDataToSend);

            setIsEditing(false);
            setMessage({ text: "Profile updated successfully!", type: "success" });
        } catch (error) {
            setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false)
        setPreviewImage(null)
        if (user) {
            setFormData({
                mobile: user.mobile || "",
                profile_picture: user.profile_picture || null,
            })
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

    if (!user) {
        return (
            <div className="min-h-screen relative bg-slate-950 flex items-center justify-center">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="relative z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
            </div>
        )
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="min-h-screen relative bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
            {/* Background grid pattern */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Message display */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mb-6 p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-900/60 text-green-200 border border-green-700"
                            : "bg-red-900/60 text-red-200 border border-red-700"
                            }`}
                    >
                        <p className="flex items-center">
                            {message.type === "success" ? <Check className="h-5 w-5 mr-2" /> : <X className="h-5 w-5 mr-2" />}
                            {message.text}
                        </p>
                    </motion.div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Profile Card */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-1 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex flex-col items-center">
                                {/* Profile Image */}
                                <div className="relative w-32 h-32 mb-6">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 border-2 border-purple-500/50">
                                        {isEditing && previewImage ? (
                                            <Image
                                                src={previewImage || "/placeholder.svg"}
                                                alt="Profile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : user.profile_picture ? (
                                            <Image
                                                src={user.profile_picture.startsWith('http')
                                                    ? user.profile_picture
                                                    : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <User className="h-16 w-16 text-gray-600" />
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={triggerFileInput}
                                            className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 p-2 rounded-full text-white shadow-lg transition-colors"
                                        >
                                            <Camera className="h-5 w-5" />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </button>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">{user.user}</h2>

                                <div className="flex items-center mb-4">
                                    <div className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 flex items-center">
                                        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                                        <span>Rating: {user.rating}</span>
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex flex-col items-center p-3 bg-gray-800/60 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{user.total_solved}</div>
                                        <div className="text-xs text-gray-400 flex items-center">
                                            <Check className="h-3 w-3 mr-1 text-green-500" />
                                            Problems Solved
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center p-3 bg-gray-800/60 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{user.total_submissions}</div>
                                        <div className="text-xs text-gray-400 flex items-center">
                                            <Code className="h-3 w-3 mr-1 text-blue-500" />
                                            Submissions
                                        </div>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                                        <div>
                                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-1">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="text"
                                                name="mobile"
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter mobile number"
                                            />
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center transition-colors"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area - Bento Grid */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Info Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <User className="h-5 w-5 mr-2 text-purple-400" />
                                User Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-400">Username</div>
                                    <div className="text-white font-medium">{user.user}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 flex items-center">
                                        <Phone className="h-4 w-4 mr-1 text-blue-400" />
                                        Mobile Number
                                    </div>
                                    <div className="text-white font-medium">{user.mobile || "Not provided"}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-green-400" />
                                        Member Since
                                    </div>
                                    <div className="text-white font-medium">{formatDate(user.created_at)}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-pink-400" />
                                        Last Updated
                                    </div>
                                    <div className="text-white font-medium">{formatDate(user.updated_at)}</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rating Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                                Rating & Performance
                            </h3>

                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                                    {user.rating}
                                </div>
                                <div className="text-gray-400 mb-6">Current Rating</div>

                                {/* Rating visualization */}
                                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                        style={{ width: `${Math.min(100, (user.rating / 3000) * 100)}%` }}
                                    ></div>
                                </div>
                                <div className="w-full flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1500</span>
                                    <span>3000</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Submission Stats Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                                Submission Statistics
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-400">Solved Problems</span>
                                        <span className="text-sm text-white">{user.total_solved}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                            style={{
                                                width:
                                                    user.total_submissions > 0 ? `${(user.total_solved / user.total_submissions) * 100}%` : "0%",
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-400">Success Rate</span>
                                        <span className="text-sm text-white">
                                            {user.total_submissions > 0
                                                ? `${Math.round((user.total_solved / user.total_submissions) * 100)}%`
                                                : "0%"}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            style={{
                                                width:
                                                    user.total_submissions > 0 ? `${(user.total_solved / user.total_submissions) * 100}%` : "0%",
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold text-white">{user.total_submissions}</div>
                                        <div className="text-xs text-gray-400">Total Submissions</div>
                                    </div>

                                    <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold text-white">{user.total_submissions - user.total_solved}</div>
                                        <div className="text-xs text-gray-400">Unsolved Attempts</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Achievements Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <Award className="h-5 w-5 mr-2 text-purple-400" />
                                Achievements
                            </h3>

                            {user.total_solved > 0 || user.total_submissions > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {user.total_submissions > 0 && (
                                        <div className="flex items-center p-3 bg-gray-800/60 rounded-lg">
                                            <div className="p-2 rounded-full bg-blue-900/50 mr-3">
                                                <Code className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">First Submission</div>
                                                <div className="text-xs text-gray-400">Submitted your first solution</div>
                                            </div>
                                        </div>
                                    )}

                                    {user.total_solved > 0 && (
                                        <div className="flex items-center p-3 bg-gray-800/60 rounded-lg">
                                            <div className="p-2 rounded-full bg-green-900/50 mr-3">
                                                <Check className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">Problem Solver</div>
                                                <div className="text-xs text-gray-400">Solved your first problem</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="text-gray-500 mb-2">No achievements yet</div>
                                    <div className="text-sm text-gray-400">Start solving problems to earn achievements!</div>
                                </div>
                            )}
                        </motion.div>

                        {/* Social Links Card */}
                        <motion.div
                            variants={itemVariants}
                            className="md:col-span-2 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <Globe className="h-5 w-5 mr-2 text-cyan-400" />
                                Connect & Share
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors">
                                    <Github className="h-5 w-5" />
                                    <span>GitHub</span>
                                </button>

                                <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors">
                                    <Twitter className="h-5 w-5 text-blue-400" />
                                    <span>Twitter</span>
                                </button>

                                <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors">
                                    <Mail className="h-5 w-5 text-red-400" />
                                    <span>Email</span>
                                </button>

                                <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors">
                                    <Globe className="h-5 w-5 text-green-400" />
                                    <span>Website</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

