"use client"

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code, Users, Award, Clock, Zap, Server } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// Counter animation hook
const useCounter = (end, duration = 2) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const startCount = 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (end - startCount) + startCount);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return { count, nodeRef };
};

const StatItem = ({ icon, value, label, gradient }) => {
  const { count, nodeRef } = useCounter(value);

  return (
    <motion.div
      className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 shadow-xl"
      variants={itemVariants}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="absolute -top-4 -left-4 p-3 rounded-lg shadow-lg" style={{ background: gradient }}>
        {icon}
      </div>
      <div className="pt-6 text-center">
        <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: gradient }}>
          <span ref={nodeRef}>{count.toLocaleString()}</span>
          {label.includes("Success Rate") && "%"}
        </h3>
        <p className="text-gray-400 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            variants={itemVariants}
          >
            Our Platform in Numbers
          </motion.h2>
          <motion.p className="text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
            Join thousands of Students who trust our platform for coding challenges, competitions, and skill
            improvement.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <StatItem icon={<Code className="w-6 h-6 text-white" />} value={5000} label="Coding Problems" gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" />
          <StatItem icon={<Users className="w-6 h-6 text-white" />} value={1000} label="Active Users" gradient="linear-gradient(135deg, #ec4899, #f43f5e)" />
          <StatItem icon={<Award className="w-6 h-6 text-white" />} value={20} label="Competitions Hosted" gradient="linear-gradient(135deg, #14b8a6, #0ea5e9)" />
          <StatItem icon={<Clock className="w-6 h-6 text-white" />} value={98} label="Success Rate" gradient="linear-gradient(135deg, #f59e0b, #ef4444)" />
          <StatItem icon={<Zap className="w-6 h-6 text-white" />} value={100000} label="Code Submissions" gradient="linear-gradient(135deg, #10b981, #3b82f6)" />
          <StatItem icon={<Server className="w-6 h-6 text-white" />} value={10} label="Supported Languages" gradient="linear-gradient(135deg, #8b5cf6, #d946ef)" />
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
