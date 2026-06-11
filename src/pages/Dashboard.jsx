import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import { PlusCircle, BellOff, XCircle, Search, Users } from 'lucide-react';
import useJobStore from '../store/useJobStore';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'post'

  // Global state from Zustand
  const { giverJobs: jobs, toggleNotifications, cancelJob, addJob, fetchGiverJobs: fetchJobs } = useJobStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Form handling using react-hook-form
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // Add job to global state
    await addJob(data);
    // Reset form fields
    reset();
    // Switch back to jobs tab
    setActiveTab('jobs');
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Giver Dashboard" />

      <main className="container fade-in" style={{ flex: 1, padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
              Welcome, <span style={{ color: 'var(--primary)' }}>{profile?.full_name || 'Giver'}</span>!
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage your local tasks and find great help.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('post')}>
            <PlusCircle size={20} /> Post a Job
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button 
            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: activeTab === 'jobs' ? '700' : '500', color: activeTab === 'jobs' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: activeTab === 'jobs' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => setActiveTab('jobs')}
          >
            My Active Jobs
          </button>
          <button 
            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: activeTab === 'post' ? '700' : '500', color: activeTab === 'post' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: activeTab === 'post' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => setActiveTab('post')}
          >
            Post New Job
          </button>
        </div>

        {activeTab === 'jobs' && (
          <div className="fade-in">
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', borderRadius: 'var(--border-radius)', border: '1px dashed var(--border-color)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <PlusCircle size={40} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>You Haven't Posted Any Jobs Yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto' }}>As a Giver, the jobs you create will appear here. Post a new job to start finding local Takers!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {jobs.map(job => (
                  <div key={job.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{job.title}</h3>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', background: job.status === 'Open' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: job.status === 'Open' ? '#34d399' : '#fbbf24', border: job.status === 'Open' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)' }}>
                          {job.status}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>📍 {job.location}</span> 
                        <span style={{ color: 'var(--border-color)' }}>|</span> 
                        <span>⏱️ {job.duration}</span>
                        <span style={{ color: 'var(--border-color)' }}>|</span> 
                        <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>💵 {job.payment}</span>
                      </p>
                      
                      {job.status === 'Open' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'inline-flex' }}>
                          <Users size={18} color="var(--primary)" />
                          <p style={{ fontWeight: '600', color: 'var(--primary)' }}>
                            {job.applicantsCount > 0 ? `${job.applicantsCount} Takers applied` : '0 Takers applied'}
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontWeight: '500' }}>Worker: <span style={{ color: 'var(--primary)' }}>{job.worker}</span></p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.75rem 1rem', borderRadius: '12px' }} title="Review Applicants" onClick={() => navigate(`/applicants/${job.id}`)}>
                        <Search size={20} /> Review ({job.applicantsCount})
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.75rem', borderRadius: '12px', background: job.notificationsPaused ? 'rgba(239, 68, 68, 0.1)' : 'transparent', borderColor: job.notificationsPaused ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)', color: job.notificationsPaused ? '#f87171' : 'var(--text-main)' }} 
                        title={job.notificationsPaused ? "Resume Notifications" : "Pause Notifications"}
                        onClick={() => toggleNotifications(job.id)}
                      >
                        <BellOff size={20} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.75rem', borderRadius: '12px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }} title="Cancel Job" onClick={() => {
                        if(window.confirm('Are you sure you want to cancel this job?')) {
                          cancelJob(job.id);
                        }
                      }}>
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="fade-in glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>Post a New Job</h3>
              <p style={{ color: 'var(--text-muted)' }}>Fill in the details to find the perfect Taker.</p>
            </div>
            
            <form style={{ display: 'grid', gap: '1.5rem' }} onSubmit={handleSubmit(onSubmit)}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Job Title</label>
                  <input type="text" className="input-field" placeholder="e.g. Need help carrying groceries" required {...register('title')} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Category</label>
                  <select className="input-field" required {...register('category')}>
                    <option value="">Select a category</option>
                    <option value="pet">Pet Care</option>
                    <option value="chores">Household Chores</option>
                    <option value="delivery">Delivery & Pickup</option>
                    <option value="tech">Tech / Assignment Help</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Description</label>
                <textarea className="input-field" rows="4" placeholder="Describe exactly what you need help with..." required {...register('description')}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Location</label>
                  <input type="text" className="input-field" placeholder="Full address or neighborhood" required {...register('location')} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Estimated Duration</label>
                  <input type="text" className="input-field" placeholder="e.g. 1 hour, 30 mins" required {...register('duration')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Total Payment</label>
                  <input type="text" className="input-field" placeholder="e.g. $25" required {...register('payment')} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Expertise Level</label>
                  <select className="input-field" {...register('expertiseLevel')}>
                    <option>Any / Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Headcount Needed</label>
                  <input type="number" className="input-field" defaultValue="1" min="1" required {...register('headcount')} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveTab('jobs')}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Post Job Live</button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
