'use client';
import React, { useEffect, useState } from 'react';

const CodeAnimation = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [blinkCursor, setBlinkCursor] = useState(true);

  const codeLines = [
    'function findMaxSubarraySum(arr) {',
    '  let maxSoFar = arr[0];',
    '  let maxEndingHere = arr[0];',
    '',
    '  for (let i = 1; i < arr.length; i++) {',
    '    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);',
    '    maxSoFar = Math.max(maxSoFar, maxEndingHere);',
    '  }',
    '',
    '  return maxSoFar;',
    '}'
  ];

  const [visibleCode, setVisibleCode] = useState(Array(codeLines.length).fill(''));

  useEffect(() => {
    // Typing animation
    if (currentLine < codeLines.length) {
      const line = codeLines[currentLine];
      if (currentChar < line.length) {
        const timer = setTimeout(() => {
          setVisibleCode(prev => {
            const newCode = [...prev];
            newCode[currentLine] = line.substring(0, currentChar + 1);
            return newCode;
          });
          setCurrentChar(currentChar + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentLine(currentLine + 1);
          setCurrentChar(0);
        }, 200); // Delay before next line
        return () => clearTimeout(timer);
      }
    } else {
      // Reset animation after completion
      const timer = setTimeout(() => {
        setCurrentLine(0);
        setCurrentChar(0);
        setVisibleCode(Array(codeLines.length).fill(''));
      }, 3000); // Wait before restarting
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, codeLines]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setBlinkCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 transform perspective-1000 rotateY-3 hover:rotateY-0 transition-transform duration-500">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-sm ml-2">findMaxSubarraySum.js</div>
      </div>
      <div className="p-4 font-mono text-sm relative">
        <pre className="text-gray-300">
          {visibleCode.map((line, index) => (
            <div key={index} className="min-h-[1.5rem]">
              <span className="text-gray-500 mr-4">{index + 1}</span>
              <span className="text-purple-400">{line}</span>
              {currentLine === index && blinkCursor && <span className="animate-pulse">|</span>}
            </div>
          ))}
        </pre>
        
      </div>
    </div>
  );
};

export default CodeAnimation;