import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";

const Home: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container-wrapper">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-dark-900 dark:text-white">
              <span className="text-primary-600 dark:text-primary-400">Samer Godaa</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium mb-6 text-dark-700 dark:text-dark-200">Front-end Developer</h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              I craft responsive websites where technology meets creativity. Specialized in building exceptional digital experiences with
              modern front-end technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                Contact Me
              </a>
              <a
                href="#projects"
                className="px-6 py-3 bg-dark-200 dark:bg-dark-700 hover:bg-dark-300 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 rounded-lg font-medium transition-colors">
                View Projects
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
              <a
                href="https://github.com/samergoda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub">
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/samer-goda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:contact@samergoda66@yahoo.com"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Email">
                <Mail size={24} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden  shadow-xl">
              {/* <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Samer Godaa"
                className="w-full h-full object-cover"
              /> */}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer">
          <a href="#skills" aria-label="Scroll to Skills section">
            <ChevronDown size={32} className="text-primary-600 dark:text-primary-400 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
