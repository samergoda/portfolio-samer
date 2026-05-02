import type { VercelRequest, VercelResponse } from "@vercel/node";

// In-memory store for interactions (in production, use a database)
const interactionsStore = new Map<string, any[]>();

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

    // Store interaction
    const key = `${ip}-${new Date().toISOString().split("T")[0]}`;
    if (!interactionsStore.has(key)) {
      interactionsStore.set(key, []);
    }
    interactionsStore.get(key)?.push(interaction);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
