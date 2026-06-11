import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, MapPin, CheckCircle, XCircle } from 'lucide-react';
import useJobStore from '../store/useJobStore';

const ApplicantReview = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  // Get from global state
  const { giverJobs: jobs, applicants: allApplicants, updateApplicantStatus, fetchGiverJobs, fetchApplicants } = useJobStore();
  
  useEffect(() => {
    fetchGiverJobs();
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [fetchGiverJobs, fetchApplicants, jobId]);
  
  // Find current job to display its title
  const currentJob = jobs.find(j => j.id.toString() === jobId);
  
  // Filter applicants for this job
  // In our mock, if jobId doesn't match exactly, we'll just show them anyway if it's the default ones to not break the UI
  const applicants = allApplicants.filter(a => a.jobId.toString() === jobId || !jobId);

  const handleAction = (id, action) => {
    updateApplicantStatus(id, action);
    if (action === 'accepted') {
      alert('Applicant Accepted! Navigating to Job Tracking & Payment.');
      navigate(`/payment/${jobId}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Review Applicants" />
      
      <main className="container fade-in" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <button className="btn btn-outline" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Applicants for "{currentJob ? currentJob.title : 'Help moving couch'}"</h2>
          <p style={{ color: 'var(--text-muted)' }}>Review taker profiles and select the best fit for your job.</p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {applicants.map(app => (
            <div key={app.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {app.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {app.name} 
                    {app.isVerified && <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--secondary)', padding: '0.2rem 0.5rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12} /> Verified</span>}
                    {app.acceptanceRate === '95%' && <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--secondary)', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>Top Rated</span>}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{app.role}</p>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#4B5563', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" /> {app.rating} ({app.reviews} reviews)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={16} color="var(--secondary)" /> {app.acceptanceRate} Acceptance
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={16} /> {app.distance}
                    </div>
                  </div>
                </div>
              </div>

              {app.status === 'pending' ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn" style={{ border: '1px solid #EF4444', color: '#EF4444', background: 'transparent' }} onClick={() => handleAction(app.id, 'rejected')}>
                    Decline
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleAction(app.id, 'accepted')}>
                    Accept Worker
                  </button>
                </div>
              ) : (
                <span style={{ fontWeight: '600', color: app.status === 'accepted' ? 'var(--secondary)' : '#EF4444' }}>
                  {app.status === 'accepted' ? 'Accepted' : 'Declined'}
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApplicantReview;
