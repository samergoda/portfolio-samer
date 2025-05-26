import React, { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../../lib/data/projects";
import { Github, ExternalLink } from "lucide-react";

const Projects: React.FC = () => {
  const [filter] = useState<"all" | "featured">("all");

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.featured);

  return (
    <section id="projects" className="section">
      <div className="container-wrapper">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          My Projects
        </motion.h2>
        {/* 
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-dark-100 text-dark-800 dark:bg-dark-800 dark:text-dark-200 hover:bg-dark-200 dark:hover:bg-dark-700"
              }`}>
              All Projects
            </button>
            <button
              type="button"
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === "featured"
                  ? "bg-primary-600 text-white"
                  : "bg-dark-100 text-dark-800 dark:bg-dark-800 dark:text-dark-200 hover:bg-dark-200 dark:hover:bg-dark-700"
              }`}>
              Featured
            </button>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card group">
              <div className="relative overflow-hidden h-60">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* {project.featured && (
                  <span className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-2 py-1 rounded-md">Featured</span>
                )} */}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-dark-900 dark:text-dark-50">{project.title}</h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-dark-200 dark:bg-dark-700 text-dark-800 dark:text-dark-200 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      <ExternalLink size={16} className="mr-1" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-100 transition-colors">
                      <Github size={16} className="mr-1" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
