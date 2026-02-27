-- MediLink Healthcare Platform - Database Schema
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PATIENTS TABLE
-- ============================================
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

-- ============================================
-- DOCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  specialization TEXT,
  email TEXT UNIQUE NOT NULL,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEDICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  doctor TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  override_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEDICAL RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
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

-- ============================================
-- NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  doctor TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  category TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LAB RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  test_name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  normal_range TEXT,
  status TEXT CHECK (status IN ('normal', 'abnormal', 'borderline')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  body_part TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  facility TEXT,
  doctor TEXT,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ALLERGY REACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS allergy_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  drug_name TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEDICATION REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medication_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  times TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(medication_id)
);

-- ============================================
-- ADHERENCE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS adherence_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  timestamp BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EMERGENCY CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_doctor_id ON medications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_notes_patient_id ON notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_scans_patient_id ON scans(patient_id);
CREATE INDEX IF NOT EXISTS idx_allergy_reactions_patient_id ON allergy_reactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_patient_id ON medication_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_medication_id ON medication_reminders(medication_id);
CREATE INDEX IF NOT EXISTS idx_adherence_logs_medication_id ON adherence_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_adherence_logs_patient_id ON adherence_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient_id ON emergency_contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_access_code ON patients(access_code);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PATIENTS POLICIES
-- ============================================
-- Patients can view their own data
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = id);

-- Patients can update their own data
CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE USING (auth.uid() = id);

-- Patients can insert their own data (during signup)
CREATE POLICY "Patients can insert own data" ON patients
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Doctors can view patient data (via access code - handled in app logic)
-- Note: Access code verification happens in application layer
-- For now, we'll allow authenticated users to read patients table
-- You may want to restrict this further based on your security needs

-- ============================================
-- DOCTORS POLICIES
-- ============================================
-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT USING (auth.uid() = id);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE USING (auth.uid() = id);

-- Doctors can insert their own profile
CREATE POLICY "Doctors can insert own profile" ON doctors
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- MEDICATIONS POLICIES
-- ============================================
-- Patients can manage their own medications
CREATE POLICY "Patients can manage own medications" ON medications
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- MEDICAL RECORDS POLICIES
-- ============================================
-- Patients can manage their own records
CREATE POLICY "Patients can manage own records" ON medical_records
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- NOTES POLICIES
-- ============================================
-- Patients can manage their own notes
CREATE POLICY "Patients can manage own notes" ON notes
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- LAB RESULTS POLICIES
-- ============================================
-- Patients can manage their own lab results
CREATE POLICY "Patients can manage own lab results" ON lab_results
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- SCANS POLICIES
-- ============================================
-- Patients can manage their own scans
CREATE POLICY "Patients can manage own scans" ON scans
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- ALLERGY REACTIONS POLICIES
-- ============================================
-- Patients can manage their own reactions
CREATE POLICY "Patients can manage own reactions" ON allergy_reactions
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- MEDICATION REMINDERS POLICIES
-- ============================================
-- Patients can manage their own reminders
CREATE POLICY "Patients can manage own reminders" ON medication_reminders
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- ADHERENCE LOGS POLICIES
-- ============================================
-- Patients can manage their own adherence logs
CREATE POLICY "Patients can manage own adherence" ON adherence_logs
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- EMERGENCY CONTACTS POLICIES
-- ============================================
-- Patients can manage their own contacts
CREATE POLICY "Patients can manage own contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = patient_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for patients table
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for medication_reminders table
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON medication_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional - for testing)
-- ============================================
-- You can add sample data here if needed for testing
-- Note: This requires auth.users entries to exist first

COMMENT ON TABLE patients IS 'Patient profiles and access codes';
COMMENT ON TABLE doctors IS 'Doctor accounts and profiles';
COMMENT ON TABLE medications IS 'Patient medications and prescriptions';
COMMENT ON TABLE medical_records IS 'General medical records';
COMMENT ON TABLE notes IS 'Clinical notes from doctors';
COMMENT ON TABLE lab_results IS 'Laboratory test results';
COMMENT ON TABLE scans IS 'Medical scans (MRI, CT, X-ray, etc.)';
COMMENT ON TABLE allergy_reactions IS 'Documented allergy and adverse reactions';
COMMENT ON TABLE medication_reminders IS 'Medication reminder schedules';
COMMENT ON TABLE adherence_logs IS 'Medication adherence tracking logs';
COMMENT ON TABLE emergency_contacts IS 'Emergency contact information';

