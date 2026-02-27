# Supabase Setup Instructions

## ✅ Step 1: Environment Variables (Already Done!)

Your `.env` file has been created with your Supabase credentials:
- URL: `https://ytjfqvconchgbcnrkcyg.supabase.co`
- Anon Key: (configured)

**Note:** The `.env` file is in `.gitignore` to keep your credentials secure.

## 📋 Step 2: Create Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/ytjfqvconchgbcnrkcyg
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase_schema.sql` in this project
5. Copy the **entire contents** of `supabase_schema.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

### Option B: Using Supabase CLI (If you have it installed)

```bash
supabase db push
```

## 🔐 Step 3: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase Dashboard
2. **Email Auth Settings:**
   - Enable "Enable email confirmations" (optional for development)
   - For development, you can disable email confirmation
3. **Auth Providers:**
   - Email provider is enabled by default
   - You can add OAuth providers later if needed

## ✅ Step 4: Verify Setup

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `patients`
   - `doctors`
   - `medications`
   - `medical_records`
   - `notes`
   - `lab_results`
   - `scans`
   - `allergy_reactions`
   - `medication_reminders`
   - `adherence_logs`
   - `emergency_contacts`

3. Check **Authentication** → **Users** - should be empty initially

## 🚀 Step 5: Test the Application

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Test Patient Sign Up:
   - Go to Patient Portal
   - Click "Sign Up" (if Supabase is configured)
   - Enter email and password
   - A new patient record should be created

3. Test Patient Login:
   - Use the email/password you just created
   - Or use demo mode: Patient ID = "demo", Password = "patient123"

4. Test Doctor Access:
   - Login as patient
   - Copy the access code from "Share Access" section
   - Go to Doctor Portal
   - Enter doctor name and access code
   - Should see patient data

## 🔍 Troubleshooting

### "Table doesn't exist" error
- Make sure you ran the SQL schema script completely
- Check the SQL Editor for any errors
- Verify tables exist in Table Editor

### "Row Level Security policy violation"
- Check that RLS policies were created
- Verify the user is authenticated
- Check that `auth.uid()` matches the patient_id

### "Invalid Supabase URL" error
- Verify `.env` file exists in project root
- Check that `VITE_SUPABASE_URL` is correct
- Restart the dev server after changing `.env`

### Authentication not working
- Check Supabase Dashboard → Authentication → Settings
- Verify email confirmation settings
- Check browser console for errors

## 📝 Next Steps

1. **Create a test patient:**
   - Sign up with a test email
   - The patient record will be created automatically

2. **Test data operations:**
   - Add medications
   - Add lab results
   - Add allergy reactions
   - Check that data appears in Supabase Table Editor

3. **Test doctor access:**
   - Use patient access code to login as doctor
   - Verify doctor can see patient data

## 🔒 Security Notes

- Row Level Security (RLS) is enabled on all tables
- Patients can only access their own data
- Doctors access via patient-provided access codes
- All authentication is handled by Supabase Auth
- Never commit `.env` file to git (already in `.gitignore`)

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

