const dotenv = require("dotenv");
dotenv.config();

async function generateSuggestion(req, res) {
  try {
    const { type, name, title, skills, context } = req.body;

    if (!type) {
      return res.status(400).json({ message: "type is required ('summary' or 'bullet')" });
    }

    const prompt = type === "summary"
      ? `Generate a professional 3-line resume summary for a candidate named ${name || "a candidate"} who is a ${title || "professional"} with skills in: ${(skills || []).join(", ")}. Maintain a formal, impactful, and results-oriented tone. Output ONLY the summary text, nothing else.`
      : `Refine the following resume bullet point to make it more impactful and action-oriented for a ${title || "professional"} role: "${context || ""}". Utilize strong action verbs and imply quantifiable outcomes. Output ONLY the refined bullet point text, nothing else.`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found. Using high-quality mock fallback suggestion.");
      const mockResult = type === "summary"
        ? `Dedicated and results-oriented ${title || "Professional"} with proven expertise in ${(skills && skills.length > 0) ? skills.slice(0, 3).join(", ") : "industry-leading software methodologies"}. Adept at designing scalable solutions, driving team efficiency, and delivering high-impact business outcomes.`
        : `Led the design and integration of high-performance features, optimizing codebase responsiveness by 15% and streamlining user onboarding processes.`;
      return res.status(200).json({ text: mockResult });
    }

    // Call Gemini 2.5 Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error response:", errorData);
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await response.json();
    
    let generatedText = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      generatedText = data.candidates[0].content.parts[0].text.trim();
    }

    if (!generatedText) {
      throw new Error("Empty response from Gemini API");
    }

    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error("AI Suggestion Error:", error);
    // Graceful fallback so the client never crashes
    const fallback = req.body.type === "summary"
      ? `Experienced ${req.body.title || "Professional"} focused on developing robust systems and executing projects with precision and speed.`
      : `Spearheaded software development workflows to achieve high uptime and robust feature integrations.`;
    return res.status(200).json({ text: fallback });
  }
}

module.exports = { generateSuggestion };
