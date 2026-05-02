import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import UAParser from "ua-parser-js";
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory store for IP rate limiting per day
// Key format: "IP:YYYY-MM-DD"
const visitedIPs = new Map<string, boolean>();

// In-memory store for visitor analytics
const analyticsStore = new Map<string, any>();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getGeoLocation(ip: string) {
  try {
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.")) {
      return null;
    }
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,isp,org,query`);
    const data = await response.json();
    return data.status === "success" ? data : null;
  } catch (error) {
    console.error("Geolocation API error:", error);
    return null;
  }
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

    // Get body data (interactions from frontend)
    const bodyData = req.body || {};
    const { screenWidth, screenHeight, viewportWidth, viewportHeight, language, colorScheme, interactions } = bodyData;

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

    // Parse user agent
    const userAgentString = req.headers["user-agent"]?.toString() || "unknown";
    const parser = new (UAParser as any)(userAgentString);
    const uaResult = parser.getResult();


    // Get geolocation data
    const geoData = await getGeoLocation(ip);

    const referer = req.headers["referer"]?.toString() || "direct";
    const safeIp = escapeHtml(ip);
    const visitTime = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // Store analytics data
    const analyticsEntry = {
      ip,
      timestamp: new Date().toISOString(),
      userAgent: userAgentString,
      parsedUA: uaResult,
      geo: geoData,
      referer,
      screenResolution: screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : "unknown",
      viewport: viewportWidth && viewportHeight ? `${viewportWidth}x${viewportHeight}` : "unknown",
      language: language || "unknown",
      colorScheme: colorScheme || "unknown",
      interactions: interactions || [],
    };

    analyticsStore.set(`${ip}-${Date.now()}`, analyticsEntry);

    // Build detailed email
    const browserInfo = `${uaResult.browser.name || "Unknown"} ${uaResult.browser.version || ""}`;
    const osInfo = `${uaResult.os.name || "Unknown"} ${uaResult.os.version || ""}`;
    const deviceInfo = uaResult.device.type
      ? `${uaResult.device.vendor || ""} ${uaResult.device.model || ""} (${uaResult.device.type})`.trim()
      : "Desktop";

    const locationInfo = geoData
      ? `${geoData.city}, ${geoData.regionName}, ${geoData.country}`
      : "Unknown";
    const ispInfo = geoData?.isp || "Unknown";
    const timezoneInfo = geoData?.timezone || "Unknown";

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "judosamer555@gmail.com",
      subject: `🌐 New Visitor from ${geoData?.country || "Unknown Location"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #6366f1; margin-top: 0;">🌐 New Portfolio Visitor</h2>

            <h3 style="color: #4b5563; font-size: 16px; margin-top: 24px; margin-bottom: 12px;">📍 Location</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Location</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(locationInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Timezone</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(timezoneInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">ISP</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(ispInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">IP Address</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${safeIp}</td>
              </tr>
            </table>

            <h3 style="color: #4b5563; font-size: 16px; margin-top: 24px; margin-bottom: 12px;">💻 Device & Browser</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Browser</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(browserInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">OS</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(osInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Device</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(deviceInfo)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Screen</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(analyticsEntry.screenResolution)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Language</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(analyticsEntry.language)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Theme</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(analyticsEntry.colorScheme)}</td>
              </tr>
            </table>

            <h3 style="color: #4b5563; font-size: 16px; margin-top: 24px; margin-bottom: 12px;">🔗 Visit Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Came From</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(referer)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Time (Cairo)</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${visitTime}</td>
              </tr>
            </table>
          </div>
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
