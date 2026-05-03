import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

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

    // Get all analytics data from KV store
    const visitorKeys = await kv.keys("visitor:*");
    const visitors = [];

    for (const key of visitorKeys) {
      const visitor = await kv.get(key);
      if (visitor) {
        visitors.push(visitor);
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
    return res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" });
  }
};
