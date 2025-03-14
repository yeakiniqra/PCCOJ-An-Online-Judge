"use client"

import dynamic from 'next/dynamic'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, PenToolIcon as Tool, HardHat } from 'lucide-react'
import constructionAnimation from '../public/constructionAnimation.json'

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}


const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

export default function NotFoundAlternative() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden">
     
      <div className="absolute top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      
   
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-950/80 via-gray-950/50 to-gray-950/80"></div>
      
  
      <motion.div 
        className="absolute top-20 left-[10%] text-yellow-500/20"
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        custom={0}
      >
        <Tool size={64} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-[10%] text-orange-500/20"
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        custom={1}
      >
        <HardHat size={64} />
      </motion.div>
      
      <motion.div
        className="max-w-2xl w-full text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        <motion.div 
          className="w-full max-w-md mx-auto relative"
          variants={itemVariants}
        >
          <Lottie 
            animationData={constructionAnimation} 
            loop={true} 
            style={{ width: '100%', height: '300px' }}
          />
          
         
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-4 mb-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ 
                width: ['0%', '40%', '60%', '40%', '80%', '60%', '75%'],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-1">
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
        
        {/* Email notification */}
        <motion.div 
          className="mt-12 p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 max-w-md mx-auto"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
             We are under construction! Stay tuned for updates.
          </h3>
         
        </motion.div>
      </motion.div>
    </div>
  )
}
