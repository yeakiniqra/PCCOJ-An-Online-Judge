import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });


const systemPrompt = `
You are a helpful AI assistant specialized in Competitive Programming, Algorithms, and Data Structures.
You help users with:
- Upcoming programming contests (e.g., Codeforces, Leetcode)
- Solving problems efficiently
- Explaining coding concepts and strategies
- Learning resources and roadmap for beginners and advanced users
- Troubleshooting code logic or complexity
Always try to be concise, beginner-friendly, and if needed, offer code snippets or references.
`;


export async function getGroqChatCompletion(userMessage) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.7,
      max_tokens: 1024,
    });

    let response = chatCompletion.choices[0]?.message?.content || "Hmm, I couldn't find a good answer.";

 
    response = response
      .replace(/^\s*\*\s+/gm, "• ")                  
      .replace(/\*\*(.*?)\*\*/g, "$1")           
      .replace(/\*(.*?)\*/g, "$1");                 

    return response;
  } catch (error) {
    console.error("Groq Error:", error);
    return "Sorry, there was an error talking to the AI. Try again later.";
  }
}
