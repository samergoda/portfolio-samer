import React from "react";
import { motion } from "framer-motion";
import { experiences } from "../../lib/data/experiences";
import { Briefcase, Calendar } from "lucide-react";

const Experience: React.FC = () => {
  return (
    <section id="experience" className="section bg-dark-50 dark:bg-dark-900">
      <div className="container-wrapper">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          Work Experience
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-dark-300 dark:bg-dark-700" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center md:items-start mb-16 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}>
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 z-10 mt-1.5" />

                {/* Content */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="card p-6">
                    <div className="flex items-center mb-2">
                      <Briefcase className="text-primary-600 dark:text-primary-400 mr-2" size={20} />
                      <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50">{exp.position}</h3>
                    </div>

                    <div className="mb-4">
                      <p className="text-lg font-medium text-dark-800 dark:text-dark-200">{exp.company}</p>
                      <div className="flex items-center text-dark-500 dark:text-dark-400 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <ul className="mb-4 space-y-2">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="text-dark-600 dark:text-dark-300 flex items-start">
                          <span className="mr-2 text-primary-600 dark:text-primary-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-dark-200 dark:bg-dark-700 text-dark-800 dark:text-dark-200 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternate layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
