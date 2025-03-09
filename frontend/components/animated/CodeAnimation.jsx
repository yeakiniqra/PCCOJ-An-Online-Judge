'use client';
import React, { useState, useEffect } from 'react';

const FloatingCodeCard = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000; 

     
      setOffset(Math.sin(progress * 1.5) * 15); 

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      className="relative w-80 max-w-full rounded-lg bg-gray-800 p-4 shadow-2xl sm:w-96 sm:p-6"
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.05s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-3 w-3 rounded-full bg-red-500 sm:h-4 sm:w-4"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 sm:h-4 sm:w-4"></div>
        <div className="h-3 w-3 rounded-full bg-green-500 sm:h-4 sm:w-4"></div>
      </div>
      <div className="font-mono text-sm leading-relaxed sm:text-base">
        <div className="text-purple-400">#include</div>
        <div>
          <span className="text-white">&lt;iostream&gt;</span>
        </div>
        <div className="text-white">using namespace std;</div>
        <div className="text-white">int main() {`{`}</div>
        <div className="ml-6">
          <span className="text-white">cout &lt;&lt; </span>
          <span className="text-green-400">"Hello, Coders!"</span>
          <span className="text-white"> &lt;&lt; endl;</span>
        </div>
        <div className="ml-6 text-white">return 0;</div>
        <div className="text-white">{`}`}</div>
      </div>
    </div>
  );
};

export default FloatingCodeCard;
