import type { VercelRequest, VercelResponse } from "@vercel/node";
import Redis from "ioredis";

// Create Redis client lazily
let redis: Redis | null = null;

function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      connectTimeout: 10000,
    });
  }
  return redis;
}

// Simple authentication (in production, use proper auth)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check authentication
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
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

    // Get all analytics data from Redis
    const visitorKeys = await redisClient.keys("visitor:*");
    const visitors = [];

    for (const key of visitorKeys) {
      const visitorData = await redisClient.get(key);
      if (visitorData) {
        try {
          visitors.push(JSON.parse(visitorData));
        } catch (e) {
          console.error("Error parsing visitor data:", e);
        }
      }
    }

    // Sort by timestamp (newest first)
    visitors.sort((a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate statistics
    const totalVisitors = visitors.length;
    const countries = new Set(visitors.map((v: any) => v.geo?.country).filter(Boolean));
    const browsers = visitors.reduce((acc: any, v: any) => {
      const browser = v.parsedUA?.browser?.name || "Unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});
    const devices = visitors.reduce((acc: any, v: any) => {
      const deviceType = v.parsedUA?.device?.type || "desktop";
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      stats: {
        totalVisitors,
        uniqueCountries: countries.size,
        browsers,
        devices,
      },
      visitors: visitors.slice(0, 50), // Limit to last 50 visitors
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
