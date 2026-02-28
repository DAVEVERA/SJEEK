import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    console.log("=== AI Bartender API Called ===");

    try {
        const body = await req.json();
        const prompt = body.prompt;
        console.log("User prompt:", prompt);

        // Check for API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("ERROR: GEMINI_API_KEY not found in environment");
            return NextResponse.json({
                success: false,
                error: 'Server configuration error: API key missing'
            }, { status: 500 });
        }

        console.log("API Key found, initializing Gemini...");
        const genAI = new GoogleGenerativeAI(apiKey);
        // gemini-1.5-flash not available on this key — use gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });




        const systemPrompt = `You are an expert mixologist. Create a unique, bespoke cocktail based on this request: "${prompt}".

Return ONLY a raw JSON object (no markdown, no code blocks) with this exact structure:
{
  "name": "Creative Cocktail Name",
  "glass": "Type of glass",
  "instructions": "Step-by-step instructions",
  "description": "A short, enticing description of the drink's flavor and vibe",
  "visualPrompt": "A highly detailed visual description of the cocktail for an image generator. Include colors, lighting, glass type, garnish, and background vibe."
}`;

        console.log("Sending request to Gemini...");
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini response received:", text.substring(0, 200) + "...");

        // Clean up markdown formatting
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let cocktailData;
        try {
            cocktailData = JSON.parse(cleanText);
            console.log("Successfully parsed cocktail data:", cocktailData.name);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw text was:", cleanText);
            return NextResponse.json({
                success: false,
                error: 'AI returned invalid format'
            }, { status: 500 });
        }

        // Generate image URL
        const encodedPrompt = encodeURIComponent(
            cocktailData.visualPrompt + " photorealistic, 4k, cinematic lighting, masterpiece"
        );
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

        console.log("Success! Returning cocktail:", cocktailData.name);
        return NextResponse.json({
            success: true,
            cocktail: {
                ...cocktailData,
                image: imageUrl
            },
            message: `Here is your bespoke creation: ${cocktailData.name}.`
        });

    } catch (error: any) {
        console.error("=== CRITICAL ERROR ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);

        return NextResponse.json({
            success: false,
            error: `Server error: ${error.message || 'Unknown error'}`
        }, { status: 500 });
    }
}
