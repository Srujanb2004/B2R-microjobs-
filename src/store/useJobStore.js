import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useJobStore = create((set, get) => ({
  giverJobs: [],
  takerJobs: [],
  applicants: [],
  loading: false,

  fetchGiverJobs: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return set({ loading: false });

    // Fetch ONLY jobs created by this specific user
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles:giver_id (full_name),
        applications (count)
      `)
      .eq('giver_id', user.id)
      .order('created_at', { ascending: false });
      
    if (!error && jobs) {
      const formattedJobs = jobs.map(j => ({
        ...j,
        giver: j.profiles?.full_name,
        applicantsCount: j.applications[0]?.count || 0 
      }));
      set({ giverJobs: formattedJobs, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchTakerJobs: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch ONLY open jobs created by OTHER people
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles:giver_id (full_name)
      `)
      .eq('status', 'Open')
      .order('created_at', { ascending: false });
      
    if (user) {
      query = query.neq('giver_id', user.id);
    }

    const { data: jobs, error } = await query;
      
    if (!error && jobs) {
      const formattedJobs = jobs.map(j => ({
        ...j,
        giver: j.profiles?.full_name
      }));
      set({ takerJobs: formattedJobs, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchApplicants: async (jobId) => {
    if (!jobId) return;
    
    // Fetch ONLY applications for this specific job
    const { data: applicants, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles:taker_id (full_name, role, rating, reviews, is_verified)
      `)
      .eq('job_id', jobId);
      
    if (!error && applicants) {
      const formattedApplicants = applicants.map(a => ({
        id: a.id,
        jobId: a.job_id,
        name: a.profiles?.full_name,
        role: a.profiles?.role,
        rating: a.profiles?.rating,
        reviews: a.profiles?.reviews,
        isVerified: a.profiles?.is_verified,
        acceptanceRate: 'N/A',
        distance: 'N/A',
        status: a.status
      }));
      set({ applicants: formattedApplicants });
    }
  },

  addJob: async (newJob) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        giver_id: user.id,
        title: newJob.title,
        category: newJob.category,
        description: newJob.description,
        location: newJob.location,
        duration: newJob.duration,
        payment: newJob.payment,
        expertise_level: newJob.expertiseLevel,
        headcount: parseInt(newJob.headcount) || 1,
        status: 'Open',
        notifications_paused: false
      }])
      .select();

    if (!error && data) {
      get().fetchGiverJobs();
    }
  },

  toggleNotifications: async (id) => {
    const job = get().giverJobs.find(j => j.id === id);
    if (!job) return;

    const { error } = await supabase
      .from('jobs')
      .update({ notifications_paused: !job.notifications_paused })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        giverJobs: state.giverJobs.map(j => 
          j.id === id ? { ...j, notifications_paused: !job.notifications_paused } : j
        )
      }));
    }
  },

  cancelJob: async (id) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (!error) {
      set((state) => ({
        giverJobs: state.giverJobs.filter(j => j.id !== id)
      }));
    }
  },

  applyToJob: async (jobId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        taker_id: user.id,
        status: 'pending'
      }]);
      
    if (!error) {
      get().fetchApplicants(jobId);
      get().fetchTakerJobs();
    }
  },

  updateApplicantStatus: async (id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        applicants: state.applicants.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      }));
    }
  }
}));

export default useJobStore;
