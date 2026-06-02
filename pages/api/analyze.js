// pages/api/analyze.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
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
          generationConfig: {
            maxOutputTokens: 4000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    // エラー確認用
    console.log("Gemini API response:");
    console.log(JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Gemini text:");
    console.log(JSON.stringify(text));

    if (!text) {
      return res.status(500).json({
        error: "Gemini returned empty response",
      });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "Gemini API error",
      detail: String(error),
    });
  }
}