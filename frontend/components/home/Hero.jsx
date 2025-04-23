'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../shared/Button';
import CodeAnimation from '../animated/CodeAnimation';

const BLOB_COUNT = 3;

export default function HeroSection() {
    const blobRefs = useRef([]);
    const animationRef = useRef();
    const [blobStates, setBlobStates] = useState([]);

    useEffect(() => {
        const initialBlobStates = Array(BLOB_COUNT).fill(null).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
        }));
        setBlobStates(initialBlobStates);
    }, []);

    useEffect(() => {
        if (blobStates.length === 0) return;
        
        
        const positions = [...blobStates];
        
        const animate = () => {
           
            positions.forEach((state, index) => {
                const blob = blobRefs.current[index];
                if (!blob) return;
                
                state.x += state.vx;
                state.y += state.vy;
                
                if (state.x < 0 || state.x > window.innerWidth) state.vx *= -1;
                if (state.y < 0 || state.y > window.innerHeight) state.vy *= -1;
                
                blob.style.transform = `translate(${state.x}px, ${state.y}px)`;
            });
            
            animationRef.current = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [blobStates.length]); 

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
            {blobStates.map((_, index) => (
                <div
                    key={index}
                    ref={(el) => (blobRefs.current[index] = el)}
                    className={`absolute h-[400px] w-[400px] rounded-full opacity-30 blur-[120px] ${
                        index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-pink-500' : 'bg-blue-500'
                    }`}
                />
            ))}
            
            <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12 lg:flex-row lg:gap-16 lg:px-8">
                <div className="w-full text-center lg:w-2/3 lg:text-left lg:order-1 order-2 mt-8 lg:mt-0">
                    <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
                        Master Your <span className="text-purple-400">Coding Skills</span> with Real Challenges
                    </h1>
                    <p className="mb-10 text-lg opacity-80 mx-auto lg:mx-0 max-w-2xl lg:max-w-none md:text-xl">
                        Elevate your programming skills through advanced challenges
                        and real-time competitions
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <Button label="Get Started" href="/practice" className="text-lg px-6 py-3 md:text-xl md:px-8 md:py-4" />
                        <Button label="Explore Contests" href="/contests" variant="secondary" className="text-lg px-6 py-3 md:text-xl md:px-8 md:py-4" />
                    </div>
                </div>
                
                <div className="w-full lg:w-1/3 flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
                    <div className="animate-float max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        <CodeAnimation className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}