import { supabase, TABLES } from './supabase'

// Patient operations
export const patientService = {
  // Get patient by ID
  getPatient: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .select('*')
        .eq('id', patientId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get patient error:', error)
      throw error
    }
  },

  // Get patient by access code
  getPatientByAccessCode: async (accessCode) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .select('*')
        .eq('access_code', accessCode)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get patient by access code error:', error)
      throw error
    }
  },

  // Update patient
  updatePatient: async (patientId, updates) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .update(updates)
        .eq('id', patientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update patient error:', error)
      throw error
    }
  },
}

// Medication operations
export const medicationService = {
  // Get medications for patient
  getMedications: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEDICATIONS)
        .select('*')
        .eq('patient_id', patientId)
        .order('added_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get medications error:', error)
      throw error
    }
  },

  // Add medication
  addMedication: async (medication) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEDICATIONS)
        .insert({
          ...medication,
          added_date: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add medication error:', error)
      throw error
    }
  },

  // Get active medications
  getActiveMedications: async (patientId) => {
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from(TABLES.MEDICATIONS)
        .select('*')
        .eq('patient_id', patientId)
        .or(`end_date.is.null,end_date.gt.${now}`)
        .order('added_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get active medications error:', error)
      throw error
    }
  },
}

// Medical records operations
export const recordService = {
  // Get medical records for patient
  getMedicalRecords: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEDICAL_RECORDS)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get medical records error:', error)
      throw error
    }
  },

  // Add medical record
  addMedicalRecord: async (record) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEDICAL_RECORDS)
        .insert({
          ...record,
          date: record.date || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add medical record error:', error)
      throw error
    }
  },
}

// Notes operations
export const noteService = {
  // Get notes for patient
  getNotes: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get notes error:', error)
      throw error
    }
  },

  // Add note
  addNote: async (note) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .insert({
          ...note,
          date: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add note error:', error)
      throw error
    }
  },
}

// Lab results operations
export const labService = {
  // Get lab results for patient
  getLabResults: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.LAB_RESULTS)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get lab results error:', error)
      throw error
    }
  },

  // Add lab result
  addLabResult: async (labResult) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.LAB_RESULTS)
        .insert({
          ...labResult,
          date: labResult.date || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add lab result error:', error)
      throw error
    }
  },
}

// Allergy reactions operations
export const allergyService = {
  // Get reactions for patient
  getReactions: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ALLERGY_REACTIONS)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get reactions error:', error)
      throw error
    }
  },

  // Add reaction
  addReaction: async (reaction) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ALLERGY_REACTIONS)
        .insert({
          ...reaction,
          date: reaction.date || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add reaction error:', error)
      throw error
    }
  },
}

// Scans operations
export const scanService = {
  // Get scans for patient
  getScans: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SCANS)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get scans error:', error)
      throw error
    }
  },

  // Add scan
  addScan: async (scan) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SCANS)
        .insert({
          ...scan,
          date: scan.date || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add scan error:', error)
      throw error
    }
  },
}

// Reminders operations
export const reminderService = {
  // Get reminders for patient
  getReminders: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.REMINDERS)
        .select('*')
        .eq('patient_id', patientId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get reminders error:', error)
      throw error
    }
  },

  // Save reminder
  saveReminder: async (reminder) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.REMINDERS)
        .upsert(reminder, { onConflict: 'medication_id' })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Save reminder error:', error)
      throw error
    }
  },
}

// Adherence operations
export const adherenceService = {
  // Get adherence logs
  getAdherenceLogs: async (medicationId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ADHERENCE_LOGS)
        .select('*')
        .eq('medication_id', medicationId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get adherence logs error:', error)
      throw error
    }
  },

  // Log adherence
  logAdherence: async (log) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ADHERENCE_LOGS)
        .insert({
          ...log,
          date: new Date().toISOString(),
          timestamp: Date.now(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Log adherence error:', error)
      throw error
    }
  },
}

// Emergency contacts operations
export const emergencyService = {
  // Get emergency contacts
  getEmergencyContacts: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMERGENCY_CONTACTS)
        .select('*')
        .eq('patient_id', patientId)
        .order('is_primary', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get emergency contacts error:', error)
      throw error
    }
  },

  // Add emergency contact
  addEmergencyContact: async (contact) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMERGENCY_CONTACTS)
        .insert(contact)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add emergency contact error:', error)
      throw error
    }
  },
}

