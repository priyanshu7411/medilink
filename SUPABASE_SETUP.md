# Supabase Integration Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

## Step 2: Set Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Add your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  blood_group TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  access_code TEXT UNIQUE NOT NULL,
  conditions TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  emergency_contacts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  specialization TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  doctor TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('prescription', 'lab_result', 'diagnosis', 'note', 'scan')),
  title TEXT NOT NULL,
  content TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  doctor_id UUID REFERENCES doctors(id),
  doctor_name TEXT,
  department TEXT,
  ocr_extracted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  doctor TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  category TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab results table
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  normal_range TEXT,
  status TEXT CHECK (status IN ('normal', 'abnormal', 'borderline')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  body_part TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  facility TEXT,
  doctor TEXT,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergy reactions table
CREATE TABLE IF NOT EXISTS allergy_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  drug_name TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication reminders table
CREATE TABLE IF NOT EXISTS medication_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  times TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(medication_id)
);

-- Adherence logs table
CREATE TABLE IF NOT EXISTS adherence_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  timestamp BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_notes_patient_id ON notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_scans_patient_id ON scans(patient_id);
CREATE INDEX IF NOT EXISTS idx_allergy_reactions_patient_id ON allergy_reactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_patient_id ON medication_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_adherence_logs_medication_id ON adherence_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_patients_access_code ON patients(access_code);

-- Row Level Security (RLS) Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Patients can read/write their own data
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE USING (auth.uid() = id);

-- Doctors can read patient data (with access code)
-- This will be handled via access_code check in application logic

-- Patients can manage their own medications
CREATE POLICY "Patients can manage own medications" ON medications
  FOR ALL USING (auth.uid() = patient_id);

-- Patients can manage their own records
CREATE POLICY "Patients can manage own records" ON medical_records
  FOR ALL USING (auth.uid() = patient_id);

-- Similar policies for other tables...
CREATE POLICY "Patients can manage own notes" ON notes
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own lab results" ON lab_results
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own scans" ON scans
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own reactions" ON allergy_reactions
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own reminders" ON medication_reminders
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own adherence" ON adherence_logs
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage own contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = patient_id);
```

## Step 4: Update Authentication

The app will now use Supabase Auth instead of localStorage. Update your login flows to use the new auth service.

## Step 5: Test the Integration

1. Start the dev server: `npm run dev`
2. Try signing up a new patient
3. Check your Supabase dashboard to see the data

## Notes

- All data is now stored in Supabase instead of localStorage
- Authentication is handled by Supabase Auth
- Row Level Security (RLS) ensures patients can only access their own data
- Doctors access patient data via access codes (handled in application logic)

