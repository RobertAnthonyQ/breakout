'use client';

import { useState, useEffect } from 'react';
import './admin.css';
import { Opportunity } from '@/types';
import { withBasePath } from '@/src/lib/base-path';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'breakout-admin-2026') {
      setIsAuthenticated(true);
      fetchOpportunities();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch(withBasePath('/api/admin/opportunities'));
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(withBasePath('/api/admin/opportunities'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        fetchOpportunities();
      } else {
        alert('Hubo un error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <h1 className="admin-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="admin-auth-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="admin-auth-btn">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  const pendingOpps = opportunities.filter(o => !o.verified);
  const approvedOpps = opportunities.filter(o => o.verified);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración — Opportunities Hub</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pendientes de revisión ({pendingOpps.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Aprobadas ({approvedOpps.length})
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-list">
          {activeTab === 'pending' && pendingOpps.length === 0 && (
            <p>No hay oportunidades pendientes.</p>
          )}
          {activeTab === 'approved' && approvedOpps.length === 0 && (
            <p>No hay oportunidades aprobadas.</p>
          )}

          {activeTab === 'pending' && pendingOpps.map(opp => (
            <div key={opp.id} className="admin-card">
              <div className="admin-card-content">
                <h3 className="admin-card-title">{opp.title}</h3>
                <div className="admin-card-meta">
                  {opp.organization} • {opp.category} • Deadline: {opp.deadline}
                </div>
                <p className="admin-card-desc">{opp.description.substring(0, 150)}...</p>
              </div>
              <div className="admin-card-actions">
                <button
                  className="admin-btn admin-btn-approve"
                  onClick={() => handleAction(opp.id, 'approve')}
                >
                  Aprobar
                </button>
                <button
                  className="admin-btn admin-btn-reject"
                  onClick={() => handleAction(opp.id, 'reject')}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'approved' && approvedOpps.map(opp => (
            <div key={opp.id} className="admin-card">
              <div className="admin-card-content">
                <h3 className="admin-card-title">{opp.title}</h3>
                <div className="admin-card-meta">
                  {opp.organization} • {opp.category} • Deadline: {opp.deadline}
                </div>
                <p className="admin-card-desc">{opp.description.substring(0, 150)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
