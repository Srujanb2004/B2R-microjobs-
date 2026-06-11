import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const VerificationPage = () => {
  const navigate = useNavigate();
  const { profile, sendOTP, verifyOTP } = useAuthStore();
  
  const [step, setStep] = useState('phone'); // 'phone', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If they are already verified, redirect them
  if (profile?.is_verified) {
    if (profile.role === 'giver') navigate('/dashboard');
    else navigate('/taker-dashboard');
    return null;
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    
    setErrorMsg('');
    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      setSuccessMsg(`Code sent to ${phoneNumber}.`);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg('Please enter the 6-digit code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const updatedProfile = await verifyOTP(phoneNumber, otp);
      
      // Verification Success! Route to correct dashboard
      if (updatedProfile?.role === 'giver') {
        navigate('/dashboard');
      } else {
        navigate('/taker-dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--secondary)' }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Verify Your Identity</h2>
          <p style={{ color: 'var(--text-muted)' }}>To keep our community safe, all users must verify their phone number.</p>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {step === 'phone' && (
          <form className="fade-in" onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="(555) 000-0000" 
                  style={{ paddingLeft: '3rem', fontSize: '1.125rem' }} 
                  required 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>We'll send you a 6-digit verification code.</p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'} <ArrowRight size={20} />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="fade-in" onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Enter 6-Digit Code</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="123456" 
                style={{ fontSize: '2rem', letterSpacing: '0.5rem', textAlign: 'center', fontWeight: '700' }} 
                maxLength={6}
                required 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                For this testing phase, enter <strong>123456</strong>
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <button 
              type="button" 
              onClick={() => { setStep('phone'); setSuccessMsg(''); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Change phone number
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={async () => {
              try {
                await useAuthStore.getState().signOut();
              } catch (e) {
                console.error("Sign out error", e);
              } finally {
                // ALWAYS force navigate and clear local state, even if Supabase fails
                useAuthStore.setState({ user: null, profile: null });
                navigate('/auth');
              }
            }}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign out and try a different account
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
