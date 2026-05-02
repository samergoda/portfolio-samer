import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/sections/Home";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import { useAnalytics } from "./hooks/useAnalytics";

function App() {
  const { trackInteraction } = useAnalytics();
  // Update document title
  useEffect(() => {
    document.title = "Samer Godaa | Front-end Developer";
  }, []);

  // Notify about new visitor with detailed information (one email per IP per day) — production only
  useEffect(() => {
    if (import.meta.env.PROD) {
      // Collect detailed user information
      const userInfo = {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        language: navigator.language,
        colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      };

      fetch("/api/notify-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      }).catch(() => {
        // Silently fail — this is just a notification
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-800 dark:text-dark-100">
      <Header />
      <main>
        <Home />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
