import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { syllabusText } = await request.json();

        if (!syllabusText || syllabusText.trim().length === 0) {
            return NextResponse.json(
                { error: "Syllabus text is required" },
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

        const prompt = `You are a helpful study planner assistant. A student has provided their exam syllabus or study material. Your task is to break it down into exactly 24 bite-sized, actionable study tasks - one for each day of an Advent Calendar leading up to their exam.

**Instructions:**
1. Analyze the syllabus content carefully
2. Create 24 distinct, progressive study tasks
3. Start with foundational topics and build up to advanced ones
4. Make each task specific and achievable in 30-60 minutes
5. Use motivating, friendly language
6. Each task should be a clear action item (e.g., "Review Chapter 3: Thermodynamics", "Solve 5 practice problems on Newton's Laws")

**Syllabus Content:**
${syllabusText}

**Output Format:**
Return ONLY a valid JSON array with exactly 24 objects. Each object must have this structure:
{
  "day": 1,
  "title": "Task description here"
}

Do not include any markdown formatting, code blocks, or additional text. Return only the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse the response as JSON
        let tasks;
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            tasks = JSON.parse(cleanText);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            return NextResponse.json(
                { error: "Failed to parse AI response", details: text },
                { status: 500 }
            );
        }

        // Validate the response
        if (!Array.isArray(tasks) || tasks.length !== 24) {
            return NextResponse.json(
                { error: "Invalid response format from AI", tasks },
                { status: 500 }
            );
        }

        // Ensure all tasks have the correct structure
        const validatedTasks = tasks.map((task, index) => ({
            day: task.day || index + 1,
            title: task.title || `Study task ${index + 1}`,
            isUnlocked: true,
            isCompleted: false,
        }));

        return NextResponse.json({ tasks: validatedTasks });
    } catch (error) {
        console.error("Error generating tasks:", error);
        return NextResponse.json(
            { error: "Failed to generate tasks", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
