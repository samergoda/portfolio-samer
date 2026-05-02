import type { VercelRequest, VercelResponse } from "@vercel/node";

// Note: In production, you should use a real database
// This is a simple in-memory store for demonstration
const analyticsStore = new Map<string, any>();
const interactionsStore = new Map<string, any[]>();

// Simple authentication (in production, use proper auth)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ;

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

    // Get all analytics data
    const visitors = Array.from(analyticsStore.values());
    const interactions = Array.from(interactionsStore.entries()).map(([key, value]) => ({
      key,
      interactions: value,
    }));

    // Calculate statistics
    const totalVisitors = visitors.length;
    const countries = new Set(visitors.map((v) => v.geo?.country).filter(Boolean));
    const browsers = visitors.reduce((acc: any, v) => {
      const browser = v.parsedUA?.browser?.name || "Unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});
    const devices = visitors.reduce((acc: any, v) => {
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
      interactions: interactions.slice(0, 50),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
