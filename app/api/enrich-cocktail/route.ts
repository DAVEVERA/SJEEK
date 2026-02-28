import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  let cocktailName = 'Unknown';
  try {
    const body = await req.json();
    const { name, glass, category } = body;
    cocktailName = name;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not set in .env.local' }, { status: 500 });
    }

    // Use gemini-2.5-flash
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a cocktail expert. Return ONLY a valid JSON object (no markdown, no explanation, no backticks) for the cocktail "${name}" served in a ${glass} (${category}).

The JSON must follow this exact format:
{"origin":"city/country and approximate year","history":"2-3 sentences on backstory","nameHeritage":"what the name means or where it comes from","funFact":"one surprising fact","ingredients":[{"item":"ingredient name","amount":"45","unit":"ml"}],"abv":12,"flavourProfile":["sweet","sour"]}

Rules: abv is a plain integer. flavourProfile has 2-4 items from: sweet sour bitter strong fruity smoky refreshing creamy spicy herbal. At least 3 ingredients.`;

    console.log(`[enrich] Calling Gemini for: ${name}`);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    console.log(`[enrich] Raw response preview: ${rawText.slice(0, 300)}`);

    // Strip any markdown fences if model ignores instruction
    const stripped = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Find outermost JSON object
    const start = stripped.indexOf('{');
    const end = stripped.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      console.error('[enrich] No JSON object found. Raw:', rawText);
      return NextResponse.json({
        success: false,
        error: 'AI response did not contain valid JSON',
        raw: rawText.slice(0, 500),
      }, { status: 500 });
    }

    const jsonStr = stripped.slice(start, end + 1);
    const data = JSON.parse(jsonStr);

    // Normalise types
    if (typeof data.abv === 'string') data.abv = parseFloat(data.abv) || 0;
    if (!Array.isArray(data.ingredients)) data.ingredients = [];
    if (!Array.isArray(data.flavourProfile)) data.flavourProfile = [];

    console.log(`[enrich] Success for: ${name}`);
    return NextResponse.json({ success: true, details: data });

  } catch (err: any) {
    // Log full error server-side
    console.error(`[enrich] FAILED for ${cocktailName}:`, err?.message ?? err);
    // Return the real error message to the client for debugging
    return NextResponse.json({
      success: false,
      error: err?.message ?? String(err),
      cocktail: cocktailName,
    }, { status: 500 });
  }
}
