import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, MapPin, DollarSign, Clock } from 'lucide-react';
import useJobStore from '../store/useJobStore';

const TakerDashboard = () => {
  const { takerJobs: jobs, applyToJob, fetchTakerJobs: fetchJobs } = useJobStore();
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Show only open jobs
  const availableJobs = jobs.filter(j => j.status === 'Open');

  const handleApply = (id) => {
    applyToJob(id);
    alert(`Applied for Job! The Giver will review your profile.`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Taker Dashboard" />
      
      <main className="container fade-in" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Find Jobs Near You</h2>
            <p style={{ color: 'var(--text-muted)' }}>Browse simple tasks and earn today.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Earnings</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>$145.00</h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input type="text" className="input-field" placeholder="Search for 'delivery' or 'cleaning'..." style={{ paddingLeft: '3rem' }} />
          </div>
          <button className="btn btn-outline">Filter by Location</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {availableJobs.map(job => (
            <div key={job.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', background: 'rgba(79,70,229,0.1)', padding: '0.2rem 0.6rem', borderRadius: '99px', display: 'inline-block', marginBottom: '0.75rem' }}>
                  {job.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{job.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Posted by {job.giver || 'Local Giver'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <DollarSign size={16} color="var(--secondary)" /> {job.payment}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <Clock size={16} color="var(--primary)" /> {job.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <MapPin size={16} color="var(--text-muted)" /> {job.distance}
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleApply(job.id)}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TakerDashboard;
