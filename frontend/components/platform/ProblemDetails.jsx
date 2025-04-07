'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useFetchProblemStore from '@/store/fetchProblem';
import Editor from '@monaco-editor/react';

export default function ProblemDetails() {
  const { id } = useParams();
  const { problemDetails, fetchProblemById, loading, error } = useFetchProblemStore();

  useEffect(() => {
    if (id) {
      fetchProblemById(id);
    }
  }, [id, fetchProblemById]);

  if (loading) return <div className="p-4 text-gray-300">Loading problem...</div>;
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;
  if (!problemDetails) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 text-white" style={{ paddingTop: '6rem' }}>
      {/* Left: Problem Description */}
      <div className="lg:w-1/2 w-full space-y-4 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h1 className="text-3xl font-bold text-purple-400">{problemDetails.title}</h1>

        <div>
          <p className="font-semibold text-lg mb-1">Statement:</p>
          <p className="whitespace-pre-wrap text-gray-300">{problemDetails.statement}</p>
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">Input Format:</p>
          <p className="whitespace-pre-wrap text-gray-300">{problemDetails.input_format}</p>
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">Output Format:</p>
          <p className="whitespace-pre-wrap text-gray-300">{problemDetails.output_format}</p>
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">Constraints:</p>
          <p className="whitespace-pre-wrap text-gray-300">{problemDetails.constraints}</p>
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">Sample Input:</p>
          <pre className="bg-zinc-800 p-2 rounded text-sm text-gray-200">{problemDetails.sample_input}</pre>
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">Sample Output:</p>
          <pre className="bg-zinc-800 p-2 rounded text-sm text-gray-200">{problemDetails.sample_output}</pre>
        </div>

        {problemDetails.explanation && (
          <div>
            <p className="font-semibold text-lg mb-1">Explanation:</p>
            <p className="whitespace-pre-wrap text-gray-300">{problemDetails.explanation}</p>
          </div>
        )}
      </div>

      {/* Right: Code Editor */}
      <div className="lg:w-1/2 w-full">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 h-full">
          <div className="mb-2 text-sm text-gray-400">Write your code here:</div>
          <Editor
            height="70vh"
            defaultLanguage="python"
            defaultValue="# Write your solution here..."
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </div>
    </div>
  );
}
