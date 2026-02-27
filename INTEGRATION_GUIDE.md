# Supabase Integration Guide

## ✅ What's Been Done

1. **Supabase Client Setup** (`src/lib/supabase.js`)
   - Configured Supabase client with environment variables
   - Defined all table names as constants

2. **Authentication Service** (`src/lib/auth.js`)
   - Patient sign up and sign in
   - Doctor sign in
   - Session management
   - Auth state change listeners

3. **Database Service** (`src/lib/database.js`)
   - Complete CRUD operations for:
     - Patients
     - Medications
     - Medical Records
     - Notes
     - Lab Results
     - Allergy Reactions
     - Scans
     - Reminders
     - Adherence Logs
     - Emergency Contacts

4. **Hybrid Storage Service** (`src/lib/storageService.js`)
   - Automatically uses Supabase if credentials are configured
   - Falls back to localStorage for demo mode
   - Seamless transition between modes

5. **Updated Components**
   - `PatientLogin.jsx` - Now supports Supabase auth + demo mode
   - `App.jsx` - Integrated Supabase auth and storage
   - `AddPrescription.jsx` - Uses storageService
   - `AllergyReactions.jsx` - Uses storageService
   - `LabResults.jsx` - Uses storageService
   - `PrescriptionScanner.jsx` - Uses storageService

## 📋 Next Steps

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Add `.env` to `.gitignore` to keep credentials secure!

### 3. Create Database Tables

Run the SQL script from `SUPABASE_SETUP.md` in your Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the entire SQL script from `SUPABASE_SETUP.md`
3. Run it to create all tables and policies

### 4. Test the Integration

1. Start the dev server: `npm run dev`
2. Try signing up a new patient (if Supabase is configured)
3. Or use demo mode (if Supabase is not configured)

## 🔄 How It Works

### Demo Mode (No Supabase)
- Works exactly as before
- Uses localStorage for all data
- Patient ID: `demo`, Password: `patient123`

### Production Mode (With Supabase)
- All data stored in Supabase database
- Real authentication with email/password
- Row Level Security (RLS) protects patient data
- Doctors access via patient access codes

## 📊 Database Schema

The following tables are created:

- `patients` - Patient profiles and access codes
- `doctors` - Doctor accounts
- `medications` - Patient medications
- `medical_records` - General medical records
- `notes` - Clinical notes
- `lab_results` - Lab test results
- `scans` - Medical scans (MRI, CT, etc.)
- `allergy_reactions` - Documented allergies
- `medication_reminders` - Reminder schedules
- `adherence_logs` - Medication adherence tracking
- `emergency_contacts` - Emergency contact information

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Patients can only access their own data
- Doctors access via patient-provided access codes
- All authentication handled by Supabase Auth

## 🐛 Troubleshooting

### "Invalid Supabase URL" error
- Check your `.env` file has correct `VITE_SUPABASE_URL`
- Restart the dev server after changing `.env`

### "Table doesn't exist" error
- Run the SQL script from `SUPABASE_SETUP.md`
- Check table names match in `src/lib/supabase.js`

### Authentication not working
- Verify your Supabase project is active
- Check email confirmation settings in Supabase Auth
- For development, you may need to disable email confirmation

### Data not saving
- Check browser console for errors
- Verify RLS policies allow the operation
- Check network tab for API errors

## 📝 Notes

- The app automatically detects if Supabase is configured
- If `VITE_SUPABASE_URL` is not set or is `YOUR_SUPABASE_URL`, it uses localStorage
- All components work in both modes seamlessly
- Data format is normalized to work with both storage methods

