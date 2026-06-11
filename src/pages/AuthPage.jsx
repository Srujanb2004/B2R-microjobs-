import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, HandHeart } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  
  const [step, setStep] = useState('auth'); // 'auth', 'role-selection'
  const [isLogin, setIsLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        // After successful login, send them to the role selector so they can choose!
        setStep('role-selection');
      } else {
        // If sign up, we need them to select a role first before creating account
        setStep('role-selection');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        // If logging in, just switch their active role in the database
        await useAuthStore.getState().switchRole(role);
      } else {
        // If signing up, create the user
        await signUp(email, password, fullName, role);
      }
      
      if (role === 'giver') {
        navigate('/verify');
      } else {
        navigate('/verify');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process request');
      setStep('auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        
        {step === 'auth' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                <User size={32} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Login to continue' : 'Sign up to get started'}</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                  <input type="text" className="input-field" placeholder="John Doe" required value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                <input type="email" className="input-field" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                <input type="password" className="input-field" placeholder="••••••••" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Continue')}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        )}

        {step === 'role-selection' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>What brings you here?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Choose how you want to use JobLelo</p>

            {errorMsg && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                disabled={loading}
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: 'auto', borderWidth: '2px', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                onClick={() => handleRoleSelection('giver')}
              >
                <div style={{ color: 'var(--primary)' }}><HandHeart size={32} /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>I need help (Giver)</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 'normal' }}>Post jobs and find local workers.</p>
                </div>
              </button>

              <button 
                className="btn btn-outline" 
                disabled={loading}
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: 'auto', borderWidth: '2px', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                onClick={() => handleRoleSelection('taker')}
              >
                <div style={{ color: 'var(--secondary)' }}><Briefcase size={32} /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>I want to work (Taker)</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 'normal' }}>Find local tasks and earn money.</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
