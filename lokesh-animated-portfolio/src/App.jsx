import React, { useState } from "react";
import resume from "../Assets/Frontend_Resume.pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  Github,
  GraduationCap,
  Home,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Rocket,
  Send,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";

const skills = [
  { name: "HTML", level: 92, icon: "HTML5", type: "Frontend" },
  { name: "CSS", level: 88, icon: "CSS3", type: "Frontend" },
  { name: "JavaScript", level: 84, icon: "JS", type: "Frontend" },
  { name: "React.js", level: 82, icon: "⚛", type: "Frontend" },
  { name: "Tailwind CSS", level: 86, icon: "TW", type: "Frontend" },
  { name: "Java", level: 85, icon: "☕", type: "Backend" },
  { name: "Spring Boot", level: 78, icon: "SB", type: "Backend" },
  { name: "REST API", level: 80, icon: "API", type: "Backend" },
  { name: "MySQL", level: 82, icon: "SQL", type: "Database" },
  { name: "Git & GitHub", level: 84, icon: "GH", type: "Tools" },
];

const projects = [
  {
    title: "Mangala Arangam",
    description:
      "Wedding hall booking platform with hall discovery, booking management and responsive user interfaces.",
    tech: ["Java", "Spring Boot", "React", "MySQL"],
    gradient: "project-one",
  },
  {
    title: "Lost & Found Hub",
    description:
      "A public platform for reporting and discovering lost phones, documents, bags and pets.",
    tech: ["React", "MySQL", "Tailwind"],
    gradient: "project-two",
  },
  {
    title: "AI Road Damage Detection",
    description:
      "AI-based road damage detection with severity prediction and municipality complaint generation.",
    tech: ["Python", "YOLOv8", "OpenCV", "React"],
    gradient: "project-three",
  },
];

