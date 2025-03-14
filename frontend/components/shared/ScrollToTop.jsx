"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

 
  useEffect(() => {
    const toggleVisibility = () => {
    
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const totalScrollable = docHeight - winHeight;
      const scrolled = scrollTop / totalScrollable;

      setScrollProgress(scrolled);

    
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

  
    window.addEventListener("scroll", toggleVisibility);

   
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const floatingAnimation = {
    initial: { y: 0, opacity: 0, scale: 0.8 },
    animate: {
      y: [0, -10, 0],
      opacity: 1,
      scale: 1,
      transition: {
        y: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Progress circle */}
          <svg
            className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rotate-[-90deg]"
            viewBox="0 0 100 100"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="3"
              stroke="rgba(168, 85, 247, 0.2)"
              className="opacity-50"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="3"
              stroke="url(#gradient)"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: scrollProgress }}
              transition={{ type: "spring", stiffness: 50 }}
              style={{
                strokeDasharray: "251.2",
                strokeDashoffset: "0",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Button */}
          <motion.button
            onClick={scrollToTop}
            className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/30 focus:outline-none"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={floatingAnimation}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 20px 0 rgba(124, 58, 237, 0.5)",
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-md -z-10"></div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}