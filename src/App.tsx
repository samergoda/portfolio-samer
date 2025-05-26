import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/sections/Home";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";

function App() {
  // Update document title
  useEffect(() => {
    document.title = "Samer Godaa | Front-end Developer";
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
