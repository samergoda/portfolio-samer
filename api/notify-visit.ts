import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory store for IP rate limiting per day
// Key format: "IP:YYYY-MM-DD"
const visitedIPs = new Map<string, boolean>();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get visitor IP
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.headers["x-real-ip"]?.toString() ||
      "unknown";

    // Get current date in Cairo timezone (YYYY-MM-DD format)
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Africa/Cairo",
    });

    // Create unique key for this IP on this specific date
    const ipDateKey = `${ip}:${today}`;

    // Check if this IP already triggered a notification today
    if (visitedIPs.has(ipDateKey)) {
      return res
        .status(200)
        .json({ success: true, skipped: true, reason: "Already notified today" });
    }

    const userAgent = escapeHtml(
      req.headers["user-agent"]?.toString() || "unknown"
    );
    const referer = escapeHtml(
      req.headers["referer"]?.toString() || "direct"
    );
    const safeIp = escapeHtml(ip);
    const visitTime = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "judosamer555@gmail.com",
      subject: "🌐 New Visitor on Your Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">🌐 New Visitor on Your Portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">IP Address</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeIp}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Browser</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${userAgent}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Came From</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${referer}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Time (Cairo)</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${visitTime}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return res.status(500).json({ error: "Failed to send notification" });
    }

    // Mark this IP as visited for today
    visitedIPs.set(ipDateKey, true);

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Error sending visit notification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
