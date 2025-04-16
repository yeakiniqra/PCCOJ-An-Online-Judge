import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const API_KEY = "AIzaSyDySDirj3E_bQEegqVzQ_wu0KlloATohIc";

export async function simplifyProblemStatement(statement) {
    try {
      if (!API_KEY) {
        throw new Error("Gemini API key not found");
      }
  
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `
  You're an AI teacher. A beginner is trying to understand the following problem statement. 
  Explain it in a simpler and more intuitive way using relatable analogies and simple terms.
  Avoid using technical jargon unless absolutely necessary.
  
  Problem:
  ${statement}
  
  Simplify it clearly for a beginner:
      `;
  
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error simplifying problem statement:", error);
      throw error;
    }
  }