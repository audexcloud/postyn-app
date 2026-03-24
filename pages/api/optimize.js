// /api/optimize.js
// Serverless API route — runs on the server, never exposed to browser.
// This is the secure proxy between your frontend and Claude.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server." });
  }

  try {
    const { model, max_tokens, system, messages } = req.body;

    // Validate required fields
    if (!system || !messages) {
      return res.status(400).json({ error: "Missing required fields: system, messages" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-opus-4-5-20251101",
        max_tokens: max_tokens || 4000,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.error?.message || `Anthropic API error: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Optimize API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Increase body size limit for image attachments
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
