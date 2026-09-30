'use client';

import { useCallback, useEffect, useState } from 'react';
import './admin.css';
import { withBasePath } from '@/src/lib/base-path';
import type { SuggestionSummary } from '@/src/lib/opportunities';

type AuthState = 'checking' | 'signed-out' | 'signed-in';

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('checking');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [suggestions, setSuggestions] = useState<SuggestionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // The session lives in an httpOnly cookie: asking for the list tells us whether we are signed in
  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(withBasePath('/api/admin/opportunities'));
      if (res.status === 401) {
        setAuth('signed-out');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? 'No se pudo cargar la lista');
        setAuth('signed-in');
        return;
      }
      setSuggestions(data);
      setAuth('signed-in');
    } catch {
      setMessage('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch(withBasePath('/api/admin/session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setPassword('');
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? 'No se pudo iniciar sesión');
      return;
    }
    fetchSuggestions();
  };

  const handleLogout = async () => {
    await fetch(withBasePath('/api/admin/session'), { method: 'DELETE' });
    setSuggestions([]);
    setAuth('signed-out');
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setMessage(null);
    const res = await fetch(withBasePath('/api/admin/opportunities'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    if (res.status === 401) {
      setAuth('signed-out');
      return;
    }
    if (!res.ok) {
      setMessage('No se pudo actualizar la sugerencia');
      return;
    }
    fetchSuggestions();
  };

  if (auth === 'checking') {
    return <div className="admin-auth-container"><p>Cargando…</p></div>;
  }

  if (auth === 'signed-out') {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <h1 className="admin-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="admin-auth-input"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="admin-auth-btn">Ingresar</button>
          </form>
          {message && <p role="alert" style={{ marginTop: '1rem', color: '#B42318' }}>{message}</p>}
        </div>
      </div>
    );
  }

  const pending = suggestions.filter((s) => s.status === 'draft');
  const reviewed = suggestions.filter((s) => s.status !== 'draft');
  const visible = activeTab === 'pending' ? pending : reviewed;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Sugerencias de la comunidad — Opportunities Hub</h1>
        <button type="button" className="admin-tab" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {message && <p role="alert" style={{ color: '#B42318', marginBottom: '1rem' }}>{message}</p>}

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pendientes de revisión ({pending.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'reviewed' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviewed')}
        >
          Revisadas ({reviewed.length})
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-list">
          {visible.length === 0 && (
            <p>{activeTab === 'pending' ? 'No hay sugerencias pendientes.' : 'Todavía no hay sugerencias revisadas.'}</p>
          )}

          {visible.map((opp) => (
            <div key={opp.id} className="admin-card">
              <div className="admin-card-content">
                <h3 className="admin-card-title">{opp.title}</h3>
                <div className="admin-card-meta">
                  {opp.organization} • {opp.category} • Deadline: {opp.deadline}
                  {opp.status !== 'draft' && ` • ${opp.status === 'active' ? 'Publicada' : 'Rechazada'}`}
                </div>
                <p className="admin-card-desc">{opp.description.substring(0, 150)}...</p>
                <a href={opp.application_url} target="_blank" rel="noreferrer noopener" className="admin-card-meta">
                  {opp.application_url}
                </a>
              </div>
              {opp.status === 'draft' && (
                <div className="admin-card-actions">
                  <button className="admin-btn admin-btn-approve" onClick={() => handleAction(opp.id, 'approve')}>
                    Aprobar
                  </button>
                  <button className="admin-btn admin-btn-reject" onClick={() => handleAction(opp.id, 'reject')}>
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
