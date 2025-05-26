import React from "react";
import { motion } from "framer-motion";
import { skills } from "../../lib/data/skills";

const Skills: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="section bg-dark-50 dark:bg-dark-900">
      <div className="container-wrapper">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          My Technical Skills
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <p className="text-center text-dark-600 dark:text-dark-300 mb-12 text-lg">
            I've worked with a range of technologies in the web development world, from front-end to back-end.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}>
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className={`skill-tag ${skill.color} transform hover:scale-105 transition-transform`}>
              {skill.name}
              {/* <span className="ml-2 inline-flex items-center"> */}
              {/* {Array.from({ length: 5 }).map((_, index) => (
                  // <span
                  //   key={index}
                  //   className={`w-1 h-1 rounded-full ml-0.5 ${index < skill.icon ? "bg-current opacity-100" : "bg-current opacity-30"}`}
                  // />
                ))} */}
              <skill.icon className="inline-block w-5 h-5 ml-2" />
              {/* </span> */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
