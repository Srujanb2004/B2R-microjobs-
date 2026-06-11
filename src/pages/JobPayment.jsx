import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CreditCard, CheckCircle, Star } from 'lucide-react';

const JobPayment = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [paymentStatus, setPaymentStatus] = useState('unpaid'); // unpaid, half-paid, full-paid
  const [jobStatus, setJobStatus] = useState('in-progress'); // in-progress, completed
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handlePayHalf = () => {
    if (confirm("Proceed to pay 50% ($10) to the worker?")) {
      setPaymentStatus('half-paid');
    }
  };

  const handlePayFull = () => {
    if (confirm("Proceed to pay the remaining balance ($10) to the worker?")) {
      setPaymentStatus('full-paid');
      setJobStatus('completed');
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    alert(`Review submitted! Rating: ${rating} Stars. Returning to Dashboard.`);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Job Tracking & Payment" />
      
      <main className="container fade-in" style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '800px' }}>
        <button className="btn btn-outline" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </button>

        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Help moving couch upstairs</h2>
              <p style={{ color: 'var(--text-muted)' }}>Worker: <strong style={{ color: 'var(--primary)' }}>Alex Smith</strong></p>
            </div>
            <span style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', background: jobStatus === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: jobStatus === 'completed' ? 'var(--secondary)' : '#3B82F6' }}>
              {jobStatus === 'completed' ? 'Job Completed' : 'In Progress'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Milestones</h3>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: paymentStatus !== 'unpaid' ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CreditCard size={24} color={paymentStatus !== 'unpaid' ? 'var(--secondary)' : 'var(--text-muted)'} />
                  <div>
                    <h4 style={{ fontWeight: '600' }}>Initial Deposit (50%)</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pay half to start the job.</p>
                  </div>
                </div>
                {paymentStatus === 'unpaid' ? (
                  <button className="btn btn-primary" onClick={handlePayHalf}>Pay $10.00</button>
                ) : (
                  <span style={{ color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={20} /> Paid</span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: paymentStatus === 'full-paid' ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CreditCard size={24} color={paymentStatus === 'full-paid' ? 'var(--secondary)' : 'var(--text-muted)'} />
                  <div>
                    <h4 style={{ fontWeight: '600' }}>Final Payment (50%)</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pay remainder upon completion.</p>
                  </div>
                </div>
                {paymentStatus === 'full-paid' ? (
                  <span style={{ color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={20} /> Paid</span>
                ) : (
                  <button className="btn btn-primary" onClick={handlePayFull} disabled={paymentStatus === 'unpaid'}>
                    Pay $10.00
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {jobStatus === 'completed' && (
          <div className="glass-panel fade-in" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Rate your Worker</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>How did Alex do? Your review helps the community.</p>
            
            <form onSubmit={submitReview}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={32} 
                    fill={star <= rating ? "#F59E0B" : "transparent"} 
                    color={star <= rating ? "#F59E0B" : "var(--border-color)"}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => setRating(star)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
              
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="Write a brief review..." 
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                style={{ marginBottom: '1rem' }}
              ></textarea>
              
              <button type="submit" className="btn btn-secondary" disabled={rating === 0}>
                Submit Review
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobPayment;
