import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, HeartHandshake, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page fade-in">
      <nav style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="container">
        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '800' }}>JobLelo</h1>
        <button className="btn btn-outline" onClick={() => navigate('/auth')}>Login / Signup</button>
      </nav>

      <main className="container" style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.1' }}>
          Earn Today. <br />
          <span style={{ color: 'var(--primary)' }}>Get Help Today.</span>
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          A hyperlocal micro-job marketplace connecting people who need small tasks done with nearby students ready to help.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button className="btn btn-primary" style={{ fontSize: '1.125rem' }} onClick={() => navigate('/auth')}>
            Post a Job
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '1.125rem' }} onClick={() => navigate('/auth')}>
            Find Work
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Simple Tasks</h3>
            <p style={{ color: 'var(--text-muted)' }}>From pet care to groceries, find help for everyday chores instantly.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--secondary)' }}>
              <HeartHandshake size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Community Driven</h3>
            <p style={{ color: 'var(--text-muted)' }}>Empowering students and Gen Z, while supporting our local seniors.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verified Users</h3>
            <p style={{ color: 'var(--text-muted)' }}>Every user undergoes a fast 4-hour verification to ensure safety and trust.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
