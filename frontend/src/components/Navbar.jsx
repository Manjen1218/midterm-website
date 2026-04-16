import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">MC.</NavLink>

      <ul className="navbar-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/comments" className={({ isActive }) => isActive ? 'active' : ''}>Comments</NavLink></li>
        <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>{user ? 'Account' : 'Login'}</NavLink></li>
      </ul>

      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.avatarPath ? (
                <img src={user.avatarPath} alt={user.username}
                  style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent3)' }} />
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', color: 'white', fontWeight: 600
                }}>
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              Logout
            </button>
          </>
        )}
        <button className="theme-toggle" onClick={toggle}
          aria-label={dark ? 'Light mode' : 'Dark mode'} title={dark ? '☀️' : '🌙'} />
      </div>
    </nav>
  );
}
