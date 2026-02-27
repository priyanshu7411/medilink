// Utility script to verify Supabase connection and setup
// Run this in browser console or as a test script

import { supabase } from '../lib/supabase'

export async function verifySupabaseSetup() {
  console.log('🔍 Verifying Supabase Setup...\n')
  
  try {
    // Test 1: Check connection
    console.log('1. Testing Supabase connection...')
    const { data, error } = await supabase.from('patients').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('❌ Tables not found! Please run the SQL schema from supabase_schema.sql')
        return false
      }
      console.error('❌ Connection error:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!\n')
    
    // Test 2: Check tables exist
    console.log('2. Checking required tables...')
    const tables = [
      'patients',
      'doctors',
      'medications',
      'notes',
      'lab_results',
      'scans',
      'allergy_reactions',
      'medication_reminders',
      'adherence_logs',
      'emergency_contacts'
    ]
    
    const missingTables = []
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('*').limit(0)
      if (tableError) {
        missingTables.push(table)
      }
    }
    
    if (missingTables.length > 0) {
      console.error('❌ Missing tables:', missingTables.join(', '))
      console.error('   Please run the SQL schema from supabase_schema.sql')
      return false
    }
    
    console.log('✅ All tables exist!\n')
    
    // Test 3: Check RLS policies
    console.log('3. Checking Row Level Security...')
    console.log('   (RLS policies should be enabled - check Supabase Dashboard)\n')
    
    // Test 4: Check auth
    console.log('4. Checking authentication...')
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log('✅ User is authenticated:', session.user.email)
    } else {
      console.log('ℹ️  No active session (this is normal if not logged in)')
    }
    
    console.log('\n✅ Supabase setup verification complete!')
    return true
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
    return false
  }
}

// Run verification if imported directly
if (import.meta.hot) {
  verifySupabaseSetup()
}

