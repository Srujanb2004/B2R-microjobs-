-- Create the profiles table (extends the default Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('giver', 'taker')),
  rating NUMERIC DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  phone_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  giver_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  payment TEXT NOT NULL,
  expertise_level TEXT,
  headcount INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed', 'Cancelled')),
  notifications_paused BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the applications table (Takers applying for Jobs)
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  taker_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, taker_id) -- A taker can only apply to a job once
);

-- Enable Row Level Security (RLS) to keep data secure
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (or you could restrict this too, but usually names are public)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
-- Allow users to insert/update their own profile
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- JOBS POLICIES
-- Users can read a job if they are the Giver who created it, OR if the job is Open (for Takers to see)
CREATE POLICY "Jobs viewable by owner or if open." ON jobs FOR SELECT USING (
  auth.uid() = giver_id OR status = 'Open'
);
-- Only the Giver can create/update their own jobs
CREATE POLICY "Givers can insert their own jobs." ON jobs FOR INSERT WITH CHECK (auth.uid() = giver_id);
CREATE POLICY "Givers can update their own jobs." ON jobs FOR UPDATE USING (auth.uid() = giver_id);
CREATE POLICY "Givers can delete their own jobs." ON jobs FOR DELETE USING (auth.uid() = giver_id);

-- APPLICATIONS POLICIES
-- Users can read an application if they are the Taker who applied, OR the Giver who owns the job
CREATE POLICY "Applications viewable by applicant or job owner." ON applications FOR SELECT USING (
  auth.uid() = taker_id OR 
  auth.uid() IN (SELECT giver_id FROM jobs WHERE jobs.id = applications.job_id)
);
-- Takers can apply
CREATE POLICY "Takers can insert applications." ON applications FOR INSERT WITH CHECK (auth.uid() = taker_id);
-- Givers can update application status (accept/reject)
CREATE POLICY "Givers can update applications for their jobs" ON applications FOR UPDATE USING (
  auth.uid() IN (SELECT giver_id FROM jobs WHERE jobs.id = applications.job_id)
);
