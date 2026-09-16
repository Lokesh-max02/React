  import React from "react";
import {
  ArrowRight, BrainCircuit, Cpu, Globe2, Rocket, Sparkles,
  Code2, ShieldCheck, Cloud, Bot, Leaf, HeartPulse, Factory,
  GraduationCap, Menu, X
} from "lucide-react";

const futureIT = [
  { icon: BrainCircuit, title: "AI Engineering", text: "Build reliable AI agents, intelligent products and human-AI workflows." },
  { icon: Code2, title: "Full-Stack Engineering", text: "Modern developers will combine strong fundamentals with AI-assisted development." },
  { icon: ShieldCheck, title: "Cybersecurity", text: "Protect autonomous systems, identities, infrastructure and AI models." },
  { icon: Cloud, title: "Cloud & Platform", text: "Design scalable infrastructure for AI-heavy applications and connected devices." }
];

const emerging = [
  ["01", "Advanced AI Agents", "More capable autonomous software may plan, use tools and complete multi-step work with human oversight."],
  ["02", "Quantum Computing", "Useful fault-tolerant quantum systems could open new possibilities in chemistry, optimization and simulation."],
  ["03", "Brain–Computer Interfaces", "Non-invasive and implantable interfaces may improve accessibility and human-computer interaction."],
  ["04", "Robotics + Embodied AI", "Robots may become more useful in logistics, healthcare, manufacturing, agriculture and homes."],
  ["05", "Spatial Computing", "AR/VR and 3D interfaces may become common for training, design, collaboration and entertainment."],
  ["06", "Clean Energy Tech", "Better batteries, fusion research, carbon removal and smart grids may reshape energy systems."]
];

const nonIT = [
  { icon: HeartPulse, title: "Healthcare & Bioengineering", text: "AI-assisted diagnosis, personalized medicine, medical robotics and biotechnology." },
  { icon: Leaf, title: "Climate & Energy", text: "Renewable energy, batteries, water technology, carbon management and climate adaptation." },
  { icon: Factory, title: "Advanced Manufacturing", text: "Robotics, additive manufacturing, smart factories and human-machine operations." },
  { icon: GraduationCap, title: "Education & Human Skills", text: "Teachers, trainers, researchers and people who can guide learning in an AI-rich world." }
];

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function FutureIT() {
  return (
    <section id="it" className="section">
      <SectionTitle
        eyebrow="01 · IT INDUSTRY"
        title="What could IT look like after 2030?"
        text="The biggest shift is likely to be from writing every line manually toward designing, supervising and integrating intelligent systems."
      />
      <div className="card-grid">
        {futureIT.map(({ icon: Icon, title, text }) => (
          <article className="glass-card" key={title}>
            <div className="icon"><Icon size={22} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#fit">Explore <ArrowRight size={15} /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

function BestFit() {
  return (
    <section id="fit" className="section dark-section">
      <SectionTitle
        eyebrow="02 · YOUR FUTURE FIT"
        title="What suits you best?"
        text="Based on your current learning direction—Java, React, JavaScript, Spring Boot, MySQL and full-stack development—these paths are strong matches."
      />
      <div className="fit-layout">
        <div className="fit-main">
          <div className="rank">01</div>
          <div>
            <h3>AI-Powered Full-Stack / Java Backend Engineer</h3>
            <p>Keep your Java + Spring Boot foundation, then add AI APIs, agentic workflows, cloud deployment, system design and security.</p>
            <div className="tags">
              <b>Java</b><b>Spring Boot</b><b>React</b><b>AI APIs</b><b>Cloud</b><b>System Design</b>
            </div>
          </div>
        </div>
        <div className="fit-side">
          <div><strong>02</strong><span>AI Application Engineer</span></div>
          <div><strong>03</strong><span>Cloud / Platform Engineer</span></div>
          <div><strong>04</strong><span>Cybersecurity Engineer</span></div>
        </div>
      </div>
      <div className="roadmap">
        <div><span>NOW</span><strong>Java + React + SQL + Git</strong></div>
        <ArrowRight />
        <div><span>NEXT</span><strong>Spring Boot + REST + Testing</strong></div>
        <ArrowRight />
        <div><span>2030+</span><strong>AI + Cloud + System Design</strong></div>
      </div>
    </section>
  );
}

function EmergingTech() {
  return (
    <section id="tech" className="section">
      <SectionTitle
        eyebrow="03 · EMERGING TECHNOLOGY"
        title="Technologies that may define the 2030s"
        text="These are forecasts, not guaranteed inventions. Some already exist in early forms and may become much more capable or commercially useful after 2030."
      />
      <div className="tech-grid">
        {emerging.map(([number, title, text]) => (
          <article className="tech-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeyondIT() {
  return (
    <section id="beyond" className="section dark-section">
      <SectionTitle
        eyebrow="04 · BEYOND IT"
        title="Future opportunities outside traditional IT"
        text="Technology will spread into almost every industry. You do not need to work in a software company to build a technology-driven career."
      />
      <div className="card-grid">
        {nonIT.map(({ icon: Icon, title, text }) => (
          <article className="glass-card" key={title}>
            <div className="icon"><Icon size={22} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="callout">
        <Sparkles size={22} />
        <div>
          <h3>The real future skill: adaptability</h3>
          <p>Learn fundamentals deeply, use AI as a multiplier, understand a real-world domain, and keep upgrading your skills.</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <nav className="nav">
        <a className="brand" href="#"><Rocket size={19} /> FUTURE<span>2030+</span></a>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <a href="#it" onClick={() => setOpen(false)}>IT Future</a>
          <a href="#fit" onClick={() => setOpen(false)}>My Fit</a>
          <a href="#tech" onClick={() => setOpen(false)}>New Tech</a>
          <a href="#beyond" onClick={() => setOpen(false)}>Beyond IT</a>
        </div>
      </nav>

      <header className="hero">
        <div className="orb orb-a"></div>
        <div className="orb orb-b"></div>
        <div className="hero-content">
          <div className="pill"><span></span> FUTURE EXPLORATION · 2030 → 2040</div>
          <h1>Build for the future.<br /><em>Not just the next job.</em></h1>
          <p>Explore how IT may evolve after 2030, discover the career path that fits your current skills, and see where technology could take the world beyond traditional software.</p>
          <div className="hero-actions">
            <a className="primary" href="#fit">See my future path <ArrowRight size={18} /></a>
            <a className="secondary" href="#tech">Explore technologies</a>
          </div>
          <div className="stats">
            <div><strong>4</strong><span>Future paths</span></div>
            <div><strong>6</strong><span>Emerging tech areas</span></div>
            <div><strong>2030+</strong><span>Time horizon</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="planet"><div className="planet-core"></div><div className="ring ring-1"></div><div className="ring ring-2"></div></div>
          <div className="float-card c1"><Bot size={18} /> AI AGENTS</div>
          <div className="float-card c2"><Cpu size={18} /> QUANTUM</div>
          <div className="float-card c3"><Globe2 size={18} /> SMART WORLD</div>
        </div>
      </header>

      <main>
        <FutureIT />
        <BestFit />
        <EmergingTech />
        <BeyondIT />
      </main>

      <footer>
        <span>FUTURE 2030+</span>
        <p>Designed as a student career-exploration project · Predictions are speculative.</p>
      </footer>
    </div>
  );
}

export default App;