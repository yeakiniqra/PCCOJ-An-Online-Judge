'use client';
import React, { useEffect, useState } from 'react';
import {
    Code2,
    Trophy,
    Users,
    BookOpen,
    Zap,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import CodeAnimation from '../animated/CodeAnimation';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Master Your <span className="text-purple-400">Coding Skills</span> with Real Challenges
                        </h1>
                        <p className="text-xl text-gray-300">
                            Join thousands of developers solving algorithmic challenges, competing in contests, and improving their coding abilities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/get-started" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium flex items-center justify-center transition-colors">
                          
                                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                    
                            </Link>
                            <Link href="/explore-problems" className="px-6 py-3 bg-transparent border border-purple-500 hover:bg-purple-800/50 rounded-md font-medium transition-colors">
                           
                                    Explore Problems
                       
                            </Link>
                        </div>
                    </div>
                    <div className="animate-float">
                        <CodeAnimation />
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        </section>
    )
}