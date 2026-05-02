import { useEffect, useCallback } from "react";

export function useAnalytics() {
  // Track interaction
  const trackInteraction = useCallback((type: string, data?: any) => {
    if (import.meta.env.PROD) {
      fetch("/api/track-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Silently fail
      });
    }
  }, []);

  // Track page visibility and time spent
  useEffect(() => {
    const startTime = Date.now();
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        trackInteraction("page_blur", { timeSpent });
      } else {
        isVisible = true;
        trackInteraction("page_focus");
      }
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackInteraction("page_leave", { timeSpent });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [trackInteraction]);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.floor((window.scrollY / scrollHeight) * 100);

      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;

        // Track milestone depths
        if ([25, 50, 75, 100].includes(scrollPercentage)) {
          trackInteraction("scroll_depth", { depth: scrollPercentage });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackInteraction]);

  return { trackInteraction };
}
