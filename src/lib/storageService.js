// Hybrid storage service - uses Supabase if available, falls back to localStorage
import { patientService, medicationService, recordService, noteService, labService, allergyService, scanService, reminderService, adherenceService, emergencyService } from './database'
import { storage as localStorage } from '../utils/localStorage'
import { authService } from './auth'

const USE_SUPABASE = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL'

export const storageService = {
  // Patient operations
  getPatient: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await patientService.getPatient(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient()
      }
    }
    return localStorage.getPatient()
  },

  getPatientByAccessCode: async (accessCode) => {
    if (USE_SUPABASE) {
      try {
        return await patientService.getPatientByAccessCode(accessCode)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const patient = localStorage.getPatient()
        if (patient.accessCode === accessCode) return patient
        return null
      }
    }
    const patient = localStorage.getPatient()
    return patient.accessCode === accessCode ? patient : null
  },

  updatePatient: async (patientId, updates) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await patientService.updatePatient(patientId, updates)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const patient = localStorage.getPatient()
        Object.assign(patient, updates)
        localStorage.savePatient(patient)
        return patient
      }
    }
    const patient = localStorage.getPatient()
    Object.assign(patient, updates)
    localStorage.savePatient(patient)
    return patient
  },

  // Medication operations
  getMedications: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await medicationService.getMedications(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient().medications || []
      }
    }
    return localStorage.getPatient().medications || []
  },

  addMedication: async (patientId, medication) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await medicationService.addMedication({ ...medication, patient_id: patientId })
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.addMedication(medication)
      }
    }
    return localStorage.addMedication(medication)
  },

  getActiveMedications: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await medicationService.getActiveMedications(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const patient = localStorage.getPatient()
        return patient.medications || []
      }
    }
    const patient = localStorage.getPatient()
    return patient.medications || []
  },

  // Notes operations
  getNotes: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await noteService.getNotes(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient().notes || []
      }
    }
    return localStorage.getPatient().notes || []
  },

  addNote: async (patientId, note) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await noteService.addNote({ ...note, patient_id: patientId })
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.addNote(note)
      }
    }
    return localStorage.addNote(note)
  },

  // Lab results
  getLabResults: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await labService.getLabResults(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient().labResults || []
      }
    }
    return localStorage.getPatient().labResults || []
  },

  addLabResult: async (patientId, labResult) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await labService.addLabResult({ ...labResult, patient_id: patientId })
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const patient = localStorage.getPatient()
        if (!patient.labResults) patient.labResults = []
        patient.labResults.push({ ...labResult, id: Date.now() })
        localStorage.savePatient(patient)
        return labResult
      }
    }
    const patient = localStorage.getPatient()
    if (!patient.labResults) patient.labResults = []
    patient.labResults.push({ ...labResult, id: Date.now() })
    localStorage.savePatient(patient)
    return labResult
  },

  // Allergy reactions
  getReactions: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await allergyService.getReactions(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient().reactions || []
      }
    }
    return localStorage.getPatient().reactions || []
  },

  addReaction: async (patientId, reaction) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await allergyService.addReaction({ ...reaction, patient_id: patientId })
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const patient = localStorage.getPatient()
        if (!patient.reactions) patient.reactions = []
        patient.reactions.push({ ...reaction, id: Date.now() })
        localStorage.savePatient(patient)
        return reaction
      }
    }
    const patient = localStorage.getPatient()
    if (!patient.reactions) patient.reactions = []
    patient.reactions.push({ ...reaction, id: Date.now() })
    localStorage.savePatient(patient)
    return reaction
  },

  // Scans
  getScans: async (patientId) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await scanService.getScans(patientId)
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        return localStorage.getPatient().scans || []
      }
    }
    return localStorage.getPatient().scans || []
  },

  // Reminders
  saveReminder: async (patientId, reminder) => {
    if (USE_SUPABASE && patientId) {
      try {
        return await reminderService.saveReminder({ ...reminder, patient_id: patientId })
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
        const existingIndex = reminders.findIndex(r => r.medicationId === reminder.medicationId)
        if (existingIndex >= 0) {
          reminders[existingIndex] = reminder
        } else {
          reminders.push(reminder)
        }
        localStorage.setItem('medicationReminders', JSON.stringify(reminders))
        return reminder
      }
    }
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
    const existingIndex = reminders.findIndex(r => r.medicationId === reminder.medicationId)
    if (existingIndex >= 0) {
      reminders[existingIndex] = reminder
    } else {
      reminders.push(reminder)
    }
    localStorage.setItem('medicationReminders', JSON.stringify(reminders))
    return reminder
  },

  getReminder: (medicationId) => {
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
    return reminders.find(r => r.medicationId === medicationId)
  },
}

// Export auth service
export { authService }

