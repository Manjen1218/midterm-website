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
            <div style={{ marginTop: '2rem' }}>
              <a href="https://github.com/Manjen1218" target="_blank" rel="noreferrer"
                className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <span>🐙</span> GitHub Profile
              </a>
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
              <p className="section-label">Philosophy</p>
              <h3>What I Believe In</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { icon: '✨', title: 'Clean Code', desc: 'Readability and simplicity over cleverness.' },
                  { icon: '🚀', title: 'Ship It', desc: 'Done is better than perfect — iterate fast.' },
                  { icon: '🤝', title: 'Collaborate', desc: 'Great products are built by great teams.' },
                  { icon: '📚', title: 'Keep Learning', desc: 'Technology never stops — neither do I.' },
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