const navItems = [
  ["home", "Home", Home],
  ["about", "About", UserRound],
  ["skills", "Skills", Code2],
  ["projects", "Projects", BriefcaseBusiness],
  ["education", "Education", GraduationCap],
  ["profiles", "Profiles", Github],
  ["contact", "Contact", Mail],
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [skillTab, setSkillTab] = useState("Frontend");
  const [sent, setSent] = useState(false);

  const filteredSkills = skills.filter((skill) => skill.type === skillTab);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className={dark ? "app dark" : "app light"}>
      <div className="noise" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <header className="navbar">
        <button className="brand" onClick={() => goTo("home")}>
          <span className="brand-mark">&lt;/&gt;</span>
          <span>LOKESH J</span>
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {navItems.map(([id, label, Icon]) => (
            <button key={id} onClick={() => goTo(id)}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="theme-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="grid-lines" />
          <div className="particles">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.i
                key={i}
                animate={{
                  y: [0, -18, 0],
                  opacity: [0.25, 1, 0.25],
                  scale: [0.8, 1.25, 0.8],
                }}
                transition={{
                  duration: 2.5 + (i % 4),
                  repeat: Infinity,
                  delay: i * 0.12,
                }}
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 61) % 90}%`,
                }}
              />
            ))}
          </div>

          <div className="hero-content">
            <motion.div
              className="hero-copy"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.13 } },
              }}
            >
              <motion.div className="eyebrow" variants={fadeUp}>
                <Sparkles size={15} /> AVAILABLE FOR OPPORTUNITIES
              </motion.div>

              <motion.p className="hello" variants={fadeUp}>Hi, I'm</motion.p>

              <motion.h1 variants={fadeUp}>
                LOKESH <span>J</span>
              </motion.h1>

              <motion.div className="role" variants={fadeUp}>
                <span>Frontend Developer</span>
                <b>|</b>
                <strong>Java Developer</strong>
              </motion.div>

              <motion.p className="hero-description" variants={fadeUp}>
                I build modern, responsive web applications and robust backend
                systems with clean code, smooth UX and purposeful motion.
              </motion.p>

              <motion.div className="hero-buttons" variants={fadeUp}>
                <a className="btn primary" href="resume" download>
                  <Download size={17} /> Download Resume
                </a>
                <button className="btn outline" onClick={() => goTo("projects")}>
                  View My Work <ArrowDown size={17} />
                </button>
              </motion.div>

              <motion.div className="socials" variants={fadeUp}>
                <a href="https://github.com/Lokesh-max02" target="_blank" rel="noreferrer"><Github /></a>
                <a href="https://www.linkedin.com/in/lokesh-j" target="_blank" rel="noreferrer"><Linkedin /></a>
                <a href="lokeshj022004@gmail.com"><Mail /></a>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.75, rotateY: 25 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <div className="orbit orbit-a" />
              <div className="orbit orbit-b" />
              <div className="developer">
                <div className="developer-head">
                  <div className="hair" />
                  <div className="face">
                    <span className="eye left" />
                    <span className="eye right" />
                    <span className="smile" />
                  </div>
                </div>
                <div className="hoodie">
                  <div className="hoodie-string left-string" />
                  <div className="hoodie-string right-string" />
                  <div className="code-symbol">&lt;/&gt;</div>
                </div>
                <div className="laptop">
                  <div className="laptop-screen">
                    <span>const</span> developer = <b>"Lokesh"</b>;
                  </div>
                  <div className="laptop-base" />
                </div>
              </div>

              {["JS", "⚛", "☕", "SB", "SQL"].map((item, i) => (
                <motion.div
                  key={item}
                  className={`tech-float tech-${i}`}
                  animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
                >
                  {item}
                </motion.div>
              ))}

              <div className="platform">
                <span />
                <span />
                <span />
              </div>
            </motion.div>
          </div>

          <button className="scroll-indicator" onClick={() => goTo("about")}>
            <span>Scroll Down</span>
            <ArrowDown size={16} />
          </button>
        </section>

        <section id="about" className="section">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span>ABOUT ME</span>
            <h2>Get to know me<span>.</span></h2>
          </motion.div>

          <div className="about-grid">
            <motion.div className="about-text glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p>
                I'm a passionate Computer Science Engineering graduate focused
                on building beautiful, functional and user-friendly web
                applications.
              </p>
              <p>
                My main interests are frontend development, Java, Spring Boot,
                REST APIs and database-driven applications.
              </p>
              <button className="small-btn" onClick={() => goTo("contact")}>
                Let's connect <ArrowUpRight size={15} />
              </button>
            </motion.div>

            <div className="stats">
              {[
                ["01+", "Years Learning", "calendar"],
                ["06+", "Projects Built", "rocket"],
                ["200+", "DSA Problems", "code"],
                ["100%", "Dedication", "spark"],
              ].map(([number, label, icon], i) => (
                <motion.div
                  className="stat glass"
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, rotateX: 5 }}
                >
                  <div className="stat-icon">
                    {icon === "rocket" ? <Rocket /> : icon === "code" ? <Code2 /> : icon === "spark" ? <Sparkles /> : <BriefcaseBusiness />}
                  </div>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span>MY SKILLS</span>
            <h2>Technologies I work with<span>.</span></h2>
          </motion.div>

          <div className="skill-tabs">
            {["Frontend", "Backend", "Database", "Tools"].map((tab) => (
              <button className={skillTab === tab ? "active" : ""} key={tab} onClick={() => setSkillTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <motion.div className="skills-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  className="skill-card glass"
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="skill-top">
                    <div className="skill-icon">{skill.icon}</div>
                    <span>{skill.level}%</span>
                  </div>
                  <h3>{skill.name}</h3>
                  <div className="progress"><i style={{ width: `${skill.level}%` }} /></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="projects" className="section">
          <motion.div className="section-heading split-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div>
              <span>FEATURED PROJECTS</span>
              <h2>Some things I've built<span>.</span></h2>
            </div>
            <button className="small-btn">View All Projects <ArrowUpRight size={15} /></button>
          </motion.div>

          <div className="projects-grid">
            {projects.map((project, i) => (
              <motion.article
                className="project-card glass"
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -10 }}
              >
                <div className={`project-image ${project.gradient}`}>
                  <div className="project-window">
                    <span />
                    <span />
                    <span />
                    <div className="window-code">
                      <b>&lt;Project /&gt;</b>
                      <small>build · create · deploy</small>
                    </div>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={17} /></a>
                    <a href="#contact"><ArrowUpRight size={17} /></a>
                  </div>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="chips">
                    {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="education" className="section">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span>EDUCATION</span>
            <h2>My academic journey<span>.</span></h2>
          </motion.div>

          <div className="timeline">
            {[
              ["2022 — 2026", "B.E. Computer Science Engineering", "Al-Ameen Engineering College"],
              ["2021 — 2022", "Higher Secondary Education", "Vanmathi  Higher Secondary School"],
              ["2019 — 2020", "SSLC", "Vanmathi Higher Secondary School"],
            ].map(([year, title, place], i) => (
              <motion.div
                className="timeline-item"
                key={title}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="timeline-dot" />
                <time>{year}</time>
                <div className="timeline-card glass">
                  <h3>{title}</h3>
                  <p>{place}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="profiles" className="section">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span>CODING PROFILES</span>
            <h2>You can find me on<span>.</span></h2>
          </motion.div>

          <div className="profiles-grid">
            {[
              ["GitHub", "github.com/lokesh-j", <Github />],
              ["LinkedIn", "linkedin.com/in/lokesh-j", <Linkedin />],
              ["LeetCode", "leetcode.com/lokesh-j", <Code2 />],
              ["HackerRank", "hackerrank.com/lokesh-j", <Code2 />],
            ].map(([name, link, icon], i) => (
              <motion.a
                href="#contact"
                className="profile-card glass"
                key={name}
                whileHover={{ y: -7, x: 3 }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div>{icon}</div>
                <span><b>{name}</b>{link}</span>
                <ArrowUpRight />
              </motion.a>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="section-heading left">
                <span>CONTACT ME</span>
                <h2>Let's work together<span>!</span></h2>
              </div>
              <p className="contact-copy">
                Have a project, internship or developer opportunity in mind?
                Send me a message and let's build something useful.
              </p>
              <div className="contact-info">
                <a href="mailto:lokeshj022004@gmail.com"><Mail /> lokeshj022004@gmail.com</a>
                <a href="tel:+916379305846"><Phone /> +91 6379305846</a>
                <span><MapPin /> Tamil Nadu, India</span>
              </div>
            </motion.div>

            <motion.form
              className="contact-form glass"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setTimeout(() => setSent(false), 3000);
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="form-row">
                <input required placeholder="Your Name" />
                <input required type="email" placeholder="Your Email" />
              </div>
              <input placeholder="Subject" />
              <textarea required rows="6" placeholder="Your Message" />
              <button className="btn primary" type="submit">
                {sent ? "Message Sent ✓" : <>Send Message <Send size={16} /></>}
              </button>
            </motion.form>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 LOKESH J. All rights reserved.</span>
        <span>Built with <b>React</b> + Motion</span>
        <button onClick={() => goTo("home")}><ArrowUp size={16} /></button>
      </footer>
    </div>
  );
}

export default App;
