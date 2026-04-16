import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('zh-TW');
}

function CommentItem({ comment, currentUserId, onDelete }) {
  const { user } = comment;
  const isOwner = currentUserId && currentUserId === comment.userId;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/comments/${comment.id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) onDelete(comment.id);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  return (
    <div className="comment-item fade-in">
      {/* Avatar */}
      <div className="comment-avatar">
        {user?.avatarPath
          ? <img src={user.avatarPath} alt={user.username}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'white' }}>
              {(user?.username?.[0] || '?').toUpperCase()}
            </span>
        }
      </div>

      {/* Body */}
      <div className="comment-body">
        <div className="comment-meta">
          <span className="comment-author">{user?.username || 'Unknown'}</span>
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
          {isOwner && (
            <button onClick={handleDelete} disabled={deleting}
              className="comment-delete" title="Delete comment">
              {deleting ? '…' : '🗑️'}
            </button>
          )}
        </div>
        {/* Content rendered as text — no innerHTML to prevent XSS */}
        <p className="comment-content">{comment.content}</p>
      </div>
    </div>
  );
}

export default function CommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const textRef = useRef();

  useEffect(() => {
    fetch('/api/v1/comments', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setComments(Array.isArray(d) ? d : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true); setError('');
    try {
      const res = await fetch('/api/v1/comments', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.errors?.[0]?.msg || 'Failed to post'); return; }
      setComments((prev) => [...prev, data]);
      setText('');
      textRef.current?.focus();
    } catch { setError('Network error.'); }
    finally { setPosting(false); }
  };

  const handleDelete = (id) => setComments((prev) => prev.filter((c) => c.id !== id));

  return (
    <main className="page fade-in">
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="section-label">Guestbook</p>
            <h1 className="section-title">Comments</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {comments.length} comment{comments.length !== 1 ? 's' : ''} — share your thoughts!
            </p>
          </div>

          {/* Compose box */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="comment-avatar" style={{ flexShrink: 0 }}>
                    {user.avatarPath
                      ? <img src={user.avatarPath} alt={user.username}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'white' }}>
                          {user.username[0].toUpperCase()}
                        </span>
                    }
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>Posting as <em>{user.username}</em></span>
                </div>
                {error && <div className="form-error" style={{ marginBottom: '0.75rem' }}>⚠️ {error}</div>}
                <form onSubmit={handlePost}>
                  <textarea
                    ref={textRef}
                    className="form-input"
                    style={{ resize: 'vertical', minHeight: 90, fontFamily: 'inherit' }}
                    placeholder="Write something kind…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={2000}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{text.length}/2000</span>
                    <button type="submit" className="btn btn-primary" disabled={posting || !text.trim()}>
                      {posting ? 'Posting…' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Please log in or register to leave a comment.
                </p>
                <Link to="/login" className="btn btn-primary">Login / Register</Link>
              </div>
            )}
          </div>

          {/* Comments list */}
          {loading ? (
            <div className="loader-wrap"><div className="spinner" /><span>Loading comments…</span></div>
          ) : comments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p>No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} currentUserId={user?.id} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
      <footer><p>© {new Date().getFullYear()} Man-Chen, Chao</p></footer>
    </main>
  );
}
