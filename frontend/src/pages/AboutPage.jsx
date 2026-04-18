import avatarImg from '../assets/avatar.jpg';

export default function AboutPage() {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js',
    'Node.js', 'Express', 'Python', 'PostgreSQL',
    'MariaDB', 'Docker', 'Git', 'REST APIs',
    'CSS / Tailwind', 'Linux', 'Vite',
  ];

  const timeline = [
    { year: '2026 – Present', title: 'MS in NTU EE Cyber', desc: 'Study in topics like cyber security, LLM, and semantic communication.' },
    { year: '2025 – 2026', title: 'Software R&D ✦ Full-Stack Developer', desc: 'Building web applications with React, Node.js, and RESTful APIs.' },
    { year: '2024 - 2025', title: 'Exchange Student in Fudan University', desc: 'Contributing to various projects on GitHub, focusing on developer tooling and UI libraries.' },
    { year: '2020 – 2024', title: 'BS in NYCU Computer Science', desc: 'Deepened expertise in data structures, algorithms, and software engineering principles.' },
    { year: '2020', title: 'Started Coding Journey', desc: 'Fell in love with web development through building personal projects.' },
  ];

  return (
    <main className="page fade-in">
      <div className="container">
        <div className="about-layout">
          <aside className="about-sidebar">
            <div className="avatar-ring" style={{ overflow: 'hidden' }}>
              <img src={avatarImg} alt="Man-Chen Chao"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.25rem' }}>
              Man-Chen, Chao
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Software Developer · Taiwan 🇹🇼
            </p>
            <div className="badge-list">
              <span className="badge">🌐 Web Development</span>
              <span className="badge">⚡ Full-Stack</span>
              <span className="badge">🎨 UI/UX Enthusiast</span>
              <span className="badge">📦 Cyber Security</span>
            </div>
          </aside>

          <div className="about-content">
            <div className="about-section">
              <p className="section-label">About Me</p>
              <h1 className="section-title">Hello, I'm <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Man-Chen</em></h1>
              <p>I'm a passionate software developer based in Taiwan with a love for crafting clean, efficient, and beautiful web applications. I enjoy the entire process of building — from architecting the backend to polishing the frontend experience.</p>
              <p>My journey in programming started with curiosity and has grown into a deep appreciation for both the technical and creative aspects of software development. I believe good code should be readable, maintainable, and a little bit elegant.</p>
              <p>When I'm not coding, I'm exploring new technologies, contributing to open source projects on GitHub, or learning about design systems and UX principles.</p>
            </div>

            <div className="about-section">
              <p className="section-label">Tech Stack</p>
              <h3>Skills &amp; Technologies</h3>
              <div className="skill-grid">
                {skills.map((s) => <div key={s} className="skill-chip">{s}</div>)}
              </div>
            </div>

            <div className="about-section">
              <p className="section-label">Journey</p>
              <h3>Timeline</h3>
              <div className="timeline">
                {timeline.map((item) => (
                  <div key={item.year} className="timeline-item">
                    <div className="timeline-year">{item.year}</div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-section">
              <p className="section-label">What's More</p>
              <h3>How AI Assists in Development?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { 
                    icon: '💡', 
                    title: 'AI for Frontend', 
                    desc: 'You can prompt AI to generate UI components by simply describing what you need. For example, ask AI to "Create a responsive navigation bar in HTML and CSS" or "Generate a React component for a user profile page." With clear prompts, AI helps speed up design and development.'
                  },
                  { 
                    icon: '⚙️', 
                    title: 'AI for Backend', 
                    desc: 'Backend tasks like API creation or database design can be automated with AI. A simple prompt like "Generate a REST API in Node.js with JWT authentication" or "Create a PostgreSQL schema for a blog" can save hours of coding and debugging.'
                  },
                  { 
                    icon: '🤖', 
                    title: 'Claude AI', 
                    desc: 'Claude AI helps developers by providing suggestions, generating code, and debugging. You can interact with Claude by asking specific programming-related questions, such as "How do I implement user authentication in Express?"'
                  },
                  { 
                    icon: '💻', 
                    title: 'Automate Tasks', 
                    desc: 'AI can automate repetitive tasks, like generating boilerplate code or creating test cases. Simply prompt AI with something like "Generate HTML for a basic webpage layout."'
                  },
                ].map((v) => (
                  <div key={v.title} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{v.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.95rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer><p>© {new Date().getFullYear()} Man-Chen, Chao</p></footer>
    </main>
  );
}
