import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data, timestamp } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Interaction type is required" });
    }

    // Get visitor IP
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.headers["x-real-ip"]?.toString() ||
      "unknown";

    const interaction = {
      ip,
      type,
      data,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Store interaction in KV
    const interactionKey = `interaction:${Date.now()}:${ip}`;
    await kv.set(interactionKey, interaction);

    // Set expiry for interaction data (30 days)
    await kv.expire(interactionKey, 60 * 60 * 24 * 30);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
