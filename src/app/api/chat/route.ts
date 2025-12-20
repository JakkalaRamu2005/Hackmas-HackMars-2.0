import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { message, syllabusContext, conversationHistory } = await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_KEY not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build context-aware prompt
        let systemPrompt = `You are Santa's Study Helper, a friendly and knowledgeable AI tutor with a Christmas personality. You help students understand their study material, provide explanations, create quiz questions, and offer study tips.

**Your Personality:**
- Warm, encouraging, and supportive (like Santa!)
- Use occasional Christmas emojis (🎄, 🎅, ⭐, 🎁) but don't overdo it
- Keep responses concise and clear
- Break down complex topics into simple explanations
- Provide examples when helpful

**Your Capabilities:**
- Explain topics in simple terms
- Create practice questions and quizzes
- Provide study strategies and tips
- Help with understanding difficult concepts
- Offer motivation and encouragement

**Guidelines:**
- Keep responses under 200 words unless explaining complex topics
- Use bullet points for lists
- Be encouraging and positive
- If you don't know something, be honest
- Focus on helping the student learn, not just giving answers

`;

        // Add syllabus context if available
        if (syllabusContext) {
            systemPrompt += `\n**Student's Syllabus Context:**\n${syllabusContext.substring(0, 1000)}\n\n`;
        }

        // Add conversation history for context
        if (conversationHistory && conversationHistory.length > 0) {
            systemPrompt += `\n**Recent Conversation:**\n`;
            conversationHistory.forEach((msg: any) => {
                systemPrompt += `${msg.role === "user" ? "Student" : "You"}: ${msg.content}\n`;
            });
        }

        systemPrompt += `\n**Current Student Question:**\n${message}\n\n**Your Response:**`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            {
                error: "Failed to generate response",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
