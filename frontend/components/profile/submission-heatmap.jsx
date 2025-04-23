"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, subDays, eachDayOfInterval } from "date-fns"


export default function SubmissionHeatmap({ submissions }) {
    const [hoveredDay, setHoveredDay] = useState(null)

    const today = new Date()
    const startDate = subDays(today, 364)


    const allDates = eachDayOfInterval({
        start: startDate,
        end: today,
    })

    const weeks = []
    let currentWeek = []


    const startDayOfWeek = startDate.getDay()


    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null)
    }


    allDates.forEach((date) => {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek)
            currentWeek = []
        }
        currentWeek.push(date)
    })


    if (currentWeek.length > 0) {

        while (currentWeek.length < 7) {
            currentWeek.push(null)
        }
        weeks.push(currentWeek)
    }

    // Function to get submission count for a specific date
    const getSubmissionCount = (date) => {
        if (!date) return 0

        const dateString = format(date, "yyyy-MM-dd")
        const submission = submissions.find((s) => s.date === dateString)
        return submission ? submission.count : 0
    }

    // Function to get color based on submission count
    const getColorClass = (count) => {
        if (count === 0) return "bg-gray-800/60"
        if (count < 3) return "bg-purple-900/30"
        if (count < 6) return "bg-purple-800/40"
        if (count < 10) return "bg-purple-700/60"
        if (count < 15) return "bg-purple-600/80"
        return "bg-purple-500"
    }


    const getMonthLabels = () => {
        const months = [];
        let currentMonth = "";

        weeks.forEach((week, weekIndex) => {
            week.forEach((day) => {
                if (day) {
                    const month = format(day, "MMM");
                    if (month !== currentMonth) {
                        months.push({ month, index: weekIndex });
                        currentMonth = month;
                    }
                }
            });
        });

        return months;
    };

    const monthLabels = getMonthLabels()

    return (
        <div className="relative">
            {/* Month labels */}
            <div className="relative flex text-xs text-gray-400 mb-1 pl-8">
                {monthLabels.map((item, index) => (
                    <div
                        key={index}
                        className="absolute z-10" // Set a higher z-index for month labels
                        style={{ left: `${item.index * 20 + 32}px` }}
                    >
                        {item.month}
                    </div>
                ))}
            </div>

            <div className="flex">
                <div className="w-8 mr-2">
                    <div className="h-4"></div>
                    <div className="grid grid-rows-7 gap-1 text-xs text-gray-400 text-right">
                        <div className="h-4">Fri</div>
                        <div className="h-4">Sat</div>
                        <div className="h-4">Sun</div>
                        <div className="h-4">Mon</div>
                        <div className="h-4">Tue</div>
                        <div className="h-4">Wed</div>
                        <div className="h-4">Thu</div>
                    </div>
                </div>

                <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {week.map((day, dayIndex) => {
                                const count = getSubmissionCount(day);
                                return (
                                    <motion.div
                                        key={dayIndex}
                                        className={`w-4 h-4 rounded-sm ${getColorClass(count)} cursor-pointer relative z-0`} // Set a lower z-index for heatmap boxes
                                        whileHover={{ scale: 1.2 }}
                                        onMouseEnter={() =>
                                            day &&
                                            setHoveredDay({
                                                date: format(day, "yyyy-MM-dd"),
                                                count,
                                            })
                                        }
                                        onMouseLeave={() => setHoveredDay(null)}
                                    >
                                        {hoveredDay &&
                                            hoveredDay.date ===
                                            (day ? format(day, "yyyy-MM-dd") : null) && (
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                                                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap border border-gray-700">
                                                        <div>{day ? format(day, "MMM d, yyyy") : ""}</div>
                                                        <div>
                                                            {count} submission
                                                            {count !== 1 ? "s" : ""}
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                        <div className="border-t border-l border-gray-700 bg-gray-800 h-2 w-2 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
