import type { VercelRequest, VercelResponse } from "@vercel/node";
import Redis from "ioredis";

// Create Redis client lazily
let redis: Redis | null = null;

function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: true,
      connectTimeout: 10000,
      lazyConnect: true,
    });
  }
  return redis;
}

async function ensureRedisConnected(client: Redis): Promise<void> {
  if (client.status === "ready") return;
  if (client.status === "wait") {
    await client.connect();
  }
  if (client.status !== "ready") {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Redis connection timeout")), 10000);
      client.once("ready", () => { clearTimeout(timeout); resolve(); });
      client.once("error", (err) => { clearTimeout(timeout); reject(err); });
    });
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data, timestamp } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Interaction type is required" });
    }

    // Check if REDIS_URL is configured
    if (!process.env.REDIS_URL) {
      console.error("REDIS_URL is not configured");
      return res.status(500).json({
        error: "Database not configured",
        details: "REDIS_URL environment variable is missing"
      });
    }

    const redisClient = getRedisClient();
    if (!redisClient) {
      throw new Error("Failed to create Redis client");
    }

    await ensureRedisConnected(redisClient);

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

    // Store interaction in Redis
    const interactionKey = `interaction:${Date.now()}:${ip}`;
    await redisClient.set(interactionKey, JSON.stringify(interaction));

    // Set expiry for interaction data (30 days)
    await redisClient.expire(interactionKey, 60 * 60 * 24 * 30);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
