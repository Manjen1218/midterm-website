import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── helpers ─────────────────────────────────────────────────────
function AvatarPreview({ file, current }) {
  if (file) return <img src={URL.createObjectURL(file)} alt="preview"
    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
  if (current) return <img src={current} alt="avatar"
    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
  return <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: 'var(--accent3)' }}>MC</span>;
}

// ─── Register form ────────────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('email', form.email);
      fd.append('password', form.password);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await fetch('/api/v1/auth/register', {
        method: 'POST', credentials: 'include', body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.errors?.[0]?.msg || 'Registration failed'); return; }
      login(data.user);
      nav('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card fade-in">
      <div className="form-header">
        <div className="form-icon">✨</div>
        <h2>Create Account</h2>
        <p>Join and leave your mark on the comments board</p>
      </div>

      {/* Avatar picker */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="avatar-ring" style={{ width: 100, height: 100, cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => fileRef.current.click()}>
          <AvatarPreview file={avatarFile} />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-soft)', marginTop: '0.4rem' }}>
          Click to upload avatar (optional)
        </p>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => setAvatarFile(e.target.files[0] || null)} />
      </div>

      {error && <div className="form-error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" type="text" placeholder="your_username"
            value={form.username} onChange={set('username')} required maxLength={64} autoComplete="username" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="At least 8 characters"
            value={form.password} onChange={set('password')} required minLength={8} autoComplete="new-password" />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="form-footer">
        Already have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent3)', fontWeight: 500, fontSize: '0.85rem' }}>
          Log in
        </button>
      </div>
    </div>
  );
}

// ─── Login form ───────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      login(data.user);
      nav('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card fade-in">
      <div className="form-header">
        <div className="form-icon">🔐</div>
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>

      {error && <div className="form-error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Your password"
            value={form.password} onChange={set('password')} required autoComplete="current-password" />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="form-footer">
        New here?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent3)', fontWeight: 500, fontSize: '0.85rem' }}>
          Create account
        </button>
      </div>
    </div>
  );
}

// ─── Account panel (logged-in view) ──────────────────────────────
function AccountPanel() {
  const { user, logout, updateAvatar } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleLogout = async () => { await logout(); nav('/'); };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setMsg('');
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/v1/auth/avatar', { method: 'PATCH', credentials: 'include', body: fd });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'Upload failed'); return; }
      updateAvatar(data.avatarPath);
      setMsg('Avatar updated!');
    } catch { setMsg('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="form-card fade-in">
      <div className="form-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="avatar-ring" style={{ width: 100, height: 100, cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => fileRef.current.click()}>
            <AvatarPreview current={user.avatarPath} />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
        <p style={{ fontSize: '0.72rem', color: 'var(--text-soft)', marginBottom: '0.5rem' }}>
          {uploading ? 'Uploading…' : 'Click avatar to change'}
        </p>
        {msg && <div className={msg.includes('!') ? 'form-success' : 'form-error'}>{msg.includes('!') ? '✅' : '⚠️'} {msg}</div>}
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      <button onClick={handleLogout} className="btn btn-ghost btn-full" style={{ marginTop: '1rem' }}>
        Sign Out
      </button>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────
export default function LoginPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  return (
    <main className="page">
      <div className="form-page">
        {user
          ? <AccountPanel />
          : mode === 'login'
            ? <LoginForm onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')} />
        }
      </div>
      <footer><p>© {new Date().getFullYear()} Man-Chen, Chao</p></footer>
    </main>
  );
}
