import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Projects', value: '12+' },
  { label: 'Technologies', value: '20+' },
  { label: 'Years of Experience', value: '3+' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="page">
      <section className="hero fade-in">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <p className="hero-subtitle">Welcome to</p>
        <h1 className="hero-title">
          Man-Chen, Chao's<br />
          <em>Personal Page</em>
        </h1>
        <p className="hero-desc">
          Software developer, builder, and lifelong learner.
          Crafting thoughtful digital experiences one commit at a time.
        </p>

        <div className="hero-cta">
          <Link to="/about" className="btn btn-primary">Explore My Story →</Link>
          <Link to="/comments" className="btn btn-ghost">
            {user ? 'Leave a Comment' : 'View Comments'}
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', fontWeight: '300',
                background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', lineHeight: 1, marginBottom: '0.4rem'
              }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Man-Chen, Chao — Built with React &amp; Express</p>
      </footer>
    </main>
  );
}
