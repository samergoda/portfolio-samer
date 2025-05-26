import { Github, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-100 dark:bg-dark-900 py-8">
      <div className="container-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-dark-600 dark:text-dark-300">© {currentYear} Samer Godaa. All rights reserved.</p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/samergoda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="GitHub">
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/samer-goda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>

            <a
              href="mailto:contact@samergodaa.com"
              className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
