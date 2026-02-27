import { supabase } from './supabase'

// Authentication functions
export const authService = {
  // Sign up new patient
  signUp: async (email, password, patientData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Generate access code if not provided
        const accessCode = patientData.access_code || `MED-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        
        // Create patient record
        const { data, error } = await supabase
          .from('patients')
          .insert({
            id: authData.user.id,
            email: email,
            access_code: accessCode,
            ...patientData,
          })
          .select()
          .single()

        if (error) throw error
        return { user: authData.user, patient: data }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  // Sign in patient
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // Sign in doctor
  signInDoctor: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verify doctor role
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (doctorError || !doctor) {
        throw new Error('Not authorized as doctor')
      }

      return { user: data.user, doctor }
    } catch (error) {
      console.error('Doctor sign in error:', error)
      throw error
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

