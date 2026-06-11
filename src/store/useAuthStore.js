import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      set({ user: session.user, profile: profile || null, loading: false });
    } else {
      set({ user: null, profile: null, loading: false });
    }

    // Listen to auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        set({ user: session.user, profile: profile || null, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  signUp: async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    // Create their profile
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, full_name: fullName, role: role, is_verified: false }
      ])
      .select()
      .single();
      
    if (profileError) throw profileError;
    
    // Set the user and profile explicitly so it's available immediately
    set({ user: data.user, profile: newProfile, loading: false });
    
    return data;
  },

  sendOTP: async (phoneNumber) => {
    // In a production app, this would call Supabase auth.signInWithOtp or a custom Edge Function using Twilio.
    // For this prototype, we simulate a successful SMS send.
    set({ loading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        set({ loading: false });
        resolve({ success: true, message: 'OTP sent successfully to ' + phoneNumber });
      }, 1000);
    });
  },

  verifyOTP: async (phoneNumber, code) => {
    set({ loading: true });
    
    // Simulation: accept any 6 digit code as "123456" for testing
    if (code !== '123456') {
      set({ loading: false });
      throw new Error("Invalid verification code. Please try '123456'.");
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      set({ loading: false });
      throw new Error("No authenticated user found.");
    }

    const { profile } = get();

    // Use UPSERT instead of update. This forces the database to create the profile 
    // if it was mysteriously missing, completely eliminating 406 Not Acceptable errors!
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        phone_number: phoneNumber, 
        is_verified: true,
        role: profile?.role || 'giver',
        full_name: profile?.full_name || user.email?.split('@')[0] || 'User'
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase UPSERT Error:", error);
      set({ loading: false });
      throw new Error(error.message || "Failed to save verification to database.");
    }

    // Update local state
    set({ profile: data, loading: false });
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Fetch profile to know the role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    return { ...data, profile };
  },

  switchRole: async (newRole) => {
    const { user, profile } = get();
    if (!user) return;

    // Use upsert instead of update. This fixes "Ghost Accounts" where the Auth user 
    // exists but the profile was never created due to a previous database error.
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        role: newRole,
        full_name: profile?.full_name || user.email?.split('@')[0] || 'User',
        is_verified: profile?.is_verified || false
      });

    if (error) throw error;
    
    set({ profile: { ...profile, role: newRole, full_name: profile?.full_name || user.email?.split('@')[0] || 'User' } });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  }
}));

export default useAuthStore;
