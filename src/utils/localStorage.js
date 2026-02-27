export const storage = {
  getPatient: () => {
    const data = localStorage.getItem('patient')
    if (data) {
      return JSON.parse(data)
    }
    
    // Create new patient with fixed access code
    const newPatient = {
      name: 'Rajesh Kumar',
      age: 67,
      bloodGroup: 'B+',
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      allergies: ['Penicillin'],
      medications: [
        {
          id: Date.now() - 1000000,
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          doctor: 'Dr. Sharma',
          addedDate: new Date(Date.now() - 86400000 * 30).toISOString()
        },
        {
          id: Date.now() - 900000,
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          doctor: 'Dr. Patel',
          addedDate: new Date(Date.now() - 86400000 * 20).toISOString()
        },
        {
          id: Date.now() - 800000,
          name: 'Atorvastatin',
          dosage: '10mg',
          frequency: 'Bedtime',
          doctor: 'Dr. Kumar',
          addedDate: new Date(Date.now() - 86400000 * 15).toISOString()
        }
      ],
      notes: [
        {
          id: Date.now() - 700000,
          content: 'Patient responding well to diabetes management. Continue current dosage.',
          doctor: 'Dr. Sharma',
          date: new Date(Date.now() - 86400000 * 10).toISOString()
        }
      ],
      scans: [
        {
          id: Date.now() - 600000,
          type: 'CT Scan',
          bodyPart: 'Chest',
          date: new Date(Date.now() - 86400000 * 45).toISOString(),
          facility: 'City Hospital',
          doctor: 'Dr. Sharma',
          description: 'CT scan of chest showing normal lung fields. No abnormalities detected.',
          fileUrl: '#'
        },
        {
          id: Date.now() - 500000,
          type: 'MRI',
          bodyPart: 'Brain',
          date: new Date(Date.now() - 86400000 * 60).toISOString(),
          facility: 'City Hospital',
          doctor: 'Dr. Patel',
          description: 'MRI brain scan - routine checkup. All findings within normal limits.',
          fileUrl: '#'
        },
        {
          id: Date.now() - 400000,
          type: 'X-Ray',
          bodyPart: 'Chest',
          date: new Date(Date.now() - 86400000 * 90).toISOString(),
          facility: 'City Hospital',
          doctor: 'Dr. Kumar',
          description: 'Chest X-ray showing clear lung fields. Heart size normal.',
          fileUrl: '#'
        }
      ],
      accessCode: 'MED-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    }
    
    // Save to localStorage immediately so access code stays consistent
    localStorage.setItem('patient', JSON.stringify(newPatient))
    return newPatient
  },
  
  savePatient: (patient) => {
    localStorage.setItem('patient', JSON.stringify(patient))
  },
  
  addMedication: (med) => {
    const patient = storage.getPatient()
    patient.medications.push({
      ...med,
      id: Date.now(),
      addedDate: new Date().toISOString()
    })
    storage.savePatient(patient)
    return patient
  },
  
  addNote: (note) => {
    const patient = storage.getPatient()
    patient.notes.push({
      ...note,
      id: Date.now(),
      date: new Date().toISOString()
    })
    storage.savePatient(patient)
    return patient
  },
  
  addScan: (scan) => {
    const patient = storage.getPatient()
    if (!patient.scans) {
      patient.scans = []
    }
    patient.scans.push({
      ...scan,
      id: Date.now(),
      date: new Date().toISOString()
    })
    storage.savePatient(patient)
    return patient
  },
  
  getScans: () => {
    const patient = storage.getPatient()
    return patient.scans || []
  }
}

