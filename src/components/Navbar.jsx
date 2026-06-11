import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ArrowRightLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const { user, profile, signOut, switchRole } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSwitchRole = async () => {
    const newRole = profile?.role === 'giver' ? 'taker' : 'giver';
    await switchRole(newRole);
    navigate(newRole === 'giver' ? '/dashboard' : '/taker-dashboard');
  };

  return (
    <nav style={{ background: 'var(--surface-color)', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 
          style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'Outfit' }}
          onClick={() => navigate('/')}
        >
          JobLelo
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontWeight: '500' }}>{title}</span>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={handleSwitchRole} 
                className="btn btn-outline" 
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                title="Switch Role"
              >
                <ArrowRightLeft size={16} /> Switch to {profile?.role === 'giver' ? 'Taker' : 'Giver'}
              </button>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <LogOut size={16} /> Logout
              </button>
              <UserCircle size={28} color="var(--primary)" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
